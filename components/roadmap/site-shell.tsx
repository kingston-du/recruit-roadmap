import Link from "next/link";
import { BookOpen, Compass, Info, Map } from "lucide-react";

import { LegalFooterLinks } from "@/components/recruit/legal-footer-links";
import { LogoMark } from "@/components/recruit/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/#leagues", label: "Leagues", icon: BookOpen },
  { href: "/#pathways", label: "Pathways", icon: Compass },
  { href: "/disclaimer", label: "About", icon: Info },
] as const;

export function SiteShell({
  activeHref,
  children,
  className,
}: {
  activeHref?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/94 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
          >
            <LogoMark size={38} className="ring-1 ring-slate-200" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-950">
                Hockey Pathway
              </span>
              <span className="block truncate text-xs text-slate-500">
                A guide for hockey families
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "smooth-action inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200",
                    isActive && "bg-[#071a2f] text-white hover:bg-[#071a2f] hover:text-white",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <nav
          className="flex gap-1 overflow-x-auto border-t border-slate-200 px-5 py-2 md:hidden"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "smooth-action inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200",
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

      <main className={cn("min-h-[calc(100vh-9rem)]", className)}>{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>Free hockey information for families. We do not represent players.</p>
          <LegalFooterLinks
            className="flex flex-wrap gap-4"
            linkClassName="hover:text-cyan-800"
          />
        </div>
      </footer>
    </div>
  );
}
