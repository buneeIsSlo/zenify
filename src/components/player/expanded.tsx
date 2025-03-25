import { Button } from "@/components/ui/button";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { PlaybackProgress } from "@/app/(core)/playback-progress";
import { PlayerUIProps } from "./basic";
import { EmptyState } from "./empty-state";
import { Slider } from "@/components/ui/slider";

export const ExpandedPlayer = ({
  currentTrack,
  isPlaying,
  position,
  duration,
  onTogglePlay,
  onSeek,
  onNext,
  onPrevious,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: PlayerUIProps) => {
  if (!currentTrack) {
    return <EmptyState />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500/40 via-purple-500/20 to-pink-500/20 p-4 text-white backdrop-blur-2xl">
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

        <div className="flex w-full max-w-[200px] items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={onToggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="size-5" />
            ) : (
              <Volume2 className="size-5" />
            )}
          </Button>
          <Slider
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            className="flex-1"
            onValueChange={(value) => onVolumeChange(value[0] / 100)}
          />
        </div>
      </div>
    </div>
  );
};
