import prisma from "./prisma";

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

async function refreshSpotifytoken(userId: string): Promise<string> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "spotify",
    },
  });

  if (!account?.refreshToken) {
    throw new Error("No refresh token found");
  }

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refreshToken,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to refresh token");
  }

  const data: SpotifyTokenResponse = await tokenResponse.json();

  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      accessToken: data.access_token,
      accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      refreshToken: data.refresh_token ?? account.refreshToken,
    },
  });

  return data.access_token;
}

export async function spotifyApi(
  userId: string,
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "spotify",
    },
  });

  if (!account) {
    throw new Error("No spotify account found");
  }

  const isExpired =
    !account.accessTokenExpiresAt ||
    account.accessTokenExpiresAt.getTime() - 5 * 60 * 1000 < Date.now(); // Less than 5mins left

  const accessToken = isExpired
    ? await refreshSpotifytoken(userId)
    : account.accessToken;

  const response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`spotify API error: ${response.status}`);
  }

  return response;
}
