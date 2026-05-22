import { ArrowRight, CalendarDays, FileText, Target } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { FieldLabel, Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <AppShell title="Player Intake" eyebrow="Onboarding">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Build the first recruiting packet</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Static prototype form for the information a family would gather
                before creating a target board.
              </p>
            </div>
            <StatusPill tone="cyan">Mock form</StatusPill>
          </div>

          <form className="mt-6 grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <FieldLabel>Player name</FieldLabel>
                <input
                  defaultValue="Evan Miller"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel>Graduation year</FieldLabel>
                <input
                  defaultValue="2028"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel>Position</FieldLabel>
                <input
                  defaultValue="Right-shot defense"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel>Current team</FieldLabel>
                <input
                  defaultValue="Rochester Coalition 15O AAA"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <FieldLabel>GPA</FieldLabel>
                <input
                  defaultValue="3.72"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel>Height</FieldLabel>
                <input
                  defaultValue="5'10&quot;"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel>Weight</FieldLabel>
                <input
                  defaultValue="165 lb"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <FieldLabel>Target path</FieldLabel>
              <textarea
                defaultValue="Prep school, USPHL Premier, and eventual NCAA DIII pathway. Family wants strong academics and a realistic development plan."
                rows={4}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div className="grid gap-2">
              <FieldLabel>Current recruiting questions</FieldLabel>
              <textarea
                defaultValue="Which prep programs need a 2028 right-shot defenseman? Which camps are worth attending before August? What should we send in the first email?"
                rows={4}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
                Save mock intake <ArrowRight />
              </Button>
              <Button variant="outline" type="button">
                Preview profile
              </Button>
            </div>
          </form>
        </Panel>

        <div className="grid gap-6">
          {[
            {
              icon: FileText,
              title: "Packet",
              copy: "Profile, academics, video links, coach references, and schedule.",
            },
            {
              icon: Target,
              title: "Target list",
              copy: "Reach, match, and safety programs with manual fit notes.",
            },
            {
              icon: CalendarDays,
              title: "Weekly plan",
              copy: "The next set of emails, calls, camp deadlines, and profile updates.",
            },
          ].map((item) => (
            <Panel key={item.title}>
              <item.icon className="size-5 text-cyan-700" />
              <h2 className="mt-3 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
            </Panel>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
