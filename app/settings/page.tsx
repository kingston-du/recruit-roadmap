import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/auth/actions";
import { AppShell } from "@/components/recruit/app-shell";
import { Panel } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser("/settings");

  return (
    <AppShell title="Settings" eyebrow="Account" activeHref="/settings" userEmail={user.email}>
      <div className="grid max-w-3xl gap-6">
        <Panel>
          <h2 className="text-xl font-semibold tracking-tight">Account</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This is the email used to log in to Recruit Roadmap.
          </p>
          <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-950">{user.email}</p>
          </div>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold tracking-tight">Log out</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Logging out removes the Supabase session cookies from this browser.
          </p>
          <form action={logoutAction} className="mt-5">
            <Button className="h-10 rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
              <LogOut /> Log out
            </Button>
          </form>
        </Panel>
      </div>
    </AppShell>
  );
}
