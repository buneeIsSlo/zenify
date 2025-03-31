"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbVariant?: "default" | "hidden" | "hover" | "custom";
  trackHeight?: "sm" | "md" | "lg";
  thumbSize?: "sm" | "md" | "lg";
  trackColor?: string;
  rangeColor?: string;
  thumbColor?: string;
}

const trackHeightStyles = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const thumbSizeStyles = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      thumbVariant = "default",
      trackHeight = "md",
      thumbSize = "md",
      trackColor = "bg-gray-500",
      rangeColor = "bg-primary",
      thumbColor = "border-primary",
      ...props
    },
    ref,
  ) => {
    const thumbStyles = cn(
      "block rounded-full border-2 bg-background ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      thumbSizeStyles[thumbSize],
      thumbColor,
      {
        "opacity-0 group-hover:opacity-100": thumbVariant === "hover",
        hidden: thumbVariant === "hidden",
        "border-transparent bg-current": thumbVariant === "custom",
      },
    );

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "group relative flex w-full cursor-pointer touch-none select-none items-center",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative w-full grow overflow-hidden rounded-full",
            trackHeightStyles[trackHeight],
            trackColor,
          )}
        >
          <SliderPrimitive.Range
            className={cn("absolute h-full", rangeColor)}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={thumbStyles} />
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
