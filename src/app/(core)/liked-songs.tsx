"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import Song from "./song";

interface SpotifyResponse {
  items: { track: Spotify.Track }[];
  limit: number;
  offset: number;
  total: number;
}

export default function LikedSongs() {
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

  if (status === "pending") return <div>Please wait...</div>;
  if (status === "error") return <div>Error loading songs</div>;

  return (
    <InfiniteScrollContainer
      className="space-y-2"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {data?.pages.map((page) =>
        page.items.map(({ track }) => <Song key={track.id} track={track} />),
      )}
      {isFetchingNextPage && <div>Loading more...</div>}
    </InfiniteScrollContainer>
  );
}
