import { Slider } from "@/components/ui/slider";

interface PlaybackProgressProps {
  position: number;
  duration: number;
  onSeek: (position: number) => void;
}

const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function PlaybackProgress({
  position,
  duration,
  onSeek,
}: PlaybackProgressProps) {
  return (
    <div className="flex w-full max-w-xl items-center gap-2">
      <span className="w-12 text-sm">{formatTime(position)}</span>
      <Slider
        value={[position]}
        max={duration}
        step={100}
        onValueChange={(value) => onSeek(value[0])}
      />
      <span className="w-12 text-sm">{formatTime(duration)}</span>
    </div>
  );
}
