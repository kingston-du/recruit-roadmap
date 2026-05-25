import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-12 text-slate-950">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-cyan-800">
          Recruit Roadmap
        </Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight">Privacy</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Recruit Roadmap stores account access through Supabase Auth. Private planning
          data will be scoped to the signed-in family account when database tables are
          added.
        </p>
        <p className="mt-4 text-base leading-7 text-slate-600">
          The app is not a scraping service and is not designed to collect data from
          MyHockeyRankings, Elite Prospects, or coach/player marketplaces.
        </p>
      </article>
    </main>
  );
}
