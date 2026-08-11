"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Filter, MapPin, Search, ShieldCheck } from "lucide-react";

import { StatusPill } from "@/components/recruit/ui";
import { formatReviewDate, getLeaguePath, type Geography, type League, type LeagueType, type PathwayStage } from "@/lib/roadmap-data";
import { cn } from "@/lib/utils";

type StageFilter = "all" | PathwayStage["id"];
type GeographyFilter = "all" | Geography;
type TypeFilter = "all" | LeagueType;

const geographyOptions: Array<{ value: GeographyFilter; label: string }> = [
  { value: "all", label: "All regions" },
  { value: "United States", label: "U.S." },
  { value: "Canada", label: "Canada" },
  { value: "United States / Canada", label: "U.S. and Canada" },
  { value: "North America", label: "North America" },
];

const typeOptions: Array<{ value: TypeFilter; label: string }> = [
  { value: "all", label: "All types" },
  { value: "Youth", label: "Youth" },
  { value: "School", label: "School" },
  { value: "Prep", label: "Prep" },
  { value: "Academy", label: "Academy" },
  { value: "Junior", label: "Junior" },
  { value: "College", label: "College" },
  { value: "Pro", label: "Pro" },
];

export function RoadmapExplorer({
  stages,
  leagues,
}: {
  stages: PathwayStage[];
  leagues: League[];
}) {
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [geographyFilter, setGeographyFilter] = useState<GeographyFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const visibleLeagues = useMemo(() => {
    return leagues.filter((league) => {
      const matchesStage = stageFilter === "all" || league.stageId === stageFilter;
      const matchesGeography =
        geographyFilter === "all" ||
        league.geography === geographyFilter ||
        league.geography === "United States / Canada" ||
        geographyFilter === "United States / Canada";
      const matchesType = typeFilter === "all" || league.type === typeFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [league.name, league.shortName, league.category, league.summary, league.geography]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStage && matchesGeography && matchesType && matchesQuery;
    });
  }, [geographyFilter, leagues, normalizedQuery, stageFilter, typeFilter]);

  return (
    <section className="grid gap-5" aria-label="Hockey pathway map">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-800">
              <Filter className="size-4" />
              <p className="text-sm font-semibold">Narrow the list</p>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {visibleLeagues.length} league pages match your choices.
            </p>
          </div>

          <label className="relative block w-full lg:w-80">
            <span className="sr-only">Search leagues and regions</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search leagues or regions"
              className="smooth-field h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-3 focus:ring-cyan-100"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3">
          <FilterGroup label="Stage">
            <FilterButton active={stageFilter === "all"} onClick={() => setStageFilter("all")}>
              All stages
            </FilterButton>
            {stages.map((stage) => (
              <FilterButton
                key={stage.id}
                active={stageFilter === stage.id}
                onClick={() => setStageFilter(stage.id)}
              >
                {stage.eyebrow}
              </FilterButton>
            ))}
          </FilterGroup>

          <FilterGroup label="Region">
            {geographyOptions.map((option) => (
              <FilterButton
                key={option.value}
                active={geographyFilter === option.value}
                onClick={() => setGeographyFilter(option.value)}
              >
                {option.label}
              </FilterButton>
            ))}
          </FilterGroup>

          <FilterGroup label="Type">
            {typeOptions.map((option) => (
              <FilterButton
                key={option.value}
                active={typeFilter === option.value}
                onClick={() => setTypeFilter(option.value)}
              >
                {option.label}
              </FilterButton>
            ))}
          </FilterGroup>
        </div>
      </div>

      <div className="grid gap-5">
        {stages.map((stage, index) => {
          const stageLeagues = visibleLeagues.filter((league) => league.stageId === stage.id);

          if (stageLeagues.length === 0) {
            return null;
          }

          return (
            <section
              key={stage.id}
              className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[240px_minmax(0,1fr)] md:p-5"
            >
              <div className="md:sticky md:top-28 md:self-start">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d71920]">
                  Step {index + 1} / {stages.length}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {stage.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{stage.description}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {stageLeagues.map((league) => (
                  <Link
                    key={league.slug}
                    href={getLeaguePath(league)}
                    className="smooth-card group flex min-h-64 flex-col rounded-md border border-slate-200 bg-[#fbfcfe] p-4 text-left shadow-sm hover:border-cyan-300 hover:bg-cyan-50/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid gap-2">
                        <div className="flex flex-wrap gap-2">
                          <StatusPill tone={league.type === "Junior" ? "cyan" : league.type === "College" ? "green" : "slate"}>
                            {league.type}
                          </StatusPill>
                          <StatusPill tone="amber">{league.geography}</StatusPill>
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                          {league.shortName}
                        </h3>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-slate-400 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-700" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-800">{league.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{league.summary}</p>

                    <div className="mt-auto grid gap-2 pt-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <MapPin className="size-3.5" />
                        {league.category}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800">
                        <ShieldCheck className="size-3.5" />
                        Checked {formatReviewDate(league.lastReviewed)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function FilterGroup({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-[84px_minmax(0,1fr)] md:items-start">
      <p className="pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "smooth-action h-8 rounded-md border px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200",
        active
          ? "border-[#071a2f] bg-[#071a2f] text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950",
      )}
    >
      {children}
    </button>
  );
}
