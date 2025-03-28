"use client";

import { create } from "zustand";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Velustro,
  Novatrix,
  Venturo,
  Lumiflex,
  Zenitho,
  Tranquiluxe,
  Opulento,
} from "uvcanvas";
import { Skeleton } from "./ui/skeleton";
import { ComponentType, useState } from "react";

const getPreviewUrl = (fileId: string) =>
  `https://${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${fileId}`;

const backgrounds = {
  lumiflex: {
    value: "lumiflex",
    label: "Lumiflex",
    component: Lumiflex,
    preview: getPreviewUrl("0g0YZGTA63eQwggUPXBwERmNKvuQ4DrbkfZC2AUJz01s76Xp"),
  },
  zenitho: {
    value: "zenitho",
    label: "Zenitho",
    component: Zenitho,
    preview: getPreviewUrl("0g0YZGTA63eQKuuEdw6RVCxLP87cokzYluhH0v6WMdfUAeaD"),
  },
  velustro: {
    value: "velustro",
    label: "Velustro",
    component: Velustro,
    preview: getPreviewUrl("0g0YZGTA63eQpq4EvLbK6BNiYLAV2ZaItk8zulJK409Qhg3e"),
  },
  novatrix: {
    value: "novatrix",
    label: "Novatrix",
    component: Novatrix,
    preview: getPreviewUrl("0g0YZGTA63eQAF9MheLpDyXxWvwSf0JQURu9lzK61OeH4BGP"),
  },
  venturo: {
    value: "venturo",
    label: "Venturo",
    component: Venturo,
    preview: getPreviewUrl("0g0YZGTA63eQtzwGnliLYQowWtAl61492IfgGheSbHyTJqPU"),
  },
  tranquiluxe: {
    value: "tranquiluxe",
    label: "Tranquiluxe",
    component: Tranquiluxe,
    preview: getPreviewUrl("0g0YZGTA63eQBFA3CCVNrsxtO0Z7zSTD6kwjq1HmMgWUI5Ev"),
  },
  opulento: {
    value: "opulento",
    label: "Opulento",
    component: Opulento,
    preview: getPreviewUrl("0g0YZGTA63eQcRlxS2I4MAzeohSWvl0EiXyLap9fR5PxGb3Q"),
  },
} as const;

type BackgroundType = keyof typeof backgrounds;

interface BackgroundStore {
  current: BackgroundType;
  component: ComponentType;
  setCurrent: (background: BackgroundType) => void;
}

export const useBackgroundStore = create<BackgroundStore>((set) => ({
  current: "venturo",
  component: backgrounds.venturo.component,
  setCurrent: (background) =>
    set({
      current: background,
      component: backgrounds[background].component,
    }),
}));

export default function AnimatedBackgroundsSelector() {
  const { current, setCurrent } = useBackgroundStore();
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (value: string) => {
    setLoadedImages((prev) => ({ ...prev, [value]: true }));
  };

  return (
    <fieldset>
      <legend className="text-sm font-medium leading-none text-muted-foreground">
        Choose a background
      </legend>
      <RadioGroup
        className="flex flex-wrap py-4"
        value={current}
        onValueChange={(value) => setCurrent(value as BackgroundType)}
      >
        {Object.entries(backgrounds).map(([key, { value, label, preview }]) => (
          <div key={key} className="relative">
            <RadioGroupItem id={value} value={value} className="sr-only" />
            <label
              htmlFor={value}
              className="group relative block cursor-pointer"
            >
              <div
                className="absolute -inset-[3px] rounded-lg bg-gradient-to-l from-[#06b6d4] via-[#2563eb] to-[#6366f1] opacity-0 transition-opacity duration-300 data-[state=checked]:opacity-100"
                data-state={current === value ? "checked" : "unchecked"}
              />
              <div className="relative aspect-square h-[70px] overflow-hidden rounded-lg outline-none duration-200 hover:scale-[1.02]">
                {!loadedImages[value] && (
                  <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-lg" />
                )}
                <img
                  src={preview}
                  alt={`${label} animated background preview`}
                  className="h-full w-full rounded-lg border border-transparent object-cover transition-transform duration-200 group-hover:scale-110 data-[state=checked]:border-white"
                  data-state={current === value ? "checked" : "unchecked"}
                  onLoad={() => handleImageLoad(value)}
                  style={{ opacity: loadedImages ? 1 : 0 }}
                />
              </div>
            </label>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
