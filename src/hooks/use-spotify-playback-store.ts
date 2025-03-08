import { create } from "zustand";

interface SpotifyPlaybackStore {
  currentTrackUri: string | null;
  isPlaying: boolean;
  setCurrentTrackUri: (uri: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useSpotifyPlaybackStore = create<SpotifyPlaybackStore>((set) => ({
  currentTrackUri: null,
  isPlaying: false,
  setCurrentTrackUri: (uri) => set({ currentTrackUri: uri }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));
