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
      eyebrow="Execution board"
      activeHref="/targets"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/my-plan">
            <ClipboardList /> Review Plan
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Move targets forward</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Pick one target, review the notes, and complete the next step. Keep the
            board simple so follow-ups do not get lost.
          </p>
        </div>

        <TargetsBoard targets={targets} />
      </div>
    </AppShell>
  );
}
