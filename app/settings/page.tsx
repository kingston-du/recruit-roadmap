import type { Metadata } from "next";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/auth/actions";
import { deleteAccountAction } from "@/app/settings/actions";
import { DeleteAccountForm } from "@/components/recruit/delete-account-form";
import { AppShell } from "@/components/recruit/app-shell";
import { Panel } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { createNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Settings",
  description: "Private Hockey Pathway account settings page.",
  path: "/settings",
});

type SettingsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

function getMessage(value: string | undefined) {
  switch (value) {
    case "delete-confirm":
      return "Type DELETE before deleting the account.";
    default:
      return null;
  }
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const user = await requireUser("/settings");
  const params = await searchParams;
  const message = getMessage(params.message);

  return (
    <AppShell title="Settings" eyebrow="Account" activeHref="/settings" userEmail={user.email}>
      <div className="grid max-w-3xl gap-6">
        {message ? (
          <Panel className="border-amber-200 bg-amber-50">
            <p className="text-sm leading-6 text-amber-900">{message}</p>
          </Panel>
        ) : null}

        <Panel>
          <h2 className="text-xl font-semibold tracking-tight">Account</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This is the email used to log in to Hockey Pathway.
          </p>
          <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-950">{user.email}</p>
          </div>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold tracking-tight">Log out</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Logging out signs this browser out of your family account.
          </p>
          <form action={logoutAction} className="mt-5">
            <Button className="h-10 rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
              <LogOut /> Log out
            </Button>
          </form>
        </Panel>

        <Panel className="border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold tracking-tight text-red-950">Delete account</h2>
          <p className="mt-2 text-sm leading-6 text-red-900">
            This deletes the account and private app data tied to it, including player
            profile, plan, targets, contacts, dates, outreach history, and setup assist
            requests.
          </p>
          <DeleteAccountForm action={deleteAccountAction} />
        </Panel>
      </div>
    </AppShell>
  );
}
