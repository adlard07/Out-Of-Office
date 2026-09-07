"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const SUGGESTIONS = [
  "Make Day 3 more relaxed.",
  "Replace the expensive restaurant.",
  "Add one adventurous activity.",
  "Keep the trip below ₹1,00,000.",
  "Give us one completely free afternoon.",
];

interface Message {
  role: "you" | "ai";
  text: string;
}

export function AssistantPanel({
  onCommand,
  busy,
  log,
}: {
  onCommand: (text: string) => void;
  busy: boolean;
  log: Message[];
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(true);

  function submit(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    onCommand(t);
    setValue("");
  }

  return (
    <div className="glass-strong rounded-3xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5"
      >
        <span className="flex items-center gap-2 font-display text-xl text-white">
          <span>🪄</span> Trip assistant
        </span>
        <span className="text-sm text-white/40">{open ? "Hide" : "Show"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 px-5 pb-5">
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {log.length === 0 && (
                  <p className="text-sm text-white/45">
                    Tell me what to change in plain English. I&apos;ll adjust the plan and keep an eye
                    on the budget.
                  </p>
                )}
                {log.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                      m.role === "you"
                        ? "ml-auto bg-brand-500/20 text-white"
                        : "bg-white/8 text-white/85",
                    )}
                  >
                    {m.text}
                  </div>
                ))}
                {busy && (
                  <div className="w-fit rounded-2xl bg-white/8 px-3.5 py-2 text-sm text-white/60">
                    thinking…
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    disabled={busy}
                    className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(value);
                }}
                className="flex gap-2"
              >
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. add a beach day after Day 2"
                  className="flex-1 rounded-full border border-white/12 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-brand-400/60"
                />
                <button
                  type="submit"
                  disabled={busy || !value.trim()}
                  className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-night-950 hover:bg-white/90 disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { Message as AssistantMessage };
