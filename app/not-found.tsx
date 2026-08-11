import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { LogoMark } from "@/components/recruit/logo";
import { Button } from "@/components/ui/button";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Page Not Found",
  description: "The requested Hockey Pathway page was not found.",
  path: "/404",
});

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f7fafc] px-5 py-12 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-2xl flex-col justify-center">
        <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-md font-semibold text-[#071a2f]">
          <LogoMark size={32} />
          <span>Hockey Pathway</span>
        </Link>
        <p className="mt-10 text-sm font-semibold text-cyan-800">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          We could not find that page. You can head back to the roadmap and keep looking.
        </p>
        <Button asChild className="mt-8 h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/roadmap">
            <ArrowLeft /> Go to Roadmap
          </Link>
        </Button>
      </div>
    </main>
  );
}
