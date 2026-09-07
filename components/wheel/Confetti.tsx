"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#f83f63", "#eec06a", "#7c5cff", "#3fbaf8", "#43d6a0", "#ff8a5c", "#ffffff"];

type Shape = "rect" | "circle" | "star";

interface Piece {
  id: number;
  color: string;
  shape: Shape;
  size: number;
  dx: number;
  apexX: number;
  apexY: number;
  fallY: number;
  rotate: number;
  drift: number;
  delay: number;
  duration: number;
}

function makePieces(count: number, spreadDeg: number): Piece[] {
  const pieces: Piece[] = [];
  for (let i = 0; i < count; i++) {
    // Fan the launch mostly upward, widening toward the sides.
    const angle = ((-90 + (Math.random() - 0.5) * spreadDeg) * Math.PI) / 180;
    const velocity = 220 + Math.random() * 320;
    const dx = Math.cos(angle) * velocity;
    const dyUp = Math.sin(angle) * velocity; // negative == up
    const shape: Shape = Math.random() < 0.62 ? "rect" : Math.random() < 0.8 ? "circle" : "star";
    // Two waves: half burst immediately, half a beat later for a second pop.
    const wave = i % 2;
    pieces.push({
      id: i,
      color: COLORS[i % COLORS.length],
      shape,
      size: shape === "star" ? 16 + Math.random() * 8 : 7 + Math.random() * 9,
      dx,
      apexX: dx * 0.55,
      apexY: dyUp,
      fallY: Math.abs(dyUp) + 620 + Math.random() * 380,
      rotate: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540),
      drift: (Math.random() - 0.5) * 60,
      // Let the pin land first, then the celebration erupts (two quick waves).
      delay: 0.32 + wave * 0.24 + Math.random() * 0.12,
      duration: 1.9 + Math.random() * 1.3,
    });
  }
  return pieces;
}

interface ConfettiProps {
  /** Total pieces. Split across two quick waves. */
  count?: number;
  /** Vertical origin of the burst as a % of the container height. */
  originY?: number;
  /** Launch fan width in degrees. */
  spread?: number;
  className?: string;
}

/**
 * A celebratory burst — pieces launch outward from a point, arc up, then
 * fall away with a little sideways drift. Two waves for extra joy.
 */
export function Confetti({ count = 120, originY = 46, spread = 150, className }: ConfettiProps) {
  const reduce = useReducedMotion();
  const pieces = useMemo(() => makePieces(reduce ? 0 : count, spread), [count, spread, reduce]);

  if (reduce) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute block will-change-transform"
          style={{
            left: "50%",
            top: `${originY}%`,
            width: p.size,
            height: p.shape === "rect" ? p.size * 0.44 : p.size,
            borderRadius: p.shape === "circle" ? "9999px" : p.shape === "rect" ? "1px" : "0",
            background: p.shape === "star" ? "transparent" : p.color,
            color: p.color,
            fontSize: p.size,
            lineHeight: 1,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
          animate={{
            x: [0, p.apexX, p.dx + p.drift],
            y: [0, p.apexY, p.fallY],
            rotate: [0, p.rotate * 0.5, p.rotate],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: ["circOut", "circIn"],
            opacity: { duration: p.duration, delay: p.delay, times: [0, 0.06, 0.75, 1] },
          }}
        >
          {p.shape === "star" ? "★" : null}
        </motion.span>
      ))}
    </div>
  );
}
