import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RoadmapGuide } from "@/components/recruit/roadmap-guide";
import { roadmapSections } from "@/lib/mock-data";

describe("Roadmap guide integration", () => {
  // Validates the public roadmap renders the full pathway guide and major route cards.
  it("renders roadmap sections and route options", () => {
    render(<RoadmapGuide sections={roadmapSections} />);

    expect(screen.getByRole("heading", { name: "Junior Branches" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open USHL details/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open NCAA D1 details/i })).toBeInTheDocument();
  });

  // Validates opening a roadmap card shows milestone-style research details and action links.
  it("opens route details with research steps and target actions", async () => {
    const user = userEvent.setup();
    render(<RoadmapGuide sections={roadmapSections} />);

    await user.click(screen.getByRole("button", { name: /open USHL details/i }));
    const dialog = screen.getByRole("dialog", { name: "USHL" });

    expect(within(dialog).getByText("What to research")).toBeInTheDocument();
    expect(within(dialog).getByText("Common misconceptions")).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /start tracking your targets/i })).toHaveAttribute(
      "href",
      "/targets",
    );
    expect(within(dialog).getByRole("link", { name: /create my plan/i })).toHaveAttribute("href", "/my-plan");
  });

  // Validates keyboard users can open and close roadmap card dialogs.
  it("supports keyboard open and escape close for route dialogs", async () => {
    const user = userEvent.setup();
    render(<RoadmapGuide sections={roadmapSections} />);

    screen.getByRole("button", { name: /open NCAA D3 details/i }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog", { name: "NCAA D3" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "NCAA D3" })).not.toBeInTheDocument();
  });

  // Validates the empty pathway edge case renders only the guide shell without route cards.
  it("handles no roadmap sections without crashing", () => {
    render(<RoadmapGuide sections={[]} />);

    expect(screen.getByText(/Scan the pathway from top to bottom/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /open .* details/i })).not.toBeInTheDocument();
  });

  // Validates close controls and dialog labels are accessible to assistive technology.
  it("labels roadmap dialog controls for screen readers", async () => {
    const user = userEvent.setup();
    render(<RoadmapGuide sections={roadmapSections} />);

    await user.click(screen.getByRole("button", { name: /open NAHL details/i }));
    const dialog = screen.getByRole("dialog", { name: "NAHL" });

    expect(within(dialog).getByRole("button", { name: /close details/i })).toBeInTheDocument();
  });
});
