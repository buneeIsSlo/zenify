"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSpotifyPlaybackStore } from "@/hooks/use-spotify-playback-store";
import { ClassicPlayer } from "./player/classic";
import { VinylPlayer } from "./player/vinyl";
import { PassportPlayer } from "./player/passport";

const SpotifyPlayback = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const {
    togglePlayback,
    playback,
    player,
    setPlayback,
    setPlayer,
    playerVariant,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
  } = useSpotifyPlaybackStore();
  const {
    currentTrack,
    currentTrackUri,
    isPlaying,
    position,
    duration,
    volume,
    isMuted,
  } = playback;

  const { data } = useQuery({
    queryKey: ["access-token"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/get-spotify-token");
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    },
  });
  const accessToken = data?.accessToken;

  useEffect(() => {
    console.log("Player state:", { player, deviceId, currentTrack, isPlaying });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, deviceId, currentTrack, isPlaying]);

  useEffect(() => {
    if (!accessToken) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("SDK Ready - initializing player");
      const spotifyPlayer = new window.Spotify.Player({
        name: "Zenify",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener(
        "ready",
        ({ device_id }: Spotify.WebPlaybackInstance) => {
          console.log("Player ready with device ID:", device_id);
          setDeviceId(device_id);
        },
      );

      spotifyPlayer.addListener(
        "player_state_changed",
        (state: Spotify.PlaybackState) => {
          if (!state) return;

          const currentTrack = state.track_window.current_track;

          setPlayback({
            currentTrack,
            currentTrackUri: currentTrack.uri,
            isPlaying: !state.paused,
            duration: state.duration,
            isBuffering: false,
            loadingTrackUri: null,
          });
        },
      );

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (player) (player as Spotify.Player).disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    console.log(`currentTrackUri changed: ${currentTrackUri}`);
    if (player && deviceId && currentTrackUri) {
      const { trackQueue } = useSpotifyPlaybackStore.getState();
      const isManualChange =
        trackQueue.uris[trackQueue.currentIndex] === currentTrackUri;
      if (isManualChange) {
        playTrack(deviceId, accessToken);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, deviceId, currentTrackUri]);

  useEffect(() => {
    if (!player || !isPlaying) return;

    const interval = setInterval(() => {
      player.getCurrentState().then((state) => {
        if (state) {
          setPlayback({ position: state.position });
        }
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, isPlaying]);

  const playTrack = async (deviceId: string, accessToken: string) => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      const { trackQueue } = useSpotifyPlaybackStore.getState();
      console.log("Playing track with queue:", trackQueue);

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: trackQueue.uris,
            offset: { position: trackQueue.currentIndex },
          }),
        },
      );

      if (!response.ok) {
        console.error("Failed to start playback:", response.status);
      }
    } catch (error) {
      console.error("Error starting playback:", error);
    }
  };

  const handleSeek = async (position: number) => {
    if (!player) return;
    await player.seek(position);
  };

  const renderPlayerVariant = () => {
    const props = {
      currentTrack,
      isPlaying,
      position,
      duration,
      onTogglePlay: togglePlayback,
      onSeek: handleSeek,
      onNext: nextTrack,
      onPrevious: previousTrack,
      volume,
      isMuted,
      onVolumeChange: setVolume,
      onToggleMute: toggleMute,
    };

    switch (playerVariant) {
      case "classic":
        return <ClassicPlayer {...props} />;
      case "vinyl":
        return <VinylPlayer {...props} />;
      case "passport":
        return <PassportPlayer {...props} />;
      default:
        return <ClassicPlayer {...props} />;
    }
  };

  return renderPlayerVariant();
};

export default SpotifyPlayback;
