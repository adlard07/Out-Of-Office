"use client";

import { useRef, useState } from "react";
import type { WheelEntry } from "@/lib/types";

// Alternating light / dark greys so neighbouring segments always contrast.
const SEGMENT_COLORS = ["#fafafa", "#171717", "#d4d4d4", "#2e2e2e", "#e8e8e8", "#232323", "#bdbdbd", "#3a3a3a"];

/** Readable label colour for a given segment fill. */
function labelColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 140 ? "#0a0a0a" : "#ffffff";
}

const SPIN_MS = 5000;

interface SpinWheelProps {
  entries: WheelEntry[];
  onResult: (entry: WheelEntry) => void;
  spinning: boolean;
  setSpinning: (v: boolean) => void;
  size?: number;
}

export function SpinWheel({ entries, onResult, spinning, setSpinning, size = 380 }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = entries.length;
  const seg = 360 / Math.max(n, 1);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  function spin() {
    if (spinning || n < 2) return;
    const i = Math.floor(Math.random() * n);
    const jitter = (Math.random() - 0.5) * seg * 0.6;
    const rest = (((360 - (i * seg + seg / 2) + jitter) % 360) + 360) % 360;
    const turns = 5 + Math.floor(Math.random() * 3);
    const base = Math.ceil(rotation / 360) * 360;
    setSpinning(true);
    setRotation(base + turns * 360 + rest);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSpinning(false);
      if (entries[i]) onResult(entries[i]);
    }, SPIN_MS + 120);
  }

  function arc(index: number): string {
    const start = -90 + index * seg;
    const end = start + seg;
    const rad = (d: number) => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(start));
    const y1 = cy + r * Math.sin(rad(start));
    const x2 = cx + r * Math.cos(rad(end));
    const y2 = cy + r * Math.sin(rad(end));
    const large = seg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="absolute left-1/2 top-[-6px] z-20 -translate-x-1/2">
        <div className="h-0 w-0 border-x-[14px] border-t-[24px] border-x-transparent border-t-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
      </div>

      <div
        className="absolute inset-0"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.7, 0.05, 1)` : "none",
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-2xl">
          <circle cx={cx} cy={cy} r={r} fill="#000000" />
          {entries.map((entry, i) => {
            const mid = -90 + i * seg + seg / 2;
            const rad = (mid * Math.PI) / 180;
            const lx = cx + r * 0.62 * Math.cos(rad);
            const ly = cy + r * 0.62 * Math.sin(rad);
            const fill = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
            return (
              <g key={entry.id}>
                <path
                  d={arc(i)}
                  fill={fill}
                  fillOpacity={1}
                  stroke="#000000"
                  strokeWidth={2}
                />
                <text
                  x={lx}
                  y={ly}
                  fill={labelColor(fill)}
                  fontSize={n > 9 ? 12 : 14}
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid + 90} ${lx} ${ly})`}
                >
                  {entry.name}
                </text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={4} />
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={spinning || n < 2}
        className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-night-950 bg-white text-sm font-bold text-night-950 shadow-xl transition hover:scale-105 disabled:opacity-70"
      >
        {spinning ? "…" : n < 2 ? "Add 2+" : "SPIN"}
      </button>
    </div>
  );
}
