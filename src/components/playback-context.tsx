"use client";

import { createContext, useState, Dispatch, SetStateAction } from "react";

interface PlaybackContextProps {
  currentTrackUri: string | null;
  setCurrentTrackUri: Dispatch<SetStateAction<string | null>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

export const PlaybackContext = createContext<PlaybackContextProps>({
  currentTrackUri: null,
  setCurrentTrackUri: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
});

export const PlaybackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentTrackUri, setCurrentTrackUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <PlaybackContext.Provider
      value={{ currentTrackUri, setCurrentTrackUri, isPlaying, setIsPlaying }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};
