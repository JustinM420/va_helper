// /app/api/get-profile.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust based on your database configuration
import { userProfiles } from "@/lib/db/schema"; // Import your correct schema for userProfiles
import { eq } from "drizzle-orm"; // Use Drizzle's query functions
import { auth } from "@clerk/nextjs/server";  // Clerk's authentication

export async function GET(request: Request) {
  try {
    // Check for authenticated session using Clerk
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query the userProfiles table for the profile with the given userId
    const userProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    // If no profile is found, return a 404 error
    if (!userProfile || userProfile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Return the profile data
    return NextResponse.json(userProfile[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 });
  }
}
