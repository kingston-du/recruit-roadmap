import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, LockKeyhole, Wrench } from "lucide-react";

import { createSetupAssistRequestAction } from "@/app/setup-assist/actions";
import { AppShell } from "@/components/recruit/app-shell";
import { SetupAssistForm } from "@/components/recruit/setup-assist-form";
import { Panel } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const setupAssistItems = [
  "Import user-provided targets and notes",
  "Organize coach contact details",
  "Add important camps, dates, and links",
  "Keep the player profile links easy to find",
];

function PaymentButton({
  href,
  className,
}: {
  href: string | undefined;
  className?: string;
}) {
  if (!href) {
    return (
      <Button
        type="button"
        disabled
        className={className ?? "h-10 rounded-md bg-[#071a2f] text-white"}
      >
        <LockKeyhole /> Payment link not ready
      </Button>
    );
  }

  return (
    <Button
      asChild
      className={className ?? "h-10 rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"}
    >
      <a href={href}>
        <CreditCard /> Pay $20 Setup Assist
      </a>
    </Button>
  );
}

export default async function SetupAssistPage() {
  const user = await requireUser("/setup-assist");
  const setupAssistLink = process.env.NEXT_PUBLIC_STRIPE_SETUP_ASSIST_LINK;

  return (
    <AppShell
      title="Setup Assist"
      eyebrow="One-time setup help"
      activeHref="/pricing"
      userEmail={user.email}
      action={
        <PaymentButton
          href={setupAssistLink}
          className="h-10 rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
        />
      }
    >
      <div className="grid gap-6">
        <Panel className="bg-[#071a2f] text-white">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-cyan-100">
                <Wrench className="size-5" />
                <p className="text-sm font-semibold">Optional $20 add-on</p>
              </div>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight">
                Send the details you already have, then complete the one-time payment.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Setup Assist is for organizing user-provided targets, contacts, dates,
                and profile links inside Hockey Pathway. It is optional.
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-cyan-100">Checkout</p>
              <p className="mt-2 text-3xl font-semibold">$20</p>
              <div className="mt-4">
                <PaymentButton
                  href={setupAssistLink}
                  className="h-10 w-full rounded-md bg-white text-[#071a2f] hover:bg-cyan-50"
                />
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Panel>
            <div className="flex items-center gap-2">
              <Wrench className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Request Details</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Paste what you already have. It does not need to be perfectly formatted.
            </p>
            <div className="mt-5">
              <SetupAssistForm
                action={createSetupAssistRequestAction}
                defaultEmail={user.email ?? ""}
                paymentLink={setupAssistLink}
              />
            </div>
          </Panel>

          <div className="grid gap-6">
            <Panel>
              <h2 className="text-lg font-semibold">What to include</h2>
              <ul className="mt-5 grid gap-3">
                {setupAssistItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel className="border-cyan-200 bg-cyan-50">
              <h2 className="text-lg font-semibold">Already paid?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Submit this form so the setup details are tied to this account.
              </p>
              <Button asChild variant="outline" className="mt-4 h-10 rounded-md bg-white">
                <Link href="/targets">
                  Review targets <ArrowRight />
                </Link>
              </Button>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
