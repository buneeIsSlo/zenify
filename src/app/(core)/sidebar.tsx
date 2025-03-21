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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerVariantSelector } from "@/components/player/player-variant-selector";

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
      <SheetContent className="overflow-y-scroll">
        <Tabs defaultValue="songs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="songs">Liked Songs</TabsTrigger>
            <TabsTrigger value="player">Player Settings</TabsTrigger>
          </TabsList>
          <TabsContent
            value="songs"
            ref={contentRef}
            onScroll={() => setUserScrolled(true)}
          >
            <LikedSongs />
          </TabsContent>
          <TabsContent value="player">
            <PlayerVariantSelector />
          </TabsContent>
        </Tabs>
        <SheetFooter>
          <User />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
