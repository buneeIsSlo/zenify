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
      className="flex items-center justify-between border-b-[1px] p-4"
      data-song-index={index}
      data-track-id={track.id}
      data-track-name={track.name}
    >
      <div className="flex items-center gap-2">
        <img
          src={track.album.images[0].url}
          alt={track.name}
          className="block size-10"
        />
        <div className="">
          <h3
            className={`line-clamp-1 max-w-[190px] break-all font-semibold ${
              isCurrentlyPlaying && isPlaying
                ? "bg-gradient-to-l from-[#06b6d4] via-[#2563eb] to-[#6366f1] bg-clip-text text-transparent"
                : ""
            }`}
          >
            {track.name}
          </h3>
          <p className="line-clamp-1 max-w-[190px] break-all text-sm text-zinc-500">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </div>
      <Button
        size={"icon"}
        onClick={handlePlay}
        variant={"outline"}
        className={
          isCurrentlyPlaying && isPlaying
            ? "border-none bg-gradient-to-l from-[#06b6d4] via-[#2563eb] to-[#6366f1] text-white hover:text-white"
            : ""
        }
      >
        {isCurrentlyPlaying && isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
      </Button>
    </div>
  );
}
