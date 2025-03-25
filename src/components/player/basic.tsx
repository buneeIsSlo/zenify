import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { PlaybackProgress } from "@/app/(core)/playback-progress";
import { EmptyState } from "./empty-state";

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

export const BasicPlayer = ({
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
    <div className="fixed bottom-0 left-0 right-0 bg-secondary p-3">
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <Button size={"icon"} onClick={onTogglePlay}>
            {isPlaying ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </Button>
          <div>🎵 Now Playing: {currentTrack.name}</div>
        </div>
        <div className="flex-[0.5]">
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
