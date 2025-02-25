import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

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
  return (
    <div className="flex items-center justify-between rounded p-2 hover:bg-gray-100">
      <div>
        <img
          src={track.album.images[0].url}
          alt={track.name}
          className="mr-4 h-12 w-12"
        />
        <p>Title: {track.name}</p>
        <p>Artist: {track.artists.map((artist) => artist.name).join(", ")}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onPlay(track.uri)}>
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
}
