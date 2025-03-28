import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Cog, PanelRight, Music, X } from "lucide-react";
import LikedSongs from "./liked-songs";
import User from "./user";
import { useRef, useState } from "react";
import { useSpotifyPlaybackStore } from "@/hooks/use-spotify-playback-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerVariantSelector } from "@/components/player/player-variant-selector";
import AnimatedBackgroundsSelector from "@/components/animated-backgrounds-selector";

export default function Sidebar() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { playback } = useSpotifyPlaybackStore();
  const [userScrolled, setUserScrolled] = useState(false);

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
      modal={false}
    >
      <SheetTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <PanelRight className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll p-0" hideDefaultClosebutton>
        <SheetHeader className="sr-only">
          <SheetTitle>Music & Settings</SheetTitle>
          <SheetDescription>
            browse your liked songs and adjust settings to customize your
            playback experience
          </SheetDescription>
        </SheetHeader>
        <div className="mb-6 flex w-full items-center justify-between border-b-[1px] p-3">
          <User />
          <SheetClose>
            <X className="size-4" />
          </SheetClose>
        </div>
        <Tabs defaultValue="music" className="w-full">
          <TabsList className="mb-4 grid h-auto w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="music"
              className="group relative flex items-center gap-2 rounded-none px-4 py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:after:bg-gradient-to-l data-[state=active]:after:from-[#06b6d4] data-[state=active]:after:via-[#2563eb] data-[state=active]:after:to-[#6366f1]"
            >
              <Music
                className="size-4 text-white opacity-60 group-data-[state=active]:opacity-100"
                strokeWidth={2}
              />
              <span>Music</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="group relative flex items-center gap-2 rounded-none px-4 py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:after:bg-gradient-to-l data-[state=active]:after:from-[#06b6d4] data-[state=active]:after:via-[#2563eb] data-[state=active]:after:to-[#6366f1]"
            >
              <Cog
                className="size-4 text-white opacity-60 group-data-[state=active]:opacity-100"
                strokeWidth={2}
              />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="music"
            ref={contentRef}
            onScroll={() => setUserScrolled(true)}
            className=""
          >
            <LikedSongs />
          </TabsContent>
          <TabsContent
            value="settings"
            className="mt-0 space-y-6 p-4 text-xs text-muted-foreground"
          >
            <PlayerVariantSelector />
            <AnimatedBackgroundsSelector />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
