"use client";
import React, { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type SliderProps = {
  className?: string;
  min: number;
  max: number;
  minStepsBetweenThumbs?: number;
  formatLabel?: (value: number) => string;
  value?: number[] | readonly number[];
  onValueChange?: (values: number[]) => void;
};

const TemperatureRange = React.forwardRef(
  (
    {
      className,
      min,
      max,
      formatLabel,
      value,
      onValueChange,
      ...props
    }: SliderProps,
    ref
  ) => {
    const initialValue = Array.isArray(value) ? value : [min, max];
    const [localValues, setLocalValues] = useState(initialValue);

    const handleValueChange = (newValues: number[]) => {
      setLocalValues(newValues);
      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    return (
      <SliderPrimitive.Root
        ref={ref as React.RefObject<HTMLDivElement>}
        min={min}
        max={max}
        value={localValues}
        onValueChange={handleValueChange}
        disabled={true}
        orientation="vertical"
        className={cn(
          "relative flex h-full max-h-[17rem] touch-none select-none items-center justify-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-full w-[10px]  select-none overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range className="absolute w-full rounded-full bg-gradient-to-l from-green-300 to-blue-400" />
        </SliderPrimitive.Track>
      </SliderPrimitive.Root>
    );
  }
);

TemperatureRange.displayName = SliderPrimitive.Root.displayName;

export { TemperatureRange };
