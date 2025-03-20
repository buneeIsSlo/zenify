import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useSpotifyPlaybackStore } from "@/hooks/use-spotify-playback-store";

interface SongProps {
  track: Spotify.Track;
  index: number;
}

export default function Song({ track, index }: SongProps) {
  const { playback, playTrackAt, togglePlayback } = useSpotifyPlaybackStore();
  const { isPlaying, currentTrack } = playback;

  const isCurrentlyPlaying = currentTrack?.name === track.name;

  const handlePlay = () => {
    if (isCurrentlyPlaying) {
      togglePlayback();
    } else {
      playTrackAt(track.uri, index);
    }
  };

  return (
    <div
      className="flex items-center justify-between rounded-md bg-secondary p-4"
      data-song-index={index}
      data-track-id={track.id}
      data-track-name={track.name}
    >
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
