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

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none text-muted-foreground">
        Player style
      </label>
      <Select
        value={playerVariant}
        onValueChange={(value) => setPlayerVariant(value as PlayerVariant)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="basic">Basic</SelectItem>
          <SelectItem value="compact">Compact</SelectItem>
          <SelectItem value="expanded">Expanded</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
