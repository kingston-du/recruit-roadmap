import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { TargetsBoard } from "@/components/recruit/targets-board";
import { Button } from "@/components/ui/button";
import { targets } from "@/lib/mock-data";

export default function TargetsPage() {
  return (
    <AppShell
      title="Targets"
      eyebrow="Teams, schools, clubs"
      activeHref="/targets"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/my-plan">
            <ClipboardList /> View My Plan
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Target board</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Track the teams, schools, and clubs the player is considering. Click a
            card to review notes, contacts, outreach history, and open questions.
          </p>
        </div>

        <TargetsBoard targets={targets} />
      </div>
    </AppShell>
  );
}
