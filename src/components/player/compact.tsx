import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { PlaybackProgress } from "@/app/(core)/playback-progress";
import { PlayerUIProps } from "./basic";
import { EmptyState } from "./empty-state";

export const CompactPlayer = ({
  currentTrack,
  isPlaying,
  position,
  duration,
  onTogglePlay,
  onSeek,
}: PlayerUIProps) => {
  if (!currentTrack) {
    return <EmptyState />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 p-2 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentTrack?.album.images[0]?.url && (
            <img
              src={currentTrack.album.images[0].url}
              alt="Album cover"
              className="h-10 w-10 rounded"
            />
          )}
          <div className="max-w-[150px] truncate text-sm">
            {currentTrack ? currentTrack.name : "Select a track"}
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="text-white hover:bg-zinc-800"
          onClick={onTogglePlay}
        >
          {isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>

        <div className="w-1/3">
          <PlaybackProgress
            position={position}
            duration={duration}
            onSeek={onSeek}
          />
        </div>
      </div>
    </div>
  );
};
