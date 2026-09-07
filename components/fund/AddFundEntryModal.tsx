"use client";

import { useState } from "react";
import type { FundEntryKind } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Field, TextInput, Select, Segmented } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { addMonths, currentMonthKey, monthLabel, monthsInRange } from "@/lib/fund";
import { formatMoney } from "@/lib/currency";

export function AddFundEntryModal({
  open,
  onClose,
  defaultKind = "deposit",
}: {
  open: boolean;
  onClose: () => void;
  defaultKind?: FundEntryKind;
}) {
  const { addFundEntry } = useStore();
  const [kind, setKind] = useState<FundEntryKind>(defaultKind);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(currentMonthKey());
  const [note, setNote] = useState("");

  const months = monthsInRange(addMonths(currentMonthKey(), -11), currentMonthKey()).reverse();
  const value = Number(amount) || 0;

  function submit() {
    if (value <= 0) return;
    addFundEntry({ amount: value, kind, month, note });
    setAmount("");
    setNote("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={kind === "deposit" ? "Add to the fund" : "Record a withdrawal"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="space-y-4"
      >
        <Segmented
          value={kind}
          onChange={(v) => setKind(v as FundEntryKind)}
          options={[
            { value: "deposit", label: "Money in" },
            { value: "withdrawal", label: "Money out" },
          ]}
        />

        <Field label="Amount" hint={value > 0 ? formatMoney(value) : "₹"}>
          <TextInput
            type="number"
            inputMode="numeric"
            min={0}
            step={500}
            placeholder="e.g. 15000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Month">
            <Select value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => (
                <option key={m} value={m} className="bg-night-900">
                  {monthLabel(m)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Note" hint="optional">
            <TextInput
              placeholder={kind === "deposit" ? "Diwali bonus" : "Bali deposit"}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={value <= 0}>
          {kind === "deposit" ? "Add to fund" : "Record withdrawal"}
        </Button>
      </form>
    </Modal>
  );
}
