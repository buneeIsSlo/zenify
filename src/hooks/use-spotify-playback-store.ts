import { create } from "zustand";

interface SpotifyPlaybackStore {
  currentTrackUri: string | null;
  isPlaying: boolean;
  setCurrentTrackUri: (uri: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  position: number;
  duration: number;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  player: Spotify.Player | null;
  setPlayer: (player: Spotify.Player | null) => void;
  togglePlayback: () => void;
}

export const useSpotifyPlaybackStore = create<SpotifyPlaybackStore>(
  (set, get) => ({
    currentTrackUri: null,
    isPlaying: false,
    player: null,
    setCurrentTrackUri: (uri) => set({ currentTrackUri: uri }),
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    position: 0,
    setPosition: (position) => set({ position }),
    duration: 0,
    setDuration: (duration) => set({ duration }),
    setPlayer: (player) => set({ player }),
    togglePlayback: async () => {
      const { player, isPlaying } = get();
      if (!player) return;

      try {
        await (player as Spotify.Player).togglePlay();
        set({ isPlaying: !isPlaying });
      } catch (error) {
        console.error("Error toggling playback:", error);
      }
    },
  }),
);
