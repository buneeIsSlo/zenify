import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  const { searchParams } = new URL(req.url);
  const offset = Number(searchParams.get("offset")) || 0;
  const limit = 15;

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized request" }, { status: 401 });
  }

  try {
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "spotify",
      },
    });

    if (!account?.accessToken) {
      return Response.json({ error: "No access token found" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${account.accessToken}`,
        },
      },
    );

    if (!response.ok) {
      console.error(
        "Spotify API error: ",
        response.status,
        response.statusText,
      );
      return Response.json(
        { error: "Failed to fetch liked songs from Spotify" },
        { status: 500 },
      );
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching liked songs: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
