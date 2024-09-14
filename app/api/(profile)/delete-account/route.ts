import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";  // Adjust path to your db module
import { userProfiles } from "@/lib/db/schema";  // Adjust path to your schema module
import { eq } from "drizzle-orm";  // Drizzle ORM equality function

export async function DELETE() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Step 1: Attempt to delete user profile data from the database
    const deleteResult = await db.delete(userProfiles).where(eq(userProfiles.userId, userId));

    // Check if the database deletion was successful
    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: "Profile deletion failed" }, { status: 500 });
    }

    // Step 2: If profile data deletion succeeded, delete the Clerk user account
    await clerkClient.users.deleteUser(userId);

    return NextResponse.json({ message: "User and profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
