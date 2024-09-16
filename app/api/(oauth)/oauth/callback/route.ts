// app/api/oauth/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers"; // Import cookies helper

export async function GET(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(
      "/error?message=Missing+code+or+state"
    );
  }

  // Retrieve the state from the cookies
  const cookieStore = cookies();
  const storedState = cookieStore.get("oauth_state")?.value;

  if (state !== storedState) {
    return NextResponse.redirect("/error?message=Invalid+state");
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      process.env.VA_TOKEN_URL!,
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.OAUTH_REDIRECT_URI!,
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Store tokens securely associated with the user
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        vaAccessToken: access_token,
        vaRefreshToken: refresh_token,
        vaTokenExpiry: Date.now() + expires_in * 1000,
      },
    });

    // Clear the oauth_state cookie
    const response = NextResponse.redirect("/profile");
    response.cookies.set("oauth_state", "", { maxAge: 0 });

    return response;
  } catch (error: any) {
    console.error(
      "OAuth Callback Error:",
      error.response?.data || error.message
    );
    return NextResponse.redirect(
      "/error?message=Authentication+failed"
    );
  }
}
