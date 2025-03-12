"use client";

import Sidebar from "./sidebar";
import SpotifyPlayback from "@/components/spotify-playback";
import { PlayerVariantSelector } from "@/components/player/player-variant-selector";

export default function Page() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold">Zenify</h1>
        <Sidebar />
      </header>
      <main className="relative flex-1 p-5">
        <PlayerVariantSelector />
      </main>
      <SpotifyPlayback />
    </div>
  );
}
