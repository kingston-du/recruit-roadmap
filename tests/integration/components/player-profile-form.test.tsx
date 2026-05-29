import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/analytics-client", () => ({
  initializePostHog: vi.fn(),
  trackAnalyticsEvent: vi.fn(),
  trackPageView: vi.fn(),
}));

import { trackAnalyticsEvent } from "@/lib/analytics-client";
import { PlayerProfileForm } from "@/components/recruit/player-profile-form";
import { makePlayerProfile } from "@/tests/helpers/recruit-fixtures";

describe("Player profile form integration", () => {
  beforeEach(() => {
    vi.mocked(trackAnalyticsEvent).mockClear();
  });

  // Validates an existing profile hydrates all visible inputs for editing.
  it("renders existing player profile values", () => {
    render(<PlayerProfileForm profile={makePlayerProfile()} action={vi.fn()} />);

    expect(screen.getByLabelText("First name")).toHaveValue("Evan");
    expect(screen.getByLabelText("Position")).toHaveValue("Defense");
    expect(screen.getByLabelText("Video links optional")).toHaveValue("https://example.com/highlight");
  });

  // Validates creating a player profile submits required identity, position, school, goals, and links.
  it("submits a new player profile", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => ({ message: "Player profile saved.", success: true }));
    render(<PlayerProfileForm profile={null} action={action} />);

    await user.type(screen.getByLabelText("First name"), "Evan");
    await user.type(screen.getByLabelText("Birth year"), "2009");
    await user.selectOptions(screen.getByLabelText("Position"), "Defense");
    await user.selectOptions(screen.getByLabelText("Shoots"), "Right");
    await user.type(screen.getByLabelText("Height"), "5'10\"");
    await user.type(screen.getByLabelText("Weight"), "165 lbs");
    await user.type(screen.getByLabelText("Current team"), "Cushing Academy");
    await user.type(screen.getByLabelText("Current level"), "Prep");
    await user.type(screen.getByLabelText("Path you are considering"), "Prep to NCAA D3");
    await user.type(screen.getByLabelText("Player and family goals"), "Keep school and hockey fit organized.");
    await user.type(screen.getByLabelText("Video links optional"), "https://example.com/highlight");
    await user.click(screen.getByRole("button", { name: /save player profile/i }));

    await waitFor(() => expect(action).toHaveBeenCalled());
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("player_profile_saved", {
      source: "player_profile_form",
    });
    const formData = (action.mock.calls[0] as unknown[])[1] as FormData;
    expect(formData.get("first_name")).toBe("Evan");
    expect(formData.get("target_path")).toBe("Prep to NCAA D3");
  });

  // Validates server-side validation errors are displayed with form labels and accessible error text.
  it("shows player profile validation errors", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => ({
      message: "Please fill in the highlighted fields.",
      fieldErrors: {
        first_name: ["First name is required."],
        birth_year: ["Enter a 4-digit birth year."],
      },
    }));
    render(<PlayerProfileForm profile={null} action={action} />);

    await user.type(screen.getByLabelText("First name"), "Evan");
    await user.type(screen.getByLabelText("Birth year"), "2009");
    await user.selectOptions(screen.getByLabelText("Position"), "Defense");
    await user.selectOptions(screen.getByLabelText("Shoots"), "Right");
    await user.type(screen.getByLabelText("Height"), "5'10\"");
    await user.type(screen.getByLabelText("Weight"), "165 lbs");
    await user.type(screen.getByLabelText("Current team"), "Cushing Academy");
    await user.type(screen.getByLabelText("Current level"), "Prep");
    await user.type(screen.getByLabelText("Path you are considering"), "Prep to NCAA D3");
    await user.type(screen.getByLabelText("Player and family goals"), "Keep school and hockey fit organized.");
    await user.click(screen.getByRole("button", { name: /save player profile/i }));

    expect(await screen.findByText("First name is required.")).toBeInTheDocument();
    expect(screen.getByText("Enter a 4-digit birth year.")).toBeInTheDocument();
    expect(screen.getByLabelText("First name")).toHaveAttribute("aria-invalid", "true");
  });

  // Validates all interactive form controls are discoverable by accessible label.
  it("labels every core player profile field", () => {
    render(<PlayerProfileForm profile={null} action={vi.fn()} />);

    [
      "First name",
      "Birth year",
      "Position",
      "Shoots",
      "Height",
      "Weight",
      "Current team",
      "Current level",
      "GPA optional",
      "Elite Prospects URL optional",
      "MyHockey URL optional",
      "Coach reference contact optional",
    ].forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  // Validates long notes remain in the textarea without truncating in the client before schema validation.
  it("accepts long goal text in the goals textarea before submission", async () => {
    const user = userEvent.setup();
    render(<PlayerProfileForm profile={null} action={vi.fn()} />);
    const longGoal = "Compare prep, junior, and college fit. ".repeat(20);

    await user.type(screen.getByLabelText("Player and family goals"), longGoal);

    expect(screen.getByLabelText("Player and family goals")).toHaveValue(longGoal);
  });
});
