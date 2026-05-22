import Link from "next/link";
import { CalendarCheck, ClipboardList, Home, Target, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/targets", label: "Targets", icon: Target },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/onboarding", label: "Onboarding", icon: ClipboardList },
];

export function AppShell({
  children,
  title,
  eyebrow,
  action,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7fafc] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-[#071a2f] text-white lg:block">
        <div className="flex h-full flex-col p-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-100 text-sm font-semibold text-[#071a2f]">
              RR
            </div>
            <div>
              <p className="text-sm font-semibold">Recruit Roadmap</p>
              <p className="text-xs text-slate-300">Hockey MVP</p>
            </div>
          </Link>
          <nav className="mt-8 grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
            <CalendarCheck className="size-5 text-cyan-200" />
            <p className="mt-3 text-sm font-medium">This week</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Follow-ups, film updates, and camp deadlines stay visible.
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-800">
                {eyebrow}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              {action}
              <Button asChild variant="outline">
                <Link href="/">Landing</Link>
              </Button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-200 px-5 py-2 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
