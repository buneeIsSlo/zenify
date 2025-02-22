"use client";

import { authClient } from "@/src/auth-client";
import { Button } from "@/src/components/ui/button";

export default function User() {
  const { data, error } = authClient.useSession();

  if (!data) return null;

  const { name } = data.user;

  return (
    <div className="flex items-center justify-between">
      <p>{name}</p>
      <Button className="bg-destructive">Sign out</Button>
    </div>
  );
}
