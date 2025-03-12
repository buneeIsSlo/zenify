import { create } from "zustand";

export type PlayerVariant = "basic" | "compact" | "expanded";

interface SpotifyPlaybackStore {
  playback: {
    currentTrackUri: string | null;
    currentTrack: Spotify.Track | null;
    isPlaying: boolean;
    position: number;
    duration: number;
  };
  player: Spotify.Player | null;
  playerVariant: PlayerVariant;
  setPlayback: (playback: Partial<SpotifyPlaybackStore["playback"]>) => void;
  setPlayer: (player: Spotify.Player | null) => void;
  setPlayerVariant: (variant: PlayerVariant) => void;
  togglePlayback: () => void;
}

export const useSpotifyPlaybackStore = create<SpotifyPlaybackStore>(
  (set, get) => ({
    playback: {
      currentTrackUri: null,
      currentTrack: null,
      isPlaying: false,
      position: 0,
      duration: 0,
    },
    player: null,
    playerVariant: "basic",
    setPlayback: (update) =>
      set((state) => ({
        playback: { ...state.playback, ...update },
      })),
    setPlayer: (player) => set({ player }),
    setPlayerVariant: (variant) => set({ playerVariant: variant }),
    togglePlayback: async () => {
      const { player, playback } = get();
      if (!player) return;

      try {
        await (player as Spotify.Player).togglePlay();
        set({
          playback: {
            ...playback,
            isPlaying: !playback.isPlaying,
          },
        });
      } catch (error) {
        console.error("Error toggling playback:", error);
      }
    },
  }),
);
