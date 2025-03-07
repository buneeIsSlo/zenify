import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { PlaybackContext } from "@/components/playback-context";
import { useContext } from "react";

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
  onPlay: (uri: string) => void;
}

export default function Song({ track, onPlay }: SongProps) {
  const { currentTrackUri } = useContext(PlaybackContext);
  const isCurrentlyPlaying = currentTrackUri === track.uri;
  const { isPlaying } = useContext(PlaybackContext);

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
      <Button size={"icon"} onClick={() => onPlay(track.uri)}>
        {isCurrentlyPlaying && isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
      </Button>
    </div>
  );
}
