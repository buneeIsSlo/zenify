"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import Song from "./song";
import { useSpotifyPlaybackStore } from "@/hooks/use-spotify-playback-store";
import { useEffect } from "react";

interface SpotifyResponse {
  items: { track: Spotify.Track }[];
  limit: number;
  offset: number;
  total: number;
}

export default function LikedSongs() {
  const { addTracksToQueue } = useSpotifyPlaybackStore();

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    status,
  } = useInfiniteQuery<SpotifyResponse>({
    queryKey: ["liked-songs"],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`/api/liked-songs?offset=${pageParam}`);
      if (!response.ok) {
        throw new Error("Failed to fetch liked songs");
      }
      return response.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.offset + lastPage.limit < lastPage.total) {
        return lastPage.offset + lastPage.limit;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.pages) {
      const uris = data.pages.flatMap((page) =>
        page.items.map(({ track }) => track.uri),
      );
      addTracksToQueue(uris);
    }
  }, [data, addTracksToQueue]);

  if (status === "pending") return <div>Please wait...</div>;
  if (status === "error") return <div>Error loading songs</div>;

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {data?.pages.map((page, pageIndex) =>
        page.items.map(({ track }, trackIndex) => {
          const globalIndex = pageIndex * page.limit + trackIndex;
          return <Song key={track.id} track={track} index={globalIndex} />;
        }),
      )}
      {isFetchingNextPage && <div>Loading more...</div>}
    </InfiniteScrollContainer>
  );
}
