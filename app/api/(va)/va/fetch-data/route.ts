import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/lib/db'; 
import { serviceHistories, disabilities, userProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
 

export async function GET(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    let {
      vaAccessToken,
      vaRefreshToken,
      vaTokenExpiry,
    } = user.privateMetadata as {
      vaAccessToken: string;
      vaRefreshToken: string;
      vaTokenExpiry: number;
    };

    // Check if access token is expired
    if (Date.now() >= vaTokenExpiry) {
      // Refresh the token
      const tokenResponse = await axios.post(
        process.env.VA_TOKEN_URL!,
        qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: vaRefreshToken,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // Update tokens in user's private metadata
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          vaAccessToken: access_token,
          vaRefreshToken: refresh_token,
          vaTokenExpiry: Date.now() + expires_in * 1000,
        },
      });

      vaAccessToken = access_token;
    }

    // Fetch Service History
    const serviceHistoryResponse = await axios.get(
      `${process.env.VA_VERIFICATION_API_BASE_URL}/service_history`,
      {
        headers: {
          Authorization: `Bearer ${vaAccessToken}`,
        },
      }
    );

    // Fetch Disability Rating
    const disabilityRatingResponse = await axios.get(
      `${process.env.VA_VERIFICATION_API_BASE_URL}/disability_rating`,
      {
        headers: {
          Authorization: `Bearer ${vaAccessToken}`,
        },
      }
    );

    // Clear existing records for the user
    await db.delete(serviceHistories).where(eq(serviceHistories.userId, userId));
    await db.delete(disabilities).where(eq(disabilities.userId, userId));


    // Map and Store Service History
    const serviceHistoryData = serviceHistoryResponse.data.data.map(
      (service: any) => ({
        userId,
        branchOfService: service.branch_of_service,
        startDate: service.start_date,
        endDate: service.end_date,
        dischargeStatus: service.discharge_status,
        rankAtDischarge: service.pay_grade,
        mos: service.mos,
      })
    );

    // Insert service history into the database
    await db.insert(serviceHistories).values(serviceHistoryData);

    // Map and Store Disabilities
    const disabilityData = disabilityRatingResponse.data.data.individual_ratings.map(
      (disability: any) => ({
        userId,
        name: disability.name,
        disabilityRating: disability.rating_percentage,
        effectiveDate: disability.effective_date,
      })
    );

    // Insert disabilities into the database
    await db.insert(disabilities).values(disabilityData);

    // Update combined disability rating in userProfiles
    const combinedRating =
      disabilityRatingResponse.data.data.combined_disability_rating;
    await db.update(userProfiles)
      .set({ combinedDisabilityRating: combinedRating })
      .where(eq(userProfiles.userId, userId));

    return NextResponse.json({ message: 'Data fetched and stored successfully' });
  } catch (error: any) {
    console.error('VA API Fetch Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch and store data from VA API' },
      { status: 500 }
    );
  }
}
