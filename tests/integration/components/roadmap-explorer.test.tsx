import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RoadmapExplorer } from "@/components/roadmap/roadmap-explorer";
import { leagues, pathwayStages } from "@/lib/roadmap-data";

describe("RoadmapExplorer", () => {
  it("renders roadmap stages and league links", () => {
    render(<RoadmapExplorer stages={pathwayStages} leagues={leagues} />);

    expect(screen.getByRole("heading", { name: /u\.s\. junior hockey/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /United States Hockey League/i })).toHaveAttribute("href", "/leagues/ushl");
    expect(screen.getByRole("link", { name: /NCAA D3/i })).toHaveAttribute(
      "href",
      "/leagues/ncaa-d3",
    );
  });

  it("filters by type and search query", async () => {
    const user = userEvent.setup();

    render(<RoadmapExplorer stages={pathwayStages} leagues={leagues} />);

    await user.click(screen.getByRole("button", { name: "College" }));
    expect(screen.queryByRole("link", { name: /United States Hockey League/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /NCAA D1/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/search leagues/i), "ACHA");
    expect(screen.getByRole("link", { name: /ACHA/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /NCAA D1/i })).not.toBeInTheDocument();
  });

  it("shows checked dates on league cards", () => {
    render(<RoadmapExplorer stages={pathwayStages} leagues={leagues} />);

    const ushlCard = screen.getByRole("link", { name: /United States Hockey League/i });
    expect(within(ushlCard).getByText(/checked June 18, 2026/i)).toBeInTheDocument();
  });
});
