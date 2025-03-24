import { Button } from "@/components/ui/button";
import {
  PlayerVariant,
  useSpotifyPlaybackStore,
} from "@/hooks/use-spotify-playback-store";

export const PlayerVariantSelector = () => {
  const { playerVariant, setPlayerVariant } = useSpotifyPlaybackStore();

  const variants: { label: string; value: PlayerVariant }[] = [
    { label: "Basic", value: "basic" },
    { label: "Compact", value: "compact" },
    { label: "Expanded", value: "expanded" },
  ];

  return (
    <div className="flex gap-2">
      {variants.map((variant) => (
        <Button
          key={variant.value}
          size="sm"
          variant={playerVariant === variant.value ? "default" : "outline"}
          onClick={() => setPlayerVariant(variant.value)}
        >
          {variant.label}
        </Button>
      ))}
    </div>
  );
};
