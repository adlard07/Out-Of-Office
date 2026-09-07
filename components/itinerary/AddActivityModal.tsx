"use client";

import { useState } from "react";
import type { Activity, BudgetCategory } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Field, TextInput, TextArea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/budget";

export function AddActivityModal({
  open,
  onClose,
  onAdd,
  dayNumber,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (a: Activity) => void;
  dayNumber: number;
}) {
  const [form, setForm] = useState({
    time: "3:00 PM",
    title: "",
    description: "",
    location: "",
    durationMins: 120,
    cost: 2000,
    category: "activities" as BudgetCategory,
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={`Add to Day ${dayNumber}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim()) return;
          onAdd({ id: `gen-${Math.random().toString(36).slice(2, 9)}`, ...form });
          onClose();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Time">
            <TextInput value={form.time} onChange={(e) => set("time", e.target.value)} placeholder="3:00 PM" />
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={(e) => set("category", e.target.value as BudgetCategory)}>
              {CATEGORY_ORDER.map((c) => (
                <option key={c} value={c} className="bg-night-900">
                  {CATEGORY_META[c].label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="What is it?">
          <TextInput value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Sunset kayak" required />
        </Field>
        <Field label="Notes">
          <TextArea value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Location">
            <TextInput value={form.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
          <Field label="Mins">
            <TextInput
              type="number"
              value={form.durationMins}
              onChange={(e) => set("durationMins", Number(e.target.value))}
            />
          </Field>
          <Field label="Cost (₹)">
            <TextInput type="number" value={form.cost} onChange={(e) => set("cost", Number(e.target.value))} />
          </Field>
        </div>
        <Button type="submit" className="w-full">Add activity</Button>
      </form>
    </Modal>
  );
}
