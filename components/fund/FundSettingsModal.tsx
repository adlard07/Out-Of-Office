"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { currentPerPerson, fundStats, monthLabel, currentMonthKey } from "@/lib/fund";
import { formatMoney } from "@/lib/currency";

export function FundSettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { fund, setFundPerPerson, setFundPeople, correctFundBalance, resetFund } = useStore();
  const stats = fundStats(fund);

  const [perPerson, setPerPerson] = useState(String(currentPerPerson(fund)));
  const [people, setPeople] = useState(String(fund.people));
  const [balance, setBalance] = useState(String(stats.balance));
  const [confirmReset, setConfirmReset] = useState(false);

  const pp = Number(perPerson) || 0;
  const ppl = Math.max(1, Number(people) || 1);

  function save() {
    if (pp !== currentPerPerson(fund)) setFundPerPerson(pp);
    if (ppl !== fund.people) setFundPeople(ppl);
    const target = Number(balance);
    if (Number.isFinite(target) && Math.round(target) !== stats.balance) correctFundBalance(target);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Fund settings">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Each person / month" hint={formatMoney(pp)}>
            <TextInput
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              value={perPerson}
              onChange={(e) => setPerPerson(e.target.value)}
            />
          </Field>
          <Field label="People contributing">
            <TextInput
              type="number"
              inputMode="numeric"
              min={1}
              max={6}
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </Field>
        </div>
        <p className="-mt-2 text-xs text-white/45">
          New monthly total <span className="text-white/80">{formatMoney(pp * ppl)}</span>, applied
          from {monthLabel(currentMonthKey())} onward. Past months stay as they were.
        </p>

        <Field label="Current balance" hint="corrects the running total">
          <TextInput
            type="number"
            inputMode="numeric"
            step={500}
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
        </Field>
        <p className="-mt-2 text-xs text-white/45">
          Use this if the app and your real account have drifted apart — it logs the difference as an
          adjustment.
        </p>

        <div className="flex gap-2 pt-1">
          <Button type="submit" className="flex-1">Save</Button>
          <Button type="button" variant="glass" onClick={onClose}>Cancel</Button>
        </div>

        <div className="border-t border-white/10 pt-4">
          {confirmReset ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-white/60">Reset the fund to ₹80,000 (Sept 2026)?</span>
              <button
                type="button"
                onClick={() => {
                  resetFund();
                  setConfirmReset(false);
                  onClose();
                }}
                className="rounded-full bg-brand-500/20 px-3 py-1.5 text-xs text-brand-200 hover:bg-brand-500/30"
              >
                Yes, reset
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="text-xs text-white/40 hover:text-white/70"
            >
              Reset fund to the starting point
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
