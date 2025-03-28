"use client";

import Sidebar from "./sidebar";
import SpotifyPlayback from "@/components/spotify-playback";
import { useBackgroundStore } from "@/components/animated-backgrounds-selector";

export default function Page() {
  const { component: AnimatedBackground } = useBackgroundStore();

  return (
    <div className="relative flex h-screen w-full flex-col">
      <div className="absolute left-0 top-0 -z-10 h-full w-full">
        <AnimatedBackground />
      </div>
      <header className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold">Zenify</h1>
        <Sidebar />
      </header>
      <main className="relative flex-1 p-5">
        <SpotifyPlayback />
      </main>
    </div>
  );
}
