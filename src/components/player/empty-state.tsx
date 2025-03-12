import { Disc3 } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Disc3 className="mx-auto size-16 text-zinc-400" />
      <h1 className="py-4 text-center text-lg text-zinc-500">
        Start playing your music
      </h1>
    </div>
  );
};
