import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { spotifyApi } from "@/lib/spotify";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Use spotifyApi to make a dummy request to refresh the token if needed
    // This call will handle token refresh if necessary
    await spotifyApi(userId, "https://api.spotify.com/v1/me");

    // After the spotifyApi call, the access token in the database is guaranteed to be valid
    // Retrieve the account from the database to get the latest access token
    const account = await prisma.account.findFirst({
      where: {
        userId,
        providerId: "spotify",
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Spotify account not found" },
        { status: 404 },
      );
    }

    const accessToken = account.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found in database" },
        { status: 404 },
      );
    }

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing/verifying token:", error);
    return NextResponse.json(
      { error: "Failed to refresh/verify token" },
      { status: 500 },
    );
  }
}
