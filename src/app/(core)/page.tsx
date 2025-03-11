"use client";

import { Music } from "lucide-react";
import Sidebar from "./sidebar";
import SpotifyPlayback from "@/components/spotify-playback";
import { useSpotifyPlaybackStore } from "@/hooks/use-spotify-playback-store";

const NowPlaying = () => {
  const { playback } = useSpotifyPlaybackStore();
  const { currentTrack } = playback;

  if (!currentTrack) {
    return (
      <div>
        <Music className="mx-auto size-16" />
        <h1 className="py-4 text-center text-lg text-zinc-500">
          Start playing your music
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <img
        src={currentTrack.album.images[0]?.url}
        alt="Album Cover"
        className="h-48 w-48 rounded-md object-cover shadow-md"
      />
      <h1 className="py-4 text-center text-lg text-zinc-500">
        {currentTrack.name}
      </h1>
      <p className="text-sm text-zinc-500">
        {currentTrack.artists.map((artist) => artist.name).join(", ")}
      </p>
    </div>
  );
};

export default function Page() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between bg-neutral-100 p-4">
        <h1 className="text-3xl font-bold">Zenify</h1>
        <Sidebar />
      </header>
      <main className="flex-1 p-5">
        <section className="grid h-full place-content-center">
          <NowPlaying />
        </section>
      </main>
      <SpotifyPlayback />
    </div>
  );
}
