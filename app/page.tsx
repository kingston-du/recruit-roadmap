import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Mail,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { mockEvents, mockTasks, targetPrograms } from "@/lib/mock-data";

export default function Home() {
  const priorityTargets = targetPrograms.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <header className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#071a2f] text-sm font-semibold text-white">
              RR
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Recruit Roadmap Hockey
              </p>
              <p className="text-xs text-slate-500">Private family command center</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/dashboard" className="hover:text-slate-950">
              Dashboard
            </Link>
            <Link href="/targets" className="hover:text-slate-950">
              Targets
            </Link>
            <Link href="/profile" className="hover:text-slate-950">
              Profile
            </Link>
          </nav>
          <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
            <Link href="/onboarding">
              Start intake <ArrowRight />
            </Link>
          </Button>
        </div>
      </header>

      <section className="bg-[#071a2f] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/20 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100">
              Hockey recruiting, organized
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Know what to do next this week.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Turn scattered spreadsheets, coach emails, camp links, and notes
              into one calm recruiting board for the player and family.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-cyan-100 text-[#071a2f] hover:bg-white">
                <Link href="/dashboard">
                  View prototype <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/targets">Review target board</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white p-4 text-slate-950 shadow-2xl shadow-black/20">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    This Week&apos;s Recruiting Plan
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    May 18-24
                  </h2>
                </div>
                <div className="rounded-md bg-cyan-50 px-3 py-2 text-right">
                  <p className="text-xs text-slate-500">Open tasks</p>
                  <p className="text-2xl font-semibold text-[#0b5f78]">6</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {mockTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.title}
                    className="flex items-start gap-3 rounded-md border border-slate-200 bg-white p-3"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 text-cyan-700" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-950">{task.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {task.program} - {task.due}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {priorityTargets.map((target) => (
                <div key={target.id} className="rounded-md border border-slate-200 p-3">
                  <p className="text-sm font-semibold">{target.program.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {target.fit} fit - {target.status}
                  </p>
                  <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-cyan-600"
                      style={{ width: `${target.priority}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 md:grid-cols-3 lg:px-8">
        {[
          {
            icon: ClipboardList,
            title: "Weekly roadmap",
            copy: "A clear set of calls, emails, film updates, and registration steps.",
          },
          {
            icon: Target,
            title: "Target board",
            copy: "Track reach, match, and safety programs without pretending the list is final.",
          },
          {
            icon: Mail,
            title: "Outreach context",
            copy: "Keep coach contacts, last touch, notes, and next follow-up in one view.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <item.icon className="size-5 text-cyan-700" />
            <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-cyan-700" />
            <h2 className="text-lg font-semibold">Upcoming recruiting dates</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {mockEvents.slice(0, 3).map((event) => (
              <div
                key={event.title}
                className="flex flex-col justify-between gap-3 rounded-md border border-slate-200 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{event.location}</p>
                </div>
                <p className="text-sm font-medium text-cyan-800">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-[#eef8fb] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-900">
            MVP scope
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Manual first. Calm by design.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            This prototype uses realistic mock data only: no auth, no database,
            no paid APIs, no AI advisor, and no scraping.
          </p>
        </div>
      </section>
    </main>
  );
}
