import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
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

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <Music className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
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
