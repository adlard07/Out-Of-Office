"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-white/85">{label}</span>
        {hint && <span className="text-xs text-white/45">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-brand-400/60 focus:bg-white/8";

export function TextInput(props: ComponentProps<"input">) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function TextArea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={cn(inputCls, "min-h-24 resize-none", props.className)} />;
}

export function Select({ children, ...props }: ComponentProps<"select">) {
  return (
    <select {...props} className={cn(inputCls, "appearance-none", props.className)}>
      {children}
    </select>
  );
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  leftLabel,
  rightLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
        style={{
          background: `linear-gradient(90deg, #ffffff ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.12) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
      {(leftLabel || rightLabel) && (
        <div className="mt-1.5 flex justify-between text-xs text-white/45">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: { value: T; label: ReactNode }[];
  value: T | T[];
  onChange: (v: T) => void;
  multi?: boolean;
}) {
  const selected = (v: T) => (Array.isArray(value) ? value.includes(v) : value === v);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full border px-3.5 py-2 text-sm font-medium transition",
            selected(o.value)
              ? "border-brand-400/50 bg-brand-500/20 text-white"
              : "border-white/12 bg-white/5 text-white/65 hover:border-white/25 hover:text-white",
          )}
          aria-pressed={selected(o.value)}
        >
          {o.label}
        </button>
      ))}
      {multi ? null : null}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full border border-white/12 bg-white/5 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-full px-3 py-2 text-sm font-medium transition",
            value === o.value ? "bg-white text-night-950" : "text-white/60 hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/85"
    >
      {label}
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          checked ? "bg-white" : "bg-white/20",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full transition-all",
            checked ? "left-[22px] bg-night-950" : "left-0.5 bg-white",
          )}
        />
      </span>
    </button>
  );
}
