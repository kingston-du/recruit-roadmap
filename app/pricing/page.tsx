import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Wrench } from "lucide-react";

import { LegalFooterLinks } from "@/components/recruit/legal-footer-links";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const freeItems = [
  "Public Roadmap",
  "My Player",
  "My Plan",
  "5 starter targets",
  "3 coach contacts",
  "3 dates or events",
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

const setupAssistItems = [
  "User-provided targets",
  "Coach contacts",
  "Important dates",
  "Helpful links",
];

function CheckoutButton({
  href,
  children,
  disabledLabel,
  variant = "primary",
}: {
  href: string | undefined;
  children: React.ReactNode;
  disabledLabel: string;
  variant?: "primary" | "secondary";
}) {
  const buttonClassName = cn(
    "h-10 w-full rounded-md",
    variant === "primary"
      ? "bg-[#071a2f] text-white hover:bg-[#0b2745]"
      : "border-slate-300 bg-white text-slate-950 hover:bg-slate-50",
  );

  if (!href) {
    return (
      <Button
        type="button"
        disabled
        variant={variant === "secondary" ? "outline" : "default"}
        className={buttonClassName}
      >
        <LockKeyhole /> {disabledLabel}
      </Button>
    );
  }

  return (
    <Button asChild variant={variant === "secondary" ? "outline" : "default"} className={buttonClassName}>
      <a href={href}>
        {children} <ArrowRight />
      </a>
    </Button>
  );
}

export default function PricingPage() {
  const proMonthlyLink = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_LINK;
  const proYearlyLink = process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_LINK;

  return (
    <main className="min-h-screen bg-[#f7fafc] text-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-semibold text-[#071a2f] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
          >
            Hockey Pathway
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden rounded-md sm:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </header>

        <section className="py-16">
          <p className="text-sm font-semibold text-cyan-800">Pricing</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Start free, upgrade only when tracking grows.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Use the free plan for the core roadmap and starter tracking. Pro is for
            families managing more targets, contacts, dates, and follow-ups.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="smooth-card flex flex-col rounded-md border border-cyan-200 bg-white p-6 shadow-sm hover:shadow-md">
            <p className="text-sm font-semibold text-cyan-800">Free</p>
            <h2 className="mt-2 text-3xl font-semibold">$0</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A clear place to start without a payment method.
            </p>
            <ul className="mt-6 grid gap-3">
              {freeItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-700" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-auto h-10 w-full rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
              <Link href="/signup">
                Start free <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="smooth-card flex flex-col rounded-md border border-slate-200 bg-[#071a2f] p-6 text-white shadow-sm hover:shadow-md">
            <p className="text-sm font-semibold text-cyan-100">Pro</p>
            <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
              <h2 className="text-3xl font-semibold">$5/month</h2>
              <p className="pb-1 text-sm text-slate-300">or $39/year</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Unlimited tracking plus the follow-up tools families need once the list grows.
            </p>
            <ul className="mt-6 grid gap-3">
              {proItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-200">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-200" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto grid gap-2 pt-6">
              <CheckoutButton
                href={proMonthlyLink}
                disabledLabel="Monthly checkout not ready"
                variant="secondary"
              >
                Upgrade monthly
              </CheckoutButton>
              <CheckoutButton
                href={proYearlyLink}
                disabledLabel="Yearly checkout not ready"
                variant="secondary"
              >
                Upgrade yearly
              </CheckoutButton>
            </div>
          </div>

          <div className="smooth-card flex flex-col rounded-md border border-[#f5c2c5] bg-[#fff7f7] p-6 shadow-sm hover:shadow-md">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-[#d71920]">
                <Wrench className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#9f1117]">Setup Assist</p>
                <h2 className="mt-2 text-3xl font-semibold">$20</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  One-time help importing your own saved details.
                </p>
              </div>
            </div>
            <ul className="mt-6 grid gap-3">
              {setupAssistItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#d71920]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <Button asChild className="h-10 w-full rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
                <Link href="/setup-assist">
                  Request Setup Assist <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-md border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
          Checkout uses Stripe payment links. In this early version, Pro access is
          activated separately after payment.
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>Hockey Pathway is a planning tool for hockey families.</p>
            <LegalFooterLinks
              className="flex flex-wrap gap-4"
              linkClassName="hover:text-cyan-800"
            />
          </div>
        </footer>
      </div>
    </main>
  );
}
