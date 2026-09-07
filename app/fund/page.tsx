"use client";

import { PageShell, PageHeader } from "@/components/layout/PageShell";
import { FundHero } from "@/components/fund/FundHero";
import { FundLedger } from "@/components/fund/FundLedger";
import { useStore } from "@/lib/store";

export default function FundPage() {
  const { hydrated } = useStore();

  return (
    <PageShell>
      <PageHeader
        kicker="The fund"
        title="Where we're disappearing to, funded"
        subtitle="A little every month, quietly adding up. Change the amount whenever, and watch it grow."
      />
      {hydrated ? (
        <>
          <FundHero />
          <FundLedger />
        </>
      ) : (
        <div className="glass h-64 animate-pulse rounded-3xl" />
      )}
    </PageShell>
  );
}
