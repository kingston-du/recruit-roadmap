import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/analytics-client", () => ({
  initializePostHog: vi.fn(),
  trackAnalyticsEvent: vi.fn(),
  trackPageView: vi.fn(),
}));

import { trackAnalyticsEvent } from "@/lib/analytics-client";
import { MyPlanWorkspace } from "@/components/recruit/my-plan-workspace";
import { makeEvent, makeMainPlan, makePlanPath, makeTarget } from "@/tests/helpers/recruit-fixtures";
import { groupTargetsByConnectedPath } from "@/lib/my-plan";

function renderWorkspace(overrides: Partial<Parameters<typeof MyPlanWorkspace>[0]> = {}) {
  const props = {
    plan: makeMainPlan(),
    paths: [makePlanPath()],
    targetGroups: groupTargetsByConnectedPath([makeTarget()]),
    targetEvents: [makeEvent()],
    saveMainPlanAction: vi.fn(async () => ({ message: "Plan saved.", success: true })),
    createPlanPathAction: vi.fn(async () => ({ message: "Path added.", success: true })),
    updatePlanPathAction: vi.fn(async () => ({ message: "Path saved.", success: true })),
    deletePlanPathAction: vi.fn(async () => ({ message: "Path deleted.", success: true })),
    addDefaultPlanPathsAction: vi.fn(async () => ({ message: "Starter paths added.", success: true })),
    ...overrides,
  };

  render(<MyPlanWorkspace {...props} />);

  return props;
}

describe("My Plan workspace integration", () => {
  beforeEach(() => {
    vi.mocked(trackAnalyticsEvent).mockClear();
  });

  // Validates the recruitment plan screen renders saved plan data, paths, targets, and linked dates.
  it("renders an existing recruitment plan and connected roadmap context", () => {
    renderWorkspace();

    expect(screen.getByRole("heading", { name: /family plan/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /college hockey path/i })).toBeInTheDocument();
    expect(screen.getByText("Northwood School")).toBeInTheDocument();
    expect(screen.getByText(/Prospect camp/i)).toBeInTheDocument();
  });

  // Validates empty plan and no-path states give the family a clear starting point.
  it("renders empty states when no plan path or target is selected yet", () => {
    renderWorkspace({
      plan: null,
      paths: [],
      targetGroups: [],
      targetEvents: [],
    });

    expect(screen.getByDisplayValue("My Plan")).toBeInTheDocument();
    expect(screen.getByText("No possible paths saved yet.")).toBeInTheDocument();
    expect(screen.getByText("No targets connected to a path yet.")).toBeInTheDocument();
  });

  // Validates saving the main recruitment plan sends the edited fields to the server action.
  it("submits edited main plan fields", async () => {
    const user = userEvent.setup();
    const saveMainPlanAction = vi.fn(async () => ({ message: "Plan saved.", success: true }));
    renderWorkspace({ saveMainPlanAction });

    await user.clear(screen.getByLabelText("Family focus optional"));
    await user.type(screen.getByLabelText("Family focus optional"), "Updated USHL to NCAA D1 research.");
    await user.click(screen.getByRole("button", { name: /save plan/i }));

    await waitFor(() => expect(saveMainPlanAction).toHaveBeenCalled());
    expect(trackAnalyticsEvent).not.toHaveBeenCalledWith("my_plan_created", expect.anything());
    const formData = (saveMainPlanAction.mock.calls[0] as unknown[])[1] as FormData;
    expect(formData.get("pathway_goal")).toBe("Updated USHL to NCAA D1 research.");
  });

  // Validates first-time plan creation emits only safe analytics metadata.
  it("tracks first main plan creation after a successful save", async () => {
    const user = userEvent.setup();
    const saveMainPlanAction = vi.fn(async () => ({ message: "Plan saved.", success: true }));
    renderWorkspace({
      plan: null,
      paths: [],
      targetGroups: [],
      targetEvents: [],
      saveMainPlanAction,
    });

    await user.click(screen.getByRole("button", { name: /create plan/i }));

    await waitFor(() => expect(saveMainPlanAction).toHaveBeenCalled());
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("my_plan_created", {
      source: "my_plan_form",
    });
  });

  // Validates adding a pathway opens the drawer and submits the selected route fields.
  it("creates a new pathway from the drawer", async () => {
    const user = userEvent.setup();
    const createPlanPathAction = vi.fn(async () => ({ message: "Path added.", success: true }));
    renderWorkspace({ paths: [], createPlanPathAction });

    await user.click(screen.getByRole("button", { name: /add path/i }));
    const dialog = screen.getByRole("dialog", { name: /add path/i });
    await user.type(within(dialog).getByLabelText("Path name"), "USHL to NCAA D1");
    await user.type(within(dialog).getByLabelText("What this path is for"), "Understand the steps from USHL to NCAA D1.");
    await user.type(within(dialog).getByLabelText("Timeline optional"), "Two seasons");
    await user.click(within(dialog).getByRole("button", { name: /add path/i }));

    await waitFor(() => expect(createPlanPathAction).toHaveBeenCalled());
    const formData = (createPlanPathAction.mock.calls[0] as unknown[])[1] as FormData;
    expect(formData.get("title")).toBe("USHL to NCAA D1");
    expect(formData.get("goal")).toContain("USHL to NCAA D1");
  });

  // Validates pathway validation errors are rendered next to the drawer fields.
  it("shows pathway validation errors returned from the server action", async () => {
    const user = userEvent.setup();
    const createPlanPathAction = vi.fn(async () => ({
      message: "Please fill in the highlighted fields.",
      fieldErrors: {
        title: ["Path name is required."],
        goal: ["What this path is for is required."],
      },
    }));
    renderWorkspace({ paths: [], createPlanPathAction });

    await user.click(screen.getByRole("button", { name: /add path/i }));
    const dialog = screen.getByRole("dialog", { name: /add path/i });
    await user.type(within(dialog).getByLabelText("Path name"), "Temporary path");
    await user.type(within(dialog).getByLabelText("What this path is for"), "Temporary goal.");
    await user.click(within(dialog).getByRole("button", { name: /add path/i }));

    expect(await screen.findByText("Path name is required.")).toBeInTheDocument();
    expect(screen.getByText("What this path is for is required.")).toBeInTheDocument();
  });

  // Validates editing a pathway uses existing defaults and sends the hidden path ID.
  it("edits and saves an existing pathway", async () => {
    const user = userEvent.setup();
    const updatePlanPathAction = vi.fn(async () => ({ message: "Path saved.", success: true }));
    renderWorkspace({ updatePlanPathAction });

    await user.click(screen.getByRole("button", { name: /edit college hockey path/i }));
    const dialog = screen.getByRole("dialog", { name: /edit path/i });
    await user.clear(within(dialog).getByLabelText("Timeline optional"));
    await user.type(within(dialog).getByLabelText("Timeline optional"), "Updated every 30 days");
    await user.click(within(dialog).getByRole("button", { name: /save path/i }));

    await waitFor(() => expect(updatePlanPathAction).toHaveBeenCalled());
    const formData = (updatePlanPathAction.mock.calls[0] as unknown[])[1] as FormData;
    expect(formData.get("id")).toBe(makePlanPath().id);
    expect(formData.get("timeline")).toBe("Updated every 30 days");
  });

  // Validates deleting a path requires confirmation and does not call the action when canceled.
  it("deletes a pathway only after confirmation", async () => {
    const user = userEvent.setup();
    const deletePlanPathAction = vi.fn(async () => ({ message: "Path deleted.", success: true }));
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
    renderWorkspace({ deletePlanPathAction });

    await user.click(screen.getByRole("button", { name: /delete path/i }));
    expect(deletePlanPathAction).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /delete path/i }));
    await waitFor(() => expect(deletePlanPathAction).toHaveBeenCalled());
    expect(confirmSpy).toHaveBeenCalledWith('Delete the path "College Hockey Path"?');
  });

  // Validates starter examples can be added from the empty-plan helper panel.
  it("submits the starter pathway examples action", async () => {
    const user = userEvent.setup();
    const addDefaultPlanPathsAction = vi.fn(async () => ({
      message: "Starter paths added.",
      success: true,
    }));
    renderWorkspace({ addDefaultPlanPathsAction });

    await user.click(screen.getByRole("button", { name: /add starter examples/i }));

    await waitFor(() => expect(addDefaultPlanPathsAction).toHaveBeenCalled());
  });
});
