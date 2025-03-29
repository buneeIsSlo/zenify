import { Button } from "@/components/ui/button";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { PlayerUIProps } from "./classic";
import { EmptyState } from "./empty-state";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";

export const PassportPlayer = ({
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
    <div className="fixed bottom-12 left-1/2 z-50 w-96 -translate-x-1/2 transform rounded-3xl bg-gradient-to-l from-[#06b6d4] via-[#2563eb] to-[#6366f1] p-5 text-white shadow-xl backdrop-blur-lg">
      <div className="flex flex-col gap-3">
        {/* Title */}
        <div>
          <h3 className="text-lg font-medium">{currentTrack.name}</h3>
          <p className="text-sm text-muted-foreground">
            {currentTrack.artists.map((a) => a.name).join(", ")}
          </p>
        </div>

        {/* Main content */}
        <div className="flex items-center gap-5">
          {/* Album Art */}
          <div className="flex-shrink-0">
            {currentTrack?.album.images[0]?.url ? (
              <img
                src={currentTrack.album.images[0].url}
                alt="Album cover"
                className="h-16 w-16 rounded-xl"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                <span className="text-sm font-bold">No Image</span>
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="flex w-full flex-col gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-accent"
              onClick={onToggleMute}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </Button>
            <Slider
              value={[volume * 100]}
              min={0}
              max={100}
              step={1}
              className="flex-1"
              thumbVariant="hover"
              trackHeight="sm"
              thumbSize="sm"
              trackColor="bg-white/20"
              rangeColor="bg-white"
              onValueChange={(value) => onVolumeChange(value[0] / 100)}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-2">
          <Slider
            value={[position]}
            max={duration}
            step={100}
            thumbVariant="custom"
            trackHeight="md"
            trackColor="bg-white/20"
            rangeColor="bg-white"
            thumbColor="text-white"
            onValueChange={(value) => onSeek(value[0])}
          />
          <div className="mt-1 flex justify-between text-xs text-white/80">
            <span>{formatTime(position)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="mt-1 flex justify-center gap-8">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full hover:bg-accent"
            onClick={onPrevious}
          >
            <SkipBack className="size-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-accent/20 backdrop-blur-sm hover:bg-accent/30"
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5 pl-0.5" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full hover:bg-accent"
            onClick={onNext}
          >
            <SkipForward className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
