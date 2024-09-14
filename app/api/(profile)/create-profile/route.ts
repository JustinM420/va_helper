import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust based on your database configuration
import { userProfiles } from "@/lib/db/schema"; // Import the correct schema for userProfiles
import { auth } from "@clerk/nextjs/server";  // Import Clerk's auth verification

export async function POST(request: Request) {
  try {
    // Check for authenticated session using Clerk
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();

    // Destructure the fields from the request body
    const { email, firstName, lastName, ssn, dateOfBirth, phoneNumber, street, city, state, zipCode } = body;

    // Insert the new profile into the userProfiles table
    const insertedProfile = await db
      .insert(userProfiles)
      .values({
        userId,  // Clerk user ID
        email,
        firstName,
        lastName,
        ssn,
        dateOfBirth,
        phoneNumber,
        street,
        city,
        state,
        zipCode,
      })
      .returning({ insertedId: userProfiles.userId });

    console.log("User profile successfully inserted with ID:", insertedProfile[0].insertedId);

    return NextResponse.json(
      {
        message: "Profile created successfully",
        profileId: insertedProfile[0].insertedId,
      },
      { status: 200 }
    );
  } catch (dbError) {
    console.error("Error inserting user profile into the database:", dbError);
    return NextResponse.json({ error: "Database insertion failed" }, { status: 500 });
  }
}
