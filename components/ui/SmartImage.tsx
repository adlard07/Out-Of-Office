"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { fallbackPhoto } from "@/lib/images";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Seed for the deterministic fallback if the primary source 404s. */
  fallbackSeed?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Thin image wrapper. Uses a plain <img> for mock/remote photos with a
 * graceful Picsum fallback. Swap the internals for next/image or a real
 * CDN loader later without touching call sites.
 */
export function SmartImage({ src, alt, className, fallbackSeed, priority }: SmartImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrent(src);
    setLoaded(false);
  }, [src]);

  // Catch images that finished loading before hydration attached onLoad.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [current]);

  return (
    <img
      ref={ref}
      src={current}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        const fb = fallbackPhoto(fallbackSeed || alt || "travel");
        if (current !== fb) setCurrent(fb);
        else setLoaded(true);
      }}
      className={cn(
        // Chrome is monochrome, but photography stays in full colour.
        "h-full w-full object-cover transition-[opacity,filter] duration-700",
        loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
        className,
      )}
    />
  );
}
