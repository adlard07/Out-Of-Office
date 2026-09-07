"use client";

import { useState } from "react";
import type { BudgetCategory, Expense } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Field, TextInput, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/budget";

export function AddExpenseModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (e: Omit<Expense, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Expense, "id">>({
    amount: 0,
    category: "food",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    location: "",
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title="Add an expense">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.amount || !form.description.trim()) return;
          onAdd(form);
          setForm({ ...form, amount: 0, description: "", location: "" });
          onClose();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (₹)">
            <TextInput
              type="number"
              min={0}
              value={form.amount || ""}
              onChange={(e) => set("amount", Number(e.target.value))}
              placeholder="2400"
              required
              autoFocus
            />
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={(e) => set("category", e.target.value as BudgetCategory)}>
              {CATEGORY_ORDER.map((c) => (
                <option key={c} value={c} className="bg-night-900">
                  {CATEGORY_META[c].icon} {CATEGORY_META[c].label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Description">
          <TextInput
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Seafood dinner, Jimbaran"
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <TextInput type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </Field>
          <Field label="Location" hint="optional">
            <TextInput value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Bali" />
          </Field>
        </div>
        <Button type="submit" className="w-full">Save expense</Button>
      </form>
    </Modal>
  );
}
