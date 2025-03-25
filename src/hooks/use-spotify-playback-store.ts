import { create } from "zustand";

export type PlayerVariant = "basic" | "compact" | "expanded";

interface SpotifyPlaybackStore {
  playback: {
    currentTrackUri: string | null;
    currentTrack: Spotify.Track | null;
    isPlaying: boolean;
    position: number;
    duration: number;
    currentIndex: number;
    isBuffering: boolean;
    loadingTrackUri: string | null;
    volume: number;
    isMuted: boolean;
    previousVolume: number;
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
  findTrackByName: (name: string, artist: string) => boolean;
  setVolume: (volume: number) => Promise<void>;
  toggleMute: () => Promise<void>;
}

export const useSpotifyPlaybackStore = create<SpotifyPlaybackStore>(
  (set, get) => ({
    playback: {
      currentTrackUri: null,
      currentTrack: null,
      isPlaying: false,
      position: 0,
      duration: 0,
      currentIndex: -1,
      isBuffering: false,
      loadingTrackUri: null,
      volume: 0.5,
      isMuted: false,
      previousVolume: 0.5,
    },
    player: null,
    playerVariant: "expanded",
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
    playTrackAt: (uri: string, index: number) => {
      set((state) => ({
        trackQueue: {
          ...state.trackQueue,
          currentIndex: index,
        },
        playback: {
          ...state.playback,
          currentTrackUri: uri,
          isPlaying: true,
          currentIndex: index,
          loadingTrackUri: uri,
          isBuffering: true,
        },
      }));
    },
    nextTrack: async () => {
      const { player, trackQueue } = get();
      if (!player) return;

      try {
        await player.nextTrack();

        const nextIndex = trackQueue.currentIndex + 1;
        if (nextIndex < trackQueue.uris.length) {
          set((state) => ({
            playback: {
              ...state.playback,
              currentIndex: nextIndex,
            },
            trackQueue: {
              ...state.trackQueue,
              currentIndex: nextIndex,
            },
          }));
        }
      } catch (error) {
        console.error("Error skipping to next track:", error);
      }
    },
    previousTrack: async () => {
      const { player, trackQueue } = get();
      if (!player) return;

      try {
        await player.previousTrack();

        const prevIndex = Math.max(0, trackQueue.currentIndex - 1);
        set((state) => ({
          playback: {
            ...state.playback,
            currentIndex: prevIndex,
          },
          trackQueue: {
            ...state.trackQueue,
            currentIndex: prevIndex,
          },
        }));
      } catch (error) {
        console.error("Error going to previous track:", error);
      }
    },
    findTrackByName: (name: string, artist: string) => {
      const { playback } = get();
      if (!playback.currentTrack) return false;

      const currentTrackName = playback.currentTrack.name;
      const currentArtistName = playback.currentTrack.artists[0].name;

      return currentTrackName === name && currentArtistName === artist;
    },
    setVolume: async (volume) => {
      const { player } = get();
      if (!player) return;

      try {
        await player.setVolume(volume);
        set((state) => ({
          playback: {
            ...state.playback,
            volume,
            isMuted: volume === 0,
            previousVolume:
              volume === 0 ? state.playback.previousVolume : volume,
          },
        }));
      } catch (error) {
        console.error("Error setting volume:", error);
      }
    },
    toggleMute: async () => {
      const { player, playback } = get();
      if (!player) return;

      try {
        const newVolume = playback.isMuted ? playback.previousVolume : 0;
        await player.setVolume(newVolume);
        set((state) => ({
          playback: {
            ...state.playback,
            volume: newVolume,
            isMuted: !state.playback.isMuted,
          },
        }));
      } catch (error) {
        console.log("Error toggling mute: ", error);
      }
    },
  }),
);
