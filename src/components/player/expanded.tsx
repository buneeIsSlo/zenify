import { Button } from "@/components/ui/button";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { PlaybackProgress } from "@/app/(core)/playback-progress";
import { PlayerUIProps } from "./basic";
import { EmptyState } from "./empty-state";

export const ExpandedPlayer = ({
  currentTrack,
  isPlaying,
  position,
  duration,
  onTogglePlay,
  onSeek,
  onNext,
  onPrevious,
}: PlayerUIProps) => {
  if (!currentTrack) {
    return <EmptyState />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white">
      <div className="flex flex-col items-center gap-3">
        {currentTrack?.album.images[0]?.url && (
          <img
            src={currentTrack.album.images[0].url}
            alt="Album cover"
            className="h-16 w-16 rounded-lg shadow-lg"
          />
        )}

        <div className="text-center">
          <div className="font-bold">
            {currentTrack ? currentTrack.name : "Select a track"}
          </div>
          {currentTrack && (
            <div className="text-sm opacity-80">
              {currentTrack.artists.map((a) => a.name).join(", ")}
            </div>
          )}
        </div>

        <div className="w-full max-w-md">
          <PlaybackProgress
            position={position}
            duration={duration}
            onSeek={onSeek}
          />
        </div>

        <div className="mt-2 flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={onPrevious}
          >
            <SkipBack className="size-5" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="h-12 w-12 rounded-full bg-white text-purple-600 hover:bg-white/90"
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause className="size-6" />
            ) : (
              <Play className="size-6" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={onNext}
          >
            <SkipForward className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
