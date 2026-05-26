import Link from "next/link";
import {
  CalendarCheck,
  ClipboardList,
  CreditCard,
  LogOut,
  Map,
  Settings,
  Target,
  UserRound,
} from "lucide-react";

import { logoutAction } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/today", label: "Today", icon: CalendarCheck },
  { href: "/my-plan", label: "My Plan", icon: ClipboardList },
  { href: "/targets", label: "Targets", icon: Target },
  { href: "/my-player", label: "My Player", icon: UserRound },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/pricing", label: "Upgrade", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  title,
  eyebrow,
  activeHref,
  action,
  userEmail,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow: string;
  activeHref: string;
  action?: React.ReactNode;
  userEmail?: string | null;
}) {
  return (
    <div className="min-h-screen bg-[#f7fafc] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-[#071a2f] text-white lg:block">
        <div className="flex h-full flex-col p-5">
          <Link href="/today" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-cyan-100 text-sm font-semibold text-[#071a2f]">
              RR
            </div>
            <div>
              <p className="text-sm font-semibold">Recruit Roadmap</p>
              <p className="text-xs text-slate-300">Hockey family plan</p>
            </div>
          </Link>

          <nav className="mt-8 grid gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = item.href === activeHref;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white",
                    isActive && "bg-white text-[#071a2f] hover:bg-white hover:text-[#071a2f]",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-md border border-white/10 bg-white/5 p-4">
            <CalendarCheck className="size-5 text-cyan-200" />
            <p className="mt-3 text-sm font-medium">This week</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Keep the next few steps clear before adding more targets.
            </p>
          </div>

          {userEmail ? (
            <form action={logoutAction} className="mt-3">
              <button
                type="submit"
                className="flex w-full items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <span className="truncate">{userEmail}</span>
                <LogOut className="size-4 shrink-0" />
              </button>
            </form>
          ) : null}
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
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
              {userEmail ? (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    aria-label="Log out"
                    title="Log out"
                  >
                    <LogOut className="size-4" />
                  </button>
                </form>
              ) : null}
            </div>
          </div>

          <nav
            className="flex gap-1 overflow-x-auto border-t border-slate-200 px-5 py-2 lg:hidden"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const isActive = item.href === activeHref;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100",
                    isActive && "bg-[#071a2f] text-white hover:bg-[#071a2f] hover:text-white",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
