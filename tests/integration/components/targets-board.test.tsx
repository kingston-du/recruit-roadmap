import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/analytics-client", () => ({
  initializePostHog: vi.fn(),
  trackAnalyticsEvent: vi.fn(),
  trackPageView: vi.fn(),
}));

import { trackAnalyticsEvent } from "@/lib/analytics-client";
import { TargetsBoard } from "@/components/recruit/targets-board";
import {
  makeContact,
  makeEvent,
  makeOutreachLog,
  makeTarget,
  secondTargetId,
  targetId,
} from "@/tests/helpers/recruit-fixtures";

function success(message: string) {
  return vi.fn(async () => ({ message, success: true }));
}

function renderBoard(overrides: Partial<Parameters<typeof TargetsBoard>[0]> = {}) {
  const props = {
    targets: [makeTarget()],
    contacts: [makeContact()],
    events: [makeEvent()],
    outreachLogs: [makeOutreachLog()],
    isPro: false,
    freeTargetLimit: 5,
    freeContactLimit: 3,
    freeEventLimit: 3,
    freeOutreachLogLimit: 0,
    createAction: success("Target added."),
    updateAction: success("Target updated."),
    deleteAction: success("Target deleted."),
    createContactAction: success("Contact added."),
    updateContactAction: success("Contact updated."),
    deleteContactAction: success("Contact deleted."),
    createEventAction: success("Event added."),
    updateEventAction: success("Event updated."),
    deleteEventAction: success("Event deleted."),
    createOutreachLogAction: success("Outreach log added."),
    updateOutreachLogAction: success("Outreach log updated."),
    deleteOutreachLogAction: success("Outreach log deleted."),
    ...overrides,
  };

  render(<TargetsBoard {...props} />);

  return props;
}

describe("Targets board integration", () => {
  beforeEach(() => {
    vi.mocked(trackAnalyticsEvent).mockClear();
  });

  // Validates empty board states for targets, coach contacts, and events are visible to a new family.
  it("renders empty states when no targets, contacts, or dates exist", () => {
    renderBoard({
      targets: [],
      contacts: [],
      events: [],
      outreachLogs: [],
    });

    expect(screen.getAllByText("No targets in this stage yet.")).toHaveLength(6);
    expect(screen.getByText(/No coach contacts saved yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No camps, deadlines, visits, calls, or tryouts saved yet/i)).toBeInTheDocument();
  });

  // Validates the target board groups schools into the correct status columns.
  it("renders target schools under their current recruitment status", () => {
    renderBoard({
      targets: [
        makeTarget({ name: "Northwood School", status: "Researching" }),
        makeTarget({
          id: secondTargetId,
          name: "Cranbrook Kingswood",
          status: "Contacted",
          priority: "Medium",
        }),
      ],
    });

    expect(screen.getByRole("heading", { name: "Researching" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Northwood School/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cranbrook Kingswood/i })).toBeInTheDocument();
  });

  // Validates adding a new target school submits all core school, status, deadline, and notes fields.
  it("adds a target school with all tracked fields", async () => {
    const user = userEvent.setup();
    const createAction = success("Target added.");
    renderBoard({ targets: [], contacts: [], events: [], outreachLogs: [], createAction });

    await user.click(screen.getByRole("button", { name: /add target/i }));
    const dialog = screen.getByRole("dialog", { name: /add target/i });
    await user.type(within(dialog).getByLabelText("Team, school, camp, or league name"), "Shattuck-St. Mary's");
    await user.selectOptions(within(dialog).getByLabelText("What kind of target is this?"), "school");
    await user.type(within(dialog).getByLabelText("Level optional"), "Prep");
    await user.type(within(dialog).getByLabelText("Location optional"), "Faribault, MN");
    await user.selectOptions(within(dialog).getByLabelText("Current stage"), "Planning to Contact");
    await user.selectOptions(within(dialog).getByLabelText("Priority optional"), "High");
    await user.type(within(dialog).getByLabelText("Connected plan path optional"), "College Hockey Path");
    await user.type(within(dialog).getByLabelText("Next follow-up date optional"), "2026-06-15");
    await user.type(within(dialog).getByLabelText("Next step optional"), "Send profile and spring schedule.");
    await user.type(within(dialog).getByLabelText("Main website optional"), "https://example.com");
    await user.type(within(dialog).getByLabelText("Roster link optional"), "https://example.com/roster");
    await user.type(within(dialog).getByLabelText("Camp or tryout link optional"), "https://example.com/camp");
    await user.type(within(dialog).getByLabelText("Notes optional"), "Long-term school fit.");
    await user.click(within(dialog).getByRole("button", { name: /add target/i }));

    await waitFor(() => expect(createAction).toHaveBeenCalled());
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("target_created", {
      plan_tier: "free",
      source: "target_form",
      target_count: 1,
      target_type: "school",
    });
    const formData = (createAction.mock.calls[0] as unknown[])[1] as FormData;
    expect(formData.get("name")).toBe("Shattuck-St. Mary's");
    expect(formData.get("status")).toBe("Planning to Contact");
    expect(formData.get("follow_up_date")).toBe("2026-06-15");
  });

  // Validates the third saved target milestone is tracked without sending target names.
  it("tracks the third target milestone after adding a third target", async () => {
    const user = userEvent.setup();
    const createAction = success("Target added.");
    renderBoard({
      contacts: [],
      createAction,
      events: [],
      outreachLogs: [],
      targets: [
        makeTarget({ name: "Target One" }),
        makeTarget({
          id: secondTargetId,
          name: "Target Two",
        }),
      ],
    });

    await user.click(screen.getByRole("button", { name: /add target/i }));
    const dialog = screen.getByRole("dialog", { name: /add target/i });
    await user.type(within(dialog).getByLabelText("Team, school, camp, or league name"), "Target Three");
    await user.selectOptions(within(dialog).getByLabelText("What kind of target is this?"), "team");
    await user.click(within(dialog).getByRole("button", { name: /add target/i }));

    await waitFor(() => expect(createAction).toHaveBeenCalled());
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("third_target_created", {
      plan_tier: "free",
      source: "target_form",
      target_count: 3,
      target_type: "team",
    });
  });

  // Validates editing a target school can update the recruitment status and notes.
  it("edits target details and status", async () => {
    const user = userEvent.setup();
    const updateAction = success("Target updated.");
    renderBoard({ updateAction });

    await user.click(screen.getByRole("button", { name: /Northwood School/i }));
    await user.click(screen.getByRole("button", { name: /edit target/i }));
    const dialog = screen.getByRole("dialog", { name: /edit target/i });
    await user.selectOptions(within(dialog).getByLabelText("Current stage"), "Contacted");
    await user.clear(within(dialog).getByLabelText("Next step optional"));
    await user.type(within(dialog).getByLabelText("Next step optional"), "Follow up after camp.");
    await user.click(within(dialog).getByRole("button", { name: /save target/i }));

    await waitFor(() => expect(updateAction).toHaveBeenCalled());
    const formData = (updateAction.mock.calls[0] as unknown[])[1] as FormData;
    expect(formData.get("id")).toBe(targetId);
    expect(formData.get("status")).toBe("Contacted");
    expect(formData.get("next_step")).toBe("Follow up after camp.");
  });

  // Validates deleting a target requires confirmation and honors cancel/confirm behavior.
  it("deletes a target only after confirmation", async () => {
    const user = userEvent.setup();
    const deleteAction = success("Target deleted.");
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    renderBoard({ contacts: [], events: [], outreachLogs: [], deleteAction });

    await user.click(screen.getByRole("button", { name: /Northwood School/i }));
    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(deleteAction).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    await waitFor(() => expect(deleteAction).toHaveBeenCalled());
    expect(confirmSpy).toHaveBeenCalledWith('Delete the target "Northwood School"?');
  });

  // Validates adding a coach from a school detail view ties the coach to that school.
  it("adds a coach contact tied to a target school", async () => {
    const user = userEvent.setup();
    const createContactAction = success("Contact added.");
    renderBoard({ contacts: [], events: [], outreachLogs: [], createContactAction });

    await user.click(screen.getByRole("button", { name: /Northwood School/i }));
    const detailDialog = screen.getByRole("dialog", { name: /Northwood School/i });
    await user.click(within(detailDialog).getByRole("button", { name: /add contact/i }));

    const contactDialog = screen.getByRole("dialog", { name: /add contact/i });
    await user.type(within(contactDialog).getByLabelText("Contact name"), "Coach Reed");
    await user.type(within(contactDialog).getByLabelText("Coach or staff role"), "Assistant coach");
    await user.type(within(contactDialog).getByLabelText("Email"), "reed@example.com");
    await user.type(within(contactDialog).getByLabelText("Phone optional"), "555-0112");
    await user.type(within(contactDialog).getByLabelText("Where you found this contact optional"), "https://example.com/staff");
    await user.click(within(contactDialog).getByRole("button", { name: /add contact/i }));

    await waitFor(() => expect(createContactAction).toHaveBeenCalled());
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("contact_created", {
      contact_count: 1,
      plan_tier: "free",
      source: "contact_form",
    });
    const formData = (createContactAction.mock.calls[0] as unknown[])[1] as FormData;
    expect(formData.get("target_id")).toBe(targetId);
    expect(formData.get("email")).toBe("reed@example.com");
  });

  // Validates invalid coach contact fields returned by the action are announced in the drawer.
  it("shows invalid coach email errors from contact validation", async () => {
    const user = userEvent.setup();
    const createContactAction = vi.fn(async () => ({
      message: "Please fill in the highlighted fields.",
      fieldErrors: { email: ["Email must be a valid email address."] },
    }));
    renderBoard({ contacts: [], events: [], outreachLogs: [], createContactAction });

    await user.click(screen.getByRole("button", { name: /add contact/i }));
    const dialog = screen.getByRole("dialog", { name: /add contact/i });
    await user.type(within(dialog).getByLabelText("Contact name"), "Coach Reed");
    await user.type(within(dialog).getByLabelText("Coach or staff role"), "Assistant coach");
    await user.type(within(dialog).getByLabelText("Email"), "reed@example.com");
    await user.click(within(dialog).getByRole("button", { name: /add contact/i }));

    expect(await screen.findByText("Email must be a valid email address.")).toBeInTheDocument();
    expect(within(dialog).getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  // Validates adding a target event submits deadline, status, cost, and target linkage.
  it("adds an event tied to a target school", async () => {
    const user = userEvent.setup();
    const createEventAction = success("Event added.");
    renderBoard({ events: [], outreachLogs: [], createEventAction });

    await user.click(screen.getByRole("button", { name: /Northwood School/i }));
    const detailDialog = screen.getByRole("dialog", { name: /Northwood School/i });
    await user.click(within(detailDialog).getByRole("button", { name: /add date/i }));

    const eventDialog = screen.getByRole("dialog", { name: /add event/i });
    await user.type(within(eventDialog).getByLabelText("Date or event name"), "Main camp");
    await user.selectOptions(within(eventDialog).getByLabelText("Date type"), "camp");
    await user.type(within(eventDialog).getByLabelText("Start date"), "2026-07-10");
    await user.type(within(eventDialog).getByLabelText("End date optional"), "2026-07-12");
    await user.type(within(eventDialog).getByLabelText("Registration deadline optional"), "2026-06-20");
    await user.type(within(eventDialog).getByLabelText("Cost optional"), "450");
    await user.selectOptions(within(eventDialog).getByLabelText("Date status"), "Registered");
    await user.click(within(eventDialog).getByRole("button", { name: /add event/i }));

    await waitFor(() => expect(createEventAction).toHaveBeenCalled());
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("event_created", {
      event_count: 1,
      event_type: "camp",
      plan_tier: "free",
      source: "event_form",
    });
    const formData = (createEventAction.mock.calls[0] as unknown[])[1] as FormData;
    expect(formData.get("target_id")).toBe(targetId);
    expect(formData.get("status")).toBe("Registered");
    expect(formData.get("cost")).toBe("450");
  });

  // Validates free-plan limits replace add flows with upgrade prompts.
  it("shows free-plan limit prompts instead of add drawers", async () => {
    const user = userEvent.setup();
    renderBoard({
      targets: Array.from({ length: 5 }, (_, index) =>
        makeTarget({
          id: `${index + 1}`.padStart(8, "0") + "-2222-4222-8222-222222222222",
          name: `Target ${index + 1}`,
        }),
      ),
      contacts: [],
      events: [],
      outreachLogs: [],
    });

    expect(screen.getByText("Free target limit reached:")).toBeInTheDocument();
    await waitFor(() =>
      expect(trackAnalyticsEvent).toHaveBeenCalledWith("free_limit_hit", {
        limit_count: 5,
        limit_type: "target",
        plan_tier: "free",
        source: "target_limit_banner",
        used_count: 5,
      }),
    );
    await user.click(screen.getByRole("button", { name: /add target/i }));
    const dialog = screen.getByRole("dialog", { name: /free target limit reached/i });
    expect(dialog).toBeInTheDocument();
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("free_limit_hit", {
      limit_count: 5,
      limit_type: "target",
      plan_tier: "free",
      source: "target_add_button",
      used_count: 5,
    });

    const upgradeLink = within(dialog).getByRole("link", { name: /view pro options/i });
    upgradeLink.addEventListener("click", (event) => event.preventDefault());
    await user.click(upgradeLink);
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("upgrade_clicked", {
      limit_count: 5,
      limit_type: "target",
      plan_tier: "free",
      source: "target_limit_drawer",
      used_count: 5,
    });
  });

  // Validates keyboard users can open the add-target drawer from the board command.
  it("opens the add target drawer with keyboard interaction", async () => {
    const user = userEvent.setup();
    renderBoard({ targets: [], contacts: [], events: [], outreachLogs: [] });

    await user.tab();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("dialog", { name: /add target/i })).toBeInTheDocument();
  });
});
