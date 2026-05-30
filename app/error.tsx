"use client";

import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

import { LogoMark } from "@/components/recruit/logo";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#f7fafc] px-5 py-12 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-2xl flex-col justify-center">
        <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-md font-semibold text-[#071a2f]">
          <LogoMark size={32} />
          <span>Hockey Pathway</span>
        </Link>
        <div className="mt-10 flex items-center gap-2 text-amber-700">
          <AlertCircle className="size-5" />
          <p className="text-sm font-semibold">Something went wrong</p>
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Try that again</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          The app hit a temporary problem. Your private data was not shown in this error screen.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={reset}
            className="h-10 rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
          >
            <RotateCcw /> Try again
          </Button>
          <Button asChild variant="outline" className="h-10 rounded-md bg-white">
            <Link href="/today">Go to Today</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
