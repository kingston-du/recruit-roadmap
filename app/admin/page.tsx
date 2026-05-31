import type { Metadata } from "next";
import { AlertCircle, ClipboardList, Save, ShieldCheck, Target, UserRound, Wrench } from "lucide-react";

import { updatePlanTierAction } from "@/app/admin/actions";
import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { createAdminClient, requireAdmin } from "@/lib/admin";
import { createNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Admin",
  description: "Private Hockey Pathway operations page.",
  path: "/admin",
});

type AdminPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

type ProfileRow = {
  user_id?: string | null;
  email?: string | null;
  full_name?: string | null;
  created_at?: string | null;
};

type SubscriptionRow = {
  user_id?: string | null;
  plan_name?: string | null;
  status?: string | null;
};

type SetupAssistRequestRow = {
  id?: string | null;
  user_id?: string | null;
  request_status?: string | null;
  paid_status?: string | null;
  parent_player_name?: string | null;
  email?: string | null;
  player_name?: string | null;
  help_needed?: string | null;
  goals?: string | null;
  current_target_list?: string | null;
  coach_contacts?: string | null;
  camp_date_links?: string | null;
  notes?: string | null;
  player_notes?: string | null;
  target_links?: string | null;
  contact_details?: string | null;
  event_details?: string | null;
  preferred_contact_method?: string | null;
  admin_notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type AdminUser = {
  userId: string;
  email: string;
  fullName: string | null;
  createdAt: string | null;
  planTier: "free" | "pro";
  planStatus: string;
};

type SetupAssistRequest = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string | null;
  requestStatus: string;
  paidStatus: string;
  parentPlayerName: string | null;
  email: string | null;
  playerName: string | null;
  helpNeeded: string | null;
  goals: string | null;
  currentTargetList: string | null;
  coachContacts: string | null;
  campDateLinks: string | null;
  notes: string | null;
  playerNotes: string | null;
  targetLinks: string | null;
  contactDetails: string | null;
  eventDetails: string | null;
  preferredContactMethod: string | null;
  adminNotes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type AdminDashboardData = {
  counts: {
    users: number;
    proUsers: number;
    targets: number;
    setupAssistRequests: number;
  };
  setupAssistRequests: SetupAssistRequest[];
  users: AdminUser[];
  warnings: string[];
};

function normalizeText(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizePlanTier(value: unknown): "free" | "pro" {
  return typeof value === "string" && value.toLowerCase() === "pro" ? "pro" : "free";
}

function normalizeProfiles(value: unknown): ProfileRow[] {
  return Array.isArray(value) ? (value as ProfileRow[]) : [];
}

function normalizeSubscriptions(value: unknown): SubscriptionRow[] {
  return Array.isArray(value) ? (value as SubscriptionRow[]) : [];
}

function normalizeSetupAssistRequests(value: unknown): SetupAssistRequestRow[] {
  return Array.isArray(value) ? (value as SetupAssistRequestRow[]) : [];
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getMessage(value: string | undefined) {
  switch (value) {
    case "plan-pro":
      return { tone: "green" as const, text: "Plan tier changed to pro." };
    case "plan-free":
      return { tone: "green" as const, text: "Plan tier changed to free." };
    case "invalid-plan":
      return { tone: "amber" as const, text: "Plan tier change was not valid." };
    case "plan-error":
      return { tone: "amber" as const, text: "Plan tier could not be updated." };
    case "rate-limited":
      return { tone: "amber" as const, text: "Too many admin changes. Wait a few minutes and try again." };
    default:
      return null;
  }
}

async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = createAdminClient();
  const [
    profilesResult,
    subscriptionsResult,
    setupAssistResult,
    userCountResult,
    proUserCountResult,
    targetCountResult,
    setupAssistCountResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("user_id,email,full_name,created_at")
      .order("created_at", { ascending: false }),
    supabase.from("subscriptions").select("user_id,plan_name,status"),
    supabase
      .from("setup_assist_requests")
      .select(
        "id,user_id,request_status,paid_status,parent_player_name,email,player_name,help_needed,goals,current_target_list,coach_contacts,camp_date_links,notes,player_notes,target_links,contact_details,event_details,preferred_contact_method,admin_notes,created_at,updated_at",
      )
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("plan_name", "pro")
      .eq("status", "active"),
    supabase.from("targets").select("id", { count: "exact", head: true }),
    supabase.from("setup_assist_requests").select("id", { count: "exact", head: true }),
  ]);

  const warnings = [
    profilesResult.error ? "Users could not be loaded." : null,
    subscriptionsResult.error ? "Subscriptions could not be loaded." : null,
    setupAssistResult.error ? "Setup assist requests could not be loaded." : null,
    userCountResult.error ? "User count could not be loaded." : null,
    proUserCountResult.error ? "Pro user count could not be loaded." : null,
    targetCountResult.error ? "Target count could not be loaded." : null,
    setupAssistCountResult.error ? "Setup assist request count could not be loaded." : null,
  ].filter((warning): warning is string => Boolean(warning));

  const subscriptionsByUserId = new Map(
    normalizeSubscriptions(subscriptionsResult.data).flatMap((subscription) => {
      const userId = normalizeText(subscription.user_id);
      return userId ? [[userId, subscription] as const] : [];
    }),
  );

  const profileByUserId = new Map(
    normalizeProfiles(profilesResult.data).flatMap((profile) => {
      const userId = normalizeText(profile.user_id);
      return userId ? [[userId, profile] as const] : [];
    }),
  );

  const users = normalizeProfiles(profilesResult.data).flatMap((profile) => {
    const userId = normalizeText(profile.user_id);

    if (!userId) {
      return [];
    }

    const subscription = subscriptionsByUserId.get(userId);

    return [
      {
        userId,
        email: normalizeText(profile.email) ?? "Unknown",
        fullName: normalizeText(profile.full_name),
        createdAt: normalizeText(profile.created_at),
        planTier: normalizePlanTier(subscription?.plan_name),
        planStatus: normalizeText(subscription?.status) ?? "active",
      },
    ];
  });

  const setupAssistRequests = normalizeSetupAssistRequests(setupAssistResult.data).flatMap((request) => {
    const id = normalizeText(request.id);
    const userId = normalizeText(request.user_id);

    if (!id || !userId) {
      return [];
    }

    const profile = profileByUserId.get(userId);

    return [
      {
        id,
        userId,
        userEmail: normalizeText(profile?.email) ?? "Unknown",
        userName: normalizeText(profile?.full_name),
        requestStatus: normalizeText(request.request_status) ?? "new",
        paidStatus: normalizeText(request.paid_status) ?? "unpaid",
        parentPlayerName: normalizeText(request.parent_player_name),
        email: normalizeText(request.email),
        playerName: normalizeText(request.player_name),
        helpNeeded: normalizeText(request.help_needed),
        goals: normalizeText(request.goals),
        currentTargetList: normalizeText(request.current_target_list),
        coachContacts: normalizeText(request.coach_contacts),
        campDateLinks: normalizeText(request.camp_date_links),
        notes: normalizeText(request.notes),
        playerNotes: normalizeText(request.player_notes),
        targetLinks: normalizeText(request.target_links),
        contactDetails: normalizeText(request.contact_details),
        eventDetails: normalizeText(request.event_details),
        preferredContactMethod: normalizeText(request.preferred_contact_method),
        adminNotes: normalizeText(request.admin_notes),
        createdAt: normalizeText(request.created_at),
        updatedAt: normalizeText(request.updated_at),
      },
    ];
  });

  return {
    counts: {
      users: userCountResult.count ?? users.length,
      proUsers: proUserCountResult.count ?? users.filter((user) => user.planTier === "pro").length,
      targets: targetCountResult.count ?? 0,
      setupAssistRequests: setupAssistCountResult.count ?? setupAssistRequests.length,
    },
    setupAssistRequests,
    users,
    warnings,
  };
}

function DetailBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const admin = await requireAdmin("/admin");
  const params = await searchParams;
  const message = getMessage(params.message);
  let dashboardData: AdminDashboardData = {
    counts: {
      users: 0,
      proUsers: 0,
      targets: 0,
      setupAssistRequests: 0,
    },
    setupAssistRequests: [],
    users: [],
    warnings: [],
  };
  let loadError = false;

  try {
    dashboardData = await getAdminDashboardData();
  } catch {
    loadError = true;
  }

  const stats = [
    { label: "users", value: dashboardData.counts.users, icon: UserRound },
    { label: "pro users", value: dashboardData.counts.proUsers, icon: ShieldCheck },
    { label: "targets", value: dashboardData.counts.targets, icon: Target },
    { label: "setup assist requests", value: dashboardData.counts.setupAssistRequests, icon: Wrench },
  ];

  return (
    <AppShell title="Admin" eyebrow="Operations" activeHref="/admin" userEmail={admin.email}>
      <div className="grid gap-6">
        {message ? (
          <Panel className={message.tone === "green" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}>
            <div className="flex items-start gap-3">
              <AlertCircle
                className={message.tone === "green" ? "mt-0.5 size-5 text-emerald-700" : "mt-0.5 size-5 text-amber-700"}
              />
              <p
                className={message.tone === "green" ? "text-sm leading-6 text-emerald-900" : "text-sm leading-6 text-amber-900"}
              >
                {message.text}
              </p>
            </div>
          </Panel>
        ) : null}

        {loadError ? (
          <Panel className="border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                Admin data could not load. Check that server-side Supabase admin configuration is set.
              </p>
            </div>
          </Panel>
        ) : null}

        {dashboardData.warnings.length > 0 ? (
          <Panel className="border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 text-amber-700" />
              <div className="grid gap-1 text-sm leading-6 text-amber-900">
                {dashboardData.warnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            </div>
          </Panel>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Admin counts">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Panel key={stat.label} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                  </div>
                  <span className="flex size-10 items-center justify-center rounded-md bg-cyan-50 text-cyan-800">
                    <Icon className="size-5" />
                  </span>
                </div>
              </Panel>
            );
          })}
        </section>

        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Users and profiles</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Account email, profile name, and current plan.
              </p>
            </div>
            <StatusPill tone="cyan">{dashboardData.users.length} shown</StatusPill>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-3 py-3 font-semibold">User</th>
                  <th className="px-3 py-3 font-semibold">Profile</th>
                  <th className="px-3 py-3 font-semibold">Created</th>
                  <th className="px-3 py-3 font-semibold">Current plan</th>
                  <th className="px-3 py-3 font-semibold">Change plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboardData.users.map((user) => (
                  <tr key={user.userId} className="align-top">
                    <td className="px-3 py-4">
                      <p className="font-medium text-slate-950">{user.email}</p>
                    </td>
                    <td className="px-3 py-4 text-slate-700">{user.fullName ?? "Not set"}</td>
                    <td className="px-3 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill tone={user.planTier === "pro" ? "green" : "slate"}>{user.planTier}</StatusPill>
                        <span className="text-xs text-slate-500">{user.planStatus}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <form action={updatePlanTierAction} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="user_id" value={user.userId} />
                        <label htmlFor={`plan-tier-${user.userId}`} className="sr-only">
                          Plan tier for {user.email}
                        </label>
                        <select
                          id={`plan-tier-${user.userId}`}
                          name="plan_tier"
                          defaultValue={user.planTier}
                          className="smooth-field h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                        >
                          <option value="free">free</option>
                          <option value="pro">pro</option>
                        </select>
                        <Button className="h-9 rounded-md bg-[#071a2f] px-3 text-white hover:bg-[#0b2745]">
                          <Save /> Save
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
                {dashboardData.users.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-sm text-slate-600" colSpan={5}>
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Setup assist requests</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                User-provided setup details and current request status.
              </p>
            </div>
            <StatusPill tone="cyan">{dashboardData.setupAssistRequests.length} shown</StatusPill>
          </div>

          <div className="mt-5 grid gap-4">
            {dashboardData.setupAssistRequests.map((request) => (
              <article key={request.id} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-950">
                      {request.parentPlayerName ?? request.userName ?? "Name not set"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {request.email ?? request.userEmail}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Account: {request.userEmail}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill tone="amber">{request.requestStatus}</StatusPill>
                    <StatusPill tone={request.paidStatus === "paid" ? "green" : "slate"}>
                      {request.paidStatus}
                    </StatusPill>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 md:grid-cols-2">
                  <DetailBlock label="Player name" value={request.playerName} />
                  <DetailBlock label="Help needed" value={request.helpNeeded} />
                  <DetailBlock label="Goals" value={request.goals} />
                  <DetailBlock label="Current target list" value={request.currentTargetList} />
                  <DetailBlock label="Coach contacts" value={request.coachContacts} />
                  <DetailBlock label="Camp/date links" value={request.campDateLinks} />
                  <DetailBlock label="Notes" value={request.notes} />
                  <DetailBlock label="Preferred contact" value={request.preferredContactMethod} />
                  <DetailBlock label="Legacy player notes" value={request.playerNotes} />
                  <DetailBlock label="Legacy target links" value={request.targetLinks} />
                  <DetailBlock label="Legacy contact details" value={request.contactDetails} />
                  <DetailBlock label="Legacy event details" value={request.eventDetails} />
                  <DetailBlock label="Admin notes" value={request.adminNotes} />
                </div>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Created {formatDate(request.createdAt)}</span>
                  <span>Updated {formatDate(request.updatedAt)}</span>
                </div>
              </article>
            ))}

            {dashboardData.setupAssistRequests.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-300 p-6 text-sm text-slate-600">
                No setup assist requests found.
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel className="border-cyan-200 bg-cyan-50">
          <div className="flex items-start gap-3">
            <ClipboardList className="mt-0.5 size-5 text-cyan-800" />
            <p className="text-sm leading-6 text-cyan-950">
              Admin access is checked on the server against Supabase Auth app metadata before any
              dashboard data or plan action runs.
            </p>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
