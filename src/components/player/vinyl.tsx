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

export const VinylPlayer = ({
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
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-80 flex-col items-center justify-center border-t border-gray-800 bg-black/70 p-4 backdrop-blur-lg">
      <div className="flex w-full max-w-4xl items-center justify-center gap-8">
        {/* Vinyl record */}
        <div className="flex-shrink-0">
          <div className="relative h-56 w-56">
            <div
              className={`absolute inset-0 rounded-full bg-black shadow-md transition-all duration-500 ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "4s" }}
            >
              {/* Center label */}
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full border-4 border-white shadow-inner">
                <img
                  src={currentTrack.album.images[0].url}
                  alt="Album cover"
                  className="size-10 rounded-md"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Track info and controls */}
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {currentTrack.name}
            </h2>
            <p className="text-md text-gray-300">
              {currentTrack.artists.map((a) => a.name).join(", ")}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {currentTrack.album.name}
            </p>
          </div>

          {/* Playback progress */}
          <div className="flex w-full items-center gap-3">
            <span className="w-12 text-sm font-medium text-gray-300">
              {formatTime(position)}
            </span>
            <Slider
              value={[position]}
              max={duration}
              step={100}
              thumbVariant="hidden"
              trackHeight="md"
              trackColor="bg-white/20"
              rangeColor="bg-white/60"
              onValueChange={(value) => onSeek(value[0])}
            />
            <span className="w-12 text-sm font-medium text-gray-300">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full text-gray-300 hover:bg-white/10 hover:text-white"
              onClick={onPrevious}
            >
              <SkipBack className="size-5" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-12 w-12 rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10"
              onClick={onTogglePlay}
            >
              {isPlaying ? (
                <Pause className="size-6" />
              ) : (
                <Play className="size-6 pl-0.5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full text-gray-300 hover:bg-white/10 hover:text-white"
              onClick={onNext}
            >
              <SkipForward className="size-5" />
            </Button>

            <div className="ml-4 flex w-48 items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-300 hover:text-white"
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
                thumbVariant="default"
                trackHeight="sm"
                thumbSize="sm"
                trackColor="bg-white/20"
                rangeColor="bg-white/60"
                thumbColor="border-white"
                onValueChange={(value) => onVolumeChange(value[0] / 100)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
