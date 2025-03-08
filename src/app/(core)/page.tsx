import { Music } from "lucide-react";
import Sidebar from "./sidebar";
import SpotifyPlayback from "@/components/spotify-playback";

export default function Page() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between bg-neutral-100 p-4">
        <h1 className="text-3xl font-bold">Zenify</h1>
        <Sidebar />
      </header>
      <main className="flex-1 p-5">
        <section className="grid h-full place-content-center">
          <div>
            <Music className="mx-auto size-16" />
            <h1 className="py-4 text-center text-lg text-zinc-500">
              Start playing your music
            </h1>
          </div>
        </section>
      </main>
      <SpotifyPlayback />
    </div>
  );
}
