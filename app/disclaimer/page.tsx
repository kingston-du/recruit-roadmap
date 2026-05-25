import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-12 text-slate-950">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-cyan-800">
          Recruit Roadmap
        </Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight">Disclaimer</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Recruit Roadmap helps families organize targets, dates, contacts, and next
          steps. It does not evaluate players, advise where a player should go, contact
          coaches, scrape recruiting sites, or promise any recruiting result.
        </p>
      </article>
    </main>
  );
}
