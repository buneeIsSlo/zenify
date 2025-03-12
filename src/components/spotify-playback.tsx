"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSpotifyPlaybackStore } from "@/hooks/use-spotify-playback-store";
import { CompactPlayer } from "./player/compact";
import { ExpandedPlayer } from "./player/expanded";
import { BasicPlayer } from "./player/basic";

const SpotifyPlayback = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const {
    togglePlayback,
    playback,
    player,
    setPlayback,
    setPlayer,
    playerVariant,
  } = useSpotifyPlaybackStore();
  const { currentTrack, currentTrackUri, isPlaying, position, duration } =
    playback;

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
    if (!accessToken) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Spotify Web Playback SDK Ready!");
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
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
        },
      );

      spotifyPlayer.addListener(
        "not_ready",
        ({ device_id }: Spotify.WebPlaybackInstance) => {
          console.log("Device ID has gone offline", device_id);
        },
      );

      spotifyPlayer.addListener(
        "player_state_changed",
        (state: Spotify.PlaybackState) => {
          if (!state) return;

          const {
            position,
            duration,
            paused,
            track_window: { current_track },
          } = state;

          setPlayback({
            position,
            duration,
            currentTrack: current_track,
            isPlaying: !paused,
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
  }, [accessToken]);

  useEffect(() => {
    console.log(`currentTrackUri changed: ${currentTrackUri}`);
    if (player && deviceId && currentTrackUri) {
      playTrack(currentTrackUri, deviceId, accessToken);
    }
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
  }, [player, isPlaying]);

  const playTrack = async (
    uri: string,
    deviceId: string,
    accessToken: string,
  ) => {
    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: [uri] }),
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
    };

    switch (playerVariant) {
      case "compact":
        return <CompactPlayer {...props} />;
      case "expanded":
        return <ExpandedPlayer {...props} />;
      case "basic":
      default:
        return <BasicPlayer {...props} />;
    }
  };

  return renderPlayerVariant();
};

export default SpotifyPlayback;
