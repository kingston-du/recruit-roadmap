import { describe, expect, it } from "vitest";

import {
  getLeagueBySlug,
  getLeaguePath,
  leagues,
  pathwayStages,
} from "@/lib/roadmap-data";

describe("roadmap data", () => {
  it("has complete league records with unique slugs", () => {
    const slugs = new Set<string>();
    const stageIds = new Set(pathwayStages.map((stage) => stage.id));

    leagues.forEach((league) => {
      expect(league.slug).toMatch(/^[a-z0-9-]+$/);
      expect(slugs.has(league.slug)).toBe(false);
      slugs.add(league.slug);

      expect(league.name).toBeTruthy();
      expect(league.shortName).toBeTruthy();
      expect(league.category).toBeTruthy();
      expect(league.summary.length).toBeGreaterThan(40);
      expect(league.overview.length).toBeGreaterThan(80);
      expect(stageIds.has(league.stageId)).toBe(true);
      expect(league.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(league.sources.length).toBeGreaterThanOrEqual(1);
      expect(league.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    });
  });

  it("keeps roadmap page links resolvable", () => {
    leagues.forEach((league) => {
      expect(getLeagueBySlug(league.slug)).toBe(league);
      expect(getLeaguePath(league)).toBe(`/leagues/${league.slug}`);
    });
  });

  it("labels curated perspectives and notable teams", () => {
    leagues.forEach((league) => {
      expect(league.perspectives.length).toBeGreaterThanOrEqual(1);
      expect(
        league.perspectives.every((note) =>
          ["For parents", "For coaches", "For scouts"].includes(note.type),
        ),
      ).toBe(true);

      expect(league.notableTeams.length).toBeGreaterThanOrEqual(1);
      expect(league.notableTeams.every((team) => team.url.startsWith("https://"))).toBe(true);
    });
  });
});
