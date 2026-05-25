import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-12 text-slate-950">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-cyan-800">
          Recruit Roadmap
        </Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight">Terms</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Recruit Roadmap is a planning and organization tool for hockey families. It is
          not a recruiting agency, scouting service, coach/player marketplace, or
          guarantee of roster spots, scholarships, coach replies, or outcomes.
        </p>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Families are responsible for their own research, outreach, and decisions.
        </p>
      </article>
    </main>
  );
}
