import { Button } from "@/components/ui/button";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { EmptyState } from "./empty-state";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";

export interface PlayerUIProps {
  currentTrack: Spotify.Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (position: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export const ClassicPlayer = ({
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
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 text-white">
      <div className="mx-auto flex max-w-screen-xl gap-6 p-4">
        {/* Album art section */}
        <div className="hidden flex-shrink-0 md:block">
          {currentTrack?.album.images[0]?.url && (
            <img
              src={currentTrack.album.images[0].url}
              alt="Album cover"
              className="size-10 rounded-md md:size-20"
            />
          )}
        </div>

        {/* Track info and controls */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="mb-1">
            <div className="font-medium">{currentTrack.name}</div>
            <div className="text-sm text-gray-400">
              {currentTrack.artists.map((a) => a.name).join(", ")}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 md:flex-row">
            <div className="flex items-center">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={onPrevious}
              >
                <SkipBack className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full text-white hover:bg-gray-800"
                onClick={onTogglePlay}
              >
                {isPlaying ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={onNext}
              >
                <SkipForward className="size-4" />
              </Button>
            </div>

            <div className="flex w-full flex-1 items-center gap-2 px-2">
              <span className="w-10 text-xs text-gray-400">
                {formatTime(position)}
              </span>
              <Slider
                value={[position]}
                max={duration}
                step={100}
                className="flex-1"
                thumbVariant="custom"
                trackHeight="md"
                trackColor="bg-gray-700"
                rangeColor="bg-gradient-to-l from-[#06b6d4] via-[#2563eb] to-[#6366f1]"
                thumbColor="text-[#2563eb]"
                onValueChange={(value) => onSeek(value[0])}
              />
              <span className="w-10 text-xs text-gray-400">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex w-32 items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-white"
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
                trackColor="bg-gray-700"
                rangeColor="bg-white"
                thumbColor="border-white"
                onValueChange={(value) => onVolumeChange(value[0] / 100)}
              />
            </div>
          </div>
        </div>

        {/* Volume control */}
      </div>
    </div>
  );
};
