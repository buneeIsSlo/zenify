import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { spotifyApi } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  const offset = Number(req.nextUrl.searchParams.get("offset") || "0");
  const limit = 15;

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized request" }, { status: 401 });
  }

  try {
    const response = await spotifyApi(
      session.user.id,
      `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
    );

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching liked songs: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
