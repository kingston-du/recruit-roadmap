import Link from "next/link";
import { Map } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { RoadmapGuide } from "@/components/recruit/roadmap-guide";
import { Panel } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { roadmapSections } from "@/lib/mock-data";

export default function RoadmapPage() {
  return (
    <AppShell
      title="Roadmap"
      eyebrow="Public pathway guide"
      activeHref="/roadmap"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="#roadmap-guide">
            <Map /> Start With the Guide
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        <Panel className="bg-[#071a2f] text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-cyan-100">
              <Map className="size-5" />
              <p className="text-sm font-medium">Boys hockey pathway guide</p>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Understand the common paths from youth hockey to what comes next.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              A simple educational guide to common options. Focus on one path at a
              time, then review the details before making family decisions.
            </p>
          </div>
        </Panel>

        <RoadmapGuide sections={roadmapSections} />
      </div>
    </AppShell>
  );
}
