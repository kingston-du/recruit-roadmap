import type { Contact } from "@/lib/contacts";
import type { RecruitEvent } from "@/lib/events";
import type { MainPlan, PlanPath } from "@/lib/my-plan";
import type { OutreachLog } from "@/lib/outreach";
import type { PlayerProfile } from "@/lib/player-profile";
import type { Target } from "@/lib/targets";

export const userId = "11111111-1111-4111-8111-111111111111";
export const targetId = "22222222-2222-4222-8222-222222222222";
export const secondTargetId = "33333333-3333-4333-8333-333333333333";
export const contactId = "44444444-4444-4444-8444-444444444444";
export const eventId = "55555555-5555-4555-8555-555555555555";
export const planId = "66666666-6666-4666-8666-666666666666";
export const pathId = "77777777-7777-4777-8777-777777777777";
export const outreachLogId = "88888888-8888-4888-8888-888888888888";

export function makeFormData(values: Record<string, string>) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}

export function makeTarget(overrides: Partial<Target> = {}): Target {
  return {
    id: targetId,
    user_id: userId,
    name: "Northwood School",
    target_type: "school",
    level: "Prep",
    location: "Lake Placid, NY",
    connected_path: "College Hockey Path",
    status: "Researching",
    next_step: "Review roster needs and admission dates.",
    follow_up_date: "2026-06-15",
    priority: "High",
    website_url: "https://example.com",
    roster_url: "https://example.com/roster",
    camp_url: "https://example.com/camp",
    notes: "Strong school fit.",
    why_considering: "Academics and development line up.",
    concerns: "Cost and roster fit need review.",
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-02T00:00:00Z",
    ...overrides,
  };
}

export function makeContact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: contactId,
    user_id: userId,
    target_id: targetId,
    name: "Coach Taylor",
    role: "Head coach",
    email: "coach.taylor@example.com",
    phone: "555-0101",
    source_url: "https://example.com/staff",
    notes: "Prefers concise parent emails.",
    created_at: "2026-05-03T00:00:00Z",
    updated_at: "2026-05-04T00:00:00Z",
    ...overrides,
  };
}

export function makeEvent(overrides: Partial<RecruitEvent> = {}): RecruitEvent {
  return {
    id: eventId,
    user_id: userId,
    target_id: targetId,
    title: "Prospect camp",
    event_type: "camp",
    start_date: "2026-07-10",
    end_date: "2026-07-12",
    registration_deadline: "2026-06-20",
    cost: 450,
    location: "Lake Placid, NY",
    url: "https://example.com/register",
    notes: "Bring updated schedule.",
    status: "Planned",
    created_at: "2026-05-05T00:00:00Z",
    updated_at: "2026-05-06T00:00:00Z",
    ...overrides,
  };
}

export function makeMainPlan(overrides: Partial<MainPlan> = {}): MainPlan {
  return {
    id: planId,
    user_id: userId,
    title: "2026-27 recruiting plan",
    season: "2026-27",
    pathway_goal: "Compare junior and college options.",
    short_term_goal: "Research three schools this month.",
    long_term_goal: "Keep academics and development aligned.",
    notes: "Review monthly.",
    status: "active",
    is_main: true,
    updated_at: "2026-05-07T00:00:00Z",
    ...overrides,
  };
}

export function makePlanPath(overrides: Partial<PlanPath> = {}): PlanPath {
  return {
    id: pathId,
    user_id: userId,
    plan_id: planId,
    title: "College Hockey Path",
    goal: "Compare schools and hockey fit.",
    timeline: "This season",
    why_considering: "Good academic and hockey balance.",
    next_steps: "Build school list\nSave camp dates",
    open_questions: "Which divisions fit?\nWhat dates matter?",
    sort_order: 0,
    updated_at: "2026-05-08T00:00:00Z",
    ...overrides,
  };
}

export function makeOutreachLog(overrides: Partial<OutreachLog> = {}): OutreachLog {
  return {
    id: outreachLogId,
    user_id: userId,
    target_id: targetId,
    contact_id: contactId,
    outreach_type: "email",
    direction: "sent",
    outreach_date: "2026-05-20",
    summary: "Sent intro email with profile.",
    outcome: "Waiting on response.",
    next_follow_up_date: "2026-06-03",
    created_at: "2026-05-20T12:00:00Z",
    updated_at: "2026-05-20T12:00:00Z",
    ...overrides,
  };
}

export function makePlayerProfile(overrides: Partial<PlayerProfile> = {}): PlayerProfile {
  return {
    id: "99999999-9999-4999-8999-999999999999",
    user_id: userId,
    first_name: "Evan",
    last_name: "Miller",
    birth_year: "2009",
    position: "Defense",
    shoots: "Right",
    height: "5'10\"",
    weight: "165 lbs",
    current_team: "Cushing Academy",
    current_level: "Prep",
    hometown: "Worcester, MA",
    gpa: "3.7",
    target_path: "Prep, juniors, college hockey",
    goals: "Find the right development fit while keeping academics strong.",
    video_links: ["https://example.com/highlight"],
    elite_prospects_url: "https://example.com/elite",
    myhockey_url: "https://example.com/myhockey",
    coach_reference_name: "Coach Martin",
    coach_reference_contact: "coach@example.com",
    updated_at: "2026-05-09T00:00:00Z",
    ...overrides,
  };
}
