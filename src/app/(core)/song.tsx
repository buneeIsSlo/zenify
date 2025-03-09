import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useSpotifyPlaybackStore } from "@/hooks/use-spotify-playback-store";

interface SongProps {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    uri: string; // Spotify URI needed for playback
    album: {
      images: { url: string }[];
    };
  };
}

export default function Song({ track }: SongProps) {
  const { currentTrackUri, isPlaying, setCurrentTrackUri, togglePlayback } =
    useSpotifyPlaybackStore();

  const isCurrentlyPlaying = currentTrackUri === track.uri;

  const handlePlay = () => {
    if (isCurrentlyPlaying) {
      // This will both update the state and control the player
      togglePlayback();
    } else {
      // Start a new track
      setCurrentTrackUri(track.uri);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md bg-neutral-100 p-4">
      <div>
        <h3
          className={`font-semibold ${
            isCurrentlyPlaying && isPlaying ? "text-blue-500" : ""
          }`}
        >
          {track.name}
        </h3>
        <p className="text-sm text-zinc-500">
          {track.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
      <Button size={"icon"} onClick={handlePlay}>
        {isCurrentlyPlaying && isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
      </Button>
    </div>
  );
}
