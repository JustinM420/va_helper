// /app/api/(profile)/update-profile/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust this based on your database configuration
import { userProfiles } from "@/lib/db/schema"; // Assuming you have a userProfiles schema
import { auth } from "@clerk/nextjs/server";  // Clerk's auth verification
import { eq } from "drizzle-orm"; // Import the equality function

export async function PUT(request: Request) {
  try {
    // Check for authenticated session using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get the updated data
    const body = await request.json();
    const { firstName, lastName, phoneNumber, street, city, state, zipCode } = body;

    // Update the user profile in the database
    const updatedProfile = await db
      .update(userProfiles)
      .set({
        firstName,
        lastName,
        phoneNumber,
        street,
        city,
        state,
        zipCode,
      })
      .where(eq(userProfiles.userId, userId))  // Use `eq` function for equality check
      .returning({
        firstName: userProfiles.firstName,
        lastName: userProfiles.lastName,
        phoneNumber: userProfiles.phoneNumber,
        street: userProfiles.street,
        city: userProfiles.city,
        state: userProfiles.state,
        zipCode: userProfiles.zipCode,
      });  // Specify the exact fields to return

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile[0],
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
