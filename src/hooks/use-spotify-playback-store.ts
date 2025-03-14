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
  trackQueue: {
    uris: string[];
    currentIndex: number;
  };
  setPlayback: (playback: Partial<SpotifyPlaybackStore["playback"]>) => void;
  setPlayer: (player: Spotify.Player | null) => void;
  setPlayerVariant: (variant: PlayerVariant) => void;
  togglePlayback: () => void;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  addTracksToQueue: (uris: string[]) => void;
  playTrackAt: (uri: string, index: number) => void;
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
    trackQueue: {
      uris: [],
      currentIndex: -1,
    },
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
    addTracksToQueue: (uris) => {
      set((state) => {
        const existingUris = new Set(state.trackQueue.uris);
        const newUris = uris.filter((uri) => !existingUris.has(uri));

        return {
          trackQueue: {
            ...state.trackQueue,
            uris: [...state.trackQueue.uris, ...newUris],
          },
        };
      });
    },
    playTrackAt: (uri, index) => {
      set((state) => ({
        trackQueue: {
          ...state.trackQueue,
          currentIndex: index,
        },
        playback: {
          ...state.playback,
          currentTrackUri: uri,
        },
      }));
    },
    nextTrack: async () => {
      const { player } = get();
      if (!player) return;

      try {
        await player.nextTrack();
      } catch (error) {
        console.error("Error skipping to next track:", error);
      }
    },
    previousTrack: async () => {
      const { player } = get();
      if (!player) return;

      try {
        await player.previousTrack();
      } catch (error) {
        console.error("Error going to previous track:", error);
      }
    },
  }),
);
