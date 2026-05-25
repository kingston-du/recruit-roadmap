import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const freeItems = [
  "Public Roadmap",
  "My Player and My Plan",
  "Up to 5 targets",
  "Up to 3 coach contacts",
  "Up to 3 events or dates",
  "Basic Today checklist",
];

const proItems = [
  "Unlimited targets",
  "Unlimited contacts",
  "Unlimited events and dates",
  "Outreach history",
  "Follow-up reminders",
  "Shareable player profile",
  "Advanced Today checklist",
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold text-[#071a2f]">
            Recruit Roadmap
          </Link>
          <Button asChild className="rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
            <Link href="/signup">Start free</Link>
          </Button>
        </header>

        <section className="py-16">
          <p className="text-sm font-semibold text-cyan-800">Pricing</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Start free, upgrade only when tracking grows.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Recruit Roadmap is a planning tool for families. Payments are not wired yet,
            so this page documents the intended freemium model.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-md border border-cyan-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-cyan-800">Free</p>
            <h2 className="mt-2 text-3xl font-semibold">$0</h2>
            <ul className="mt-6 grid gap-3">
              {freeItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-700" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-slate-200 bg-[#071a2f] p-6 text-white shadow-sm">
            <p className="text-sm font-semibold text-cyan-100">Pro</p>
            <h2 className="mt-2 text-3xl font-semibold">$5/month</h2>
            <p className="mt-1 text-sm text-slate-300">or $39/year</p>
            <ul className="mt-6 grid gap-3">
              {proItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-200">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-200" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
