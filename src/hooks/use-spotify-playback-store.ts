import { create } from "zustand";

interface SpotifyPlaybackStore {
  playback: {
    currentTrackUri: string | null;
    currentTrack: Spotify.Track | null;
    isPlaying: boolean;
    position: number;
    duration: number;
  };
  player: Spotify.Player | null;
  setPlayback: (playback: Partial<SpotifyPlaybackStore["playback"]>) => void;
  setPlayer: (player: Spotify.Player | null) => void;
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
    setPlayback: (update) =>
      set((state) => ({
        playback: { ...state.playback, ...update },
      })),
    player: null,
    setPlayer: (player) => set({ player }),
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
