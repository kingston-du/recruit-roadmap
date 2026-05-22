export type RoadmapStage =
  | "Profile ready"
  | "Target list"
  | "Outreach"
  | "Visits and camps"
  | "Decision";

export type Program = {
  id: string;
  name: string;
  level: string;
  location: string;
  league: string;
  coach: string;
  email: string;
  style: string;
  rosterNeed: string;
  academicFit: string;
  nextEvent: string;
};

export type TargetProgram = {
  id: string;
  program: Program;
  status: "Researching" | "Ready for outreach" | "Contacted" | "Follow-up due";
  fit: "Reach" | "Match" | "Safety";
  priority: number;
  lastTouch: string;
  nextStep: string;
  notes: string;
};

export type Task = {
  title: string;
  program: string;
  due: string;
  type: "Email" | "Film" | "Camp" | "Profile" | "Call";
  done?: boolean;
};

export type Event = {
  title: string;
  date: string;
  location: string;
  kind: "Camp" | "Showcase" | "Visit" | "Call";
};

export const playerProfile = {
  name: "Evan Miller",
  gradYear: "2028",
  position: "Right-shot defense",
  shoots: "Right",
  height: "5'10\"",
  weight: "165 lb",
  hometown: "Rochester, NY",
  currentTeam: "Rochester Coalition 15O AAA",
  gpa: "3.72",
  sat: "Not taken",
  targetLevel: "Prep, USPHL Premier, NCAA DIII pathway",
  videoStatus: "Winter highlights updated May 12",
  stage: "Outreach" as RoadmapStage,
  familyOwner: "Dana Miller",
};

export const programs: Program[] = [
  {
    id: "northwood-prep",
    name: "Northwood School",
    level: "Prep",
    location: "Lake Placid, NY",
    league: "Prep Independent",
    coach: "Coach Reynolds",
    email: "reynolds@northwood.example",
    style: "High-tempo transition team with mobile defensemen active below the dots.",
    rosterNeed: "2028 right-shot defense depth, penalty kill minutes available.",
    academicFit: "Strong boarding structure, honors track, hockey-heavy schedule.",
    nextEvent: "Prospect skate - June 8",
  },
  {
    id: "junior-bruins",
    name: "Boston Jr. Bruins",
    level: "USPHL Premier",
    location: "Marlborough, MA",
    league: "USPHL",
    coach: "Coach Moreau",
    email: "moreau@jrbruins.example",
    style: "Puck possession, quick regroups, defensemen expected to join rushes.",
    rosterNeed: "Looking for 2008-2009 defensemen with strong first pass.",
    academicFit: "Good online-school compatibility for travel season.",
    nextEvent: "Main camp - July 12",
  },
  {
    id: "cranbrook-hockey",
    name: "Cranbrook Kingswood",
    level: "Prep",
    location: "Bloomfield Hills, MI",
    league: "MPHL",
    coach: "Coach Patel",
    email: "patel@cranbrook.example",
    style: "Structured defensive zone, patient breakouts, strong academics.",
    rosterNeed: "Evaluating two-way defenders for 2028 entry.",
    academicFit: "Very strong; requires application timeline discipline.",
    nextEvent: "Campus visit window - June 20",
  },
  {
    id: "islanders-hc",
    name: "Islanders Hockey Club",
    level: "NCDC Futures",
    location: "Tyngsboro, MA",
    league: "NCDC pathway",
    coach: "Coach Walsh",
    email: "walsh@islanders.example",
    style: "Direct north-south pace with heavy forecheck support.",
    rosterNeed: "Monitoring defensemen for affiliate list and fall split season.",
    academicFit: "Flexible; depends on school plan.",
    nextEvent: "Evaluation skate - August 3",
  },
  {
    id: "kent-school",
    name: "Kent School",
    level: "Prep",
    location: "Kent, CT",
    league: "NEPSAC",
    coach: "Coach O'Brien",
    email: "obrien@kent.example",
    style: "Disciplined possession team, values skating and composure.",
    rosterNeed: "Future defensive depth, admissions process is the gating item.",
    academicFit: "Reach academic profile, strong support if application is tight.",
    nextEvent: "Admissions call - May 29",
  },
];

export const targetPrograms: TargetProgram[] = [
  {
    id: "northwood-prep",
    program: programs[0],
    status: "Follow-up due",
    fit: "Match",
    priority: 88,
    lastTouch: "Intro email sent May 13",
    nextStep: "Send tournament schedule and ask about June prospect skate.",
    notes: "Coach replied positively to skating clip. Family likes boarding setup.",
  },
  {
    id: "junior-bruins",
    program: programs[1],
    status: "Contacted",
    fit: "Match",
    priority: 76,
    lastTouch: "Call with assistant coach May 10",
    nextStep: "Register for main camp before early pricing closes.",
    notes: "Good development pathway, needs clearer school plan.",
  },
  {
    id: "cranbrook-hockey",
    program: programs[2],
    status: "Ready for outreach",
    fit: "Reach",
    priority: 68,
    lastTouch: "Not contacted",
    nextStep: "Send profile, transcript snapshot, and May highlight link.",
    notes: "Academic fit is strong but admission timeline needs attention.",
  },
  {
    id: "islanders-hc",
    program: programs[3],
    status: "Researching",
    fit: "Safety",
    priority: 54,
    lastTouch: "Parent note added May 7",
    nextStep: "Confirm 2028 age-group pathway and evaluation skate details.",
    notes: "Useful fallback if prep timing slips.",
  },
  {
    id: "kent-school",
    program: programs[4],
    status: "Ready for outreach",
    fit: "Reach",
    priority: 61,
    lastTouch: "Admissions info saved May 14",
    nextStep: "Book admissions call and prepare academic questions.",
    notes: "High academic bar, but player likes campus and league.",
  },
];

export const mockTasks: Task[] = [
  {
    title: "Follow up with Coach Reynolds",
    program: "Northwood School",
    due: "Today",
    type: "Email",
  },
  {
    title: "Clip three defensive retrieval shifts from Buffalo showcase",
    program: "Player profile",
    due: "Wed",
    type: "Film",
  },
  {
    title: "Register for Jr. Bruins main camp",
    program: "Boston Jr. Bruins",
    due: "Thu",
    type: "Camp",
  },
  {
    title: "Add spring transcript PDF to recruiting packet",
    program: "Profile packet",
    due: "Fri",
    type: "Profile",
  },
  {
    title: "Call Cranbrook admissions office",
    program: "Cranbrook Kingswood",
    due: "Fri",
    type: "Call",
  },
  {
    title: "Confirm June tournament schedule with current coach",
    program: "Rochester Coalition",
    due: "Sun",
    type: "Email",
  },
];

export const mockEvents: Event[] = [
  {
    title: "Northwood prospect skate",
    date: "June 8",
    location: "Lake Placid, NY",
    kind: "Camp",
  },
  {
    title: "Kent admissions call",
    date: "May 29",
    location: "Video call",
    kind: "Call",
  },
  {
    title: "Jr. Bruins main camp",
    date: "July 12-14",
    location: "Marlborough, MA",
    kind: "Camp",
  },
  {
    title: "Cranbrook campus visit window",
    date: "June 20",
    location: "Bloomfield Hills, MI",
    kind: "Visit",
  },
];

export const outreachLog = [
  {
    date: "May 13",
    program: "Northwood School",
    note: "Sent profile link, spring schedule, and defensive transition clip.",
    owner: "Dana",
  },
  {
    date: "May 10",
    program: "Boston Jr. Bruins",
    note: "Assistant coach asked family to attend July main camp.",
    owner: "Evan",
  },
  {
    date: "May 7",
    program: "Islanders Hockey Club",
    note: "Saved evaluation skate link and requested roster pathway details.",
    owner: "Dana",
  },
];

export const roadmapStages: RoadmapStage[] = [
  "Profile ready",
  "Target list",
  "Outreach",
  "Visits and camps",
  "Decision",
];
