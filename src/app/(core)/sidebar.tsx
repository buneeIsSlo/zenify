import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Music } from "lucide-react";
import LikedSongs from "./liked-songs";
import User from "./user";
import { useRef, useState } from "react";
import { useSpotifyPlaybackStore } from "@/hooks/use-spotify-playback-store";

export default function Sidebar() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { playback } = useSpotifyPlaybackStore();
  const [userScrolled, setUserScrolled] = useState(false);

  // Function to scroll to current track
  const scrollToCurrentTrack = () => {
    if (!contentRef.current || !playback.currentTrack || userScrolled) return;

    const trackElements =
      contentRef.current.querySelectorAll("[data-track-id]");
    for (const el of trackElements) {
      if (el.querySelector("h3")?.textContent === playback.currentTrack.name) {
        el.scrollIntoView({ block: "center" });
        break;
      }
    }
  };

  return (
    <Sheet
      onOpenChange={(open) => {
        if (open) {
          setUserScrolled(false);
          setTimeout(scrollToCurrentTrack, 300);
        }
      }}
    >
      <SheetTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <Music className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="overflow-y-scroll"
        ref={contentRef}
        onScroll={() => setUserScrolled(true)}
      >
        <SheetHeader>
          <SheetTitle>Music</SheetTitle>
          <SheetDescription>Your liked songs</SheetDescription>
        </SheetHeader>
        <div>
          <LikedSongs />
        </div>
        <SheetFooter>
          <User />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
