import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2, Disc3 } from "lucide-react";
import { useSpotifyPlaybackStore } from "@/hooks/use-spotify-playback-store";

interface SongProps {
  track: Spotify.Track;
  index: number;
}

export default function Song({ track, index }: SongProps) {
  const { playback, playTrackAt, togglePlayback, findTrackByName } =
    useSpotifyPlaybackStore();
  const { isPlaying, currentTrack, loadingTrackUri } = playback;

  const isCurrentTrack = findTrackByName(track.name, track.artists[0].name);
  const isLoading = loadingTrackUri === track.uri;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlayback();
    } else {
      playTrackAt(track.uri, index);
    }
  };

  return (
    <div
      className="flex cursor-default items-center justify-between border-b-[1px] p-4"
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
          <div className="flex items-center gap-1 text-neutral-200">
            <h3
              className={`line-clamp-1 max-w-[190px] break-all ${
                isCurrentTrack
                  ? "bg-gradient-to-l from-[#06b6d4] via-[#2563eb] to-[#6366f1] bg-clip-text font-semibold text-transparent"
                  : ""
              }`}
            >
              {track.name}
            </h3>
            {isPlaying && isCurrentTrack && (
              <Disc3 className="size-4 animate-spin text-[#06b6d4]" />
            )}
          </div>
          <p className="line-clamp-1 max-w-[190px] break-all text-sm text-zinc-500">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </div>
      <Button
        size={"icon"}
        onClick={handlePlay}
        variant={"outline"}
        disabled={isLoading}
        className={
          isCurrentTrack
            ? "border-none bg-gradient-to-l from-[#06b6d4] via-[#2563eb] to-[#6366f1] text-white hover:text-white"
            : ""
        }
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isCurrentTrack && isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
      </Button>
    </div>
  );
}
