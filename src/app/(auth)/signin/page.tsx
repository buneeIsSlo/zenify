"use client";

import { Button } from "@/src/components/ui/button";
import { authClient } from "@/src/auth-client";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();
  const handleSubmit = async () => {
    console.log("yayay");

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
      }
    );
  };

  return (
    <div className="w-full h-full bg-neutral-300">
      <Button className="bg-green-500" size={"lg"} onClick={handleSubmit}>
        Connect Spotify
      </Button>
    </div>
  );
}
