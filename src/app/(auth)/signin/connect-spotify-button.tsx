"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";

export default function ConnectSpotifyButton() {
  const router = useRouter();
  const handleSubmit = async () => {
    await authClient.signIn.social(
      {
        provider: "spotify",
      },
      {
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          console.log(ctx);
        },
      },
    );
  };

  return (
    <Button
      className="bg-green-500 text-primary hover:bg-green-600"
      size={"lg"}
      onClick={handleSubmit}
    >
      Connect Spotify
    </Button>
  );
}
