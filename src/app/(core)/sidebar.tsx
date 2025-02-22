import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Disc3 } from "lucide-react";
import LikedSongs from "./liked-songs";
import User from "./user";

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <Disc3 className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
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
