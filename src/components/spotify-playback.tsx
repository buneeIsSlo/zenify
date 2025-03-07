"use client";

import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlaybackContext } from "./playback-context";
import { Button } from "./ui/button";

interface SpotifyPlayer extends Spotify.Player {}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }

  namespace Spotify {
    interface PlaybackState {
      position: number;
      duration: number;
      paused: boolean;
      track_window: {
        current_track: SpotifyApi.TrackObjectFull;
      };
    }
  }
}

const SpotifyPlayback = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [currentTrack, setCurrentTrack] =
    useState<SpotifyApi.TrackObjectFull | null>(null);
  const [currentTrackName, setCurrentTrackName] = useState<string | null>(null);
  const { isPlaying, setIsPlaying, currentTrackUri } =
    useContext(PlaybackContext);

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
        volumen: 0.5,
      });

      spotifyPlayer.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
        },
      );

      spotifyPlayer.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
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

          setCurrentTrack(current_track as SpotifyApi.TrackObjectFull);
          setCurrentTrackName(current_track.name);
          setIsPlaying(!paused);
        },
      );

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer as SpotifyPlayer);
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

  const playTrack = async (
    uri: string,
    deviceId: string,
    accessToken: string,
  ) => {
    if (!accessToken) {
      console.error("No access token avialable");
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

  const togglePlay = async () => {
    if (!player) return;

    try {
      player.togglePlay();
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling play:", error);
    }
  };

  return (
    <div className="w-fullj fixed bottom-0 left-0 right-0 flex items-center justify-between bg-secondary p-3">
      {currentTrackName ? (
        <div>🎵 Now Playing: {currentTrackName}</div>
      ) : (
        <div>Select a track to start playing</div>
      )}
      <Button className="mr-32" onClick={togglePlay}>
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  );
};

export default SpotifyPlayback;
