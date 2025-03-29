import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlayerVariant,
  useSpotifyPlaybackStore,
} from "@/hooks/use-spotify-playback-store";

export const PlayerVariantSelector = () => {
  const { playerVariant, setPlayerVariant } = useSpotifyPlaybackStore();

  const handleVariantChange = (value: string) => {
    setPlayerVariant(value as PlayerVariant);
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <label className="text-sm text-muted-foreground">
        Select Player Style
      </label>
      <Select value={playerVariant} onValueChange={handleVariantChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="classic">Classic</SelectItem>
          <SelectItem value="vinyl">Vinyl</SelectItem>
          <SelectItem value="passport">Passport</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
