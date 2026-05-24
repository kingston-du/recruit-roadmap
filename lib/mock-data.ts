export type TargetKind = "Team" | "School" | "Camp" | "Coach" | "Opportunity";

export type TargetStatus =
  | "Researching"
  | "Ready to contact"
  | "Contacted"
  | "Follow-up due"
  | "Planned";

export type Priority = "High" | "Medium" | "Low";

export type Target = {
  id: string;
  name: string;
  kind: TargetKind;
  path: string;
  location: string;
  contactName: string;
  contactRole: string;
  email: string;
  status: TargetStatus;
  priority: Priority;
  nextDate: string;
  lastTouch: string;
  nextStep: string;
  notes: string;
  connectedGoal: string;
  details: {
    whyOnList: string;
    familyQuestions: string[];
    prepare: string[];
  };
};

export type Task = {
  title: string;
  target: string;
  due: string;
  type: "Email" | "Video" | "Camp" | "Profile" | "Call" | "School";
};

export type Event = {
  title: string;
  date: string;
  location: string;
  kind: "Camp" | "Showcase" | "Visit" | "Call" | "School";
};

export type ReadinessItem = {
  label: string;
  status: "Ready" | "Needs update" | "Missing";
  note: string;
};

export type PathOption = {
  name: string;
  note: string;
  nextStep: string;
};

export type PlanStep = {
  title: string;
  owner: string;
  timing: string;
};

export type RoadmapCard = {
  id: string;
  name: string;
  label: string;
  description: string;
  parentNote: string;
  commonNextStep: string;
};

export type RoadmapSection = {
  title: string;
  intro: string;
  cards: RoadmapCard[];
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
  currentSchool: "Brighton High School",
  gpa: "3.72",
  testStatus: "SAT not taken yet",
  familyOwner: "Dana Miller",
  targetSummary: "Prep school options, strong academics, and a patient junior hockey path.",
  videoStatus: "Winter highlights updated May 12",
  fullGameStatus: "Needs one recent full-game link",
  references: ["Current head coach", "Skills coach", "Academic advisor"],
};

export const readinessItems: ReadinessItem[] = [
  {
    label: "One-page player profile",
    status: "Ready",
    note: "Includes school, team, position, size, and contact details.",
  },
  {
    label: "Highlight video",
    status: "Ready",
    note: "Spring version is ready to share with selected targets.",
  },
  {
    label: "Full game link",
    status: "Needs update",
    note: "Add one recent full game from the Buffalo showcase.",
  },
  {
    label: "Transcript snapshot",
    status: "Needs update",
    note: "Add spring grades before sending school-focused notes.",
  },
  {
    label: "Coach references",
    status: "Ready",
    note: "Three references are listed with phone and email.",
  },
  {
    label: "Upcoming schedule",
    status: "Ready",
    note: "June tournament dates are ready for outreach.",
  },
];

export const targets: Target[] = [
  {
    id: "northwood-school",
    name: "Northwood School",
    kind: "School",
    path: "Prep",
    location: "Lake Placid, NY",
    contactName: "Coach Reynolds",
    contactRole: "Prep coach",
    email: "reynolds@northwood.example",
    status: "Follow-up due",
    priority: "High",
    nextDate: "June 8",
    lastTouch: "Intro email sent May 13",
    nextStep: "Send June schedule and ask about the prospect skate.",
    notes: "Family likes the boarding setup and academic structure.",
    connectedGoal: "Explore a prep path before junior hockey decisions.",
    details: {
      whyOnList: "Prep environment with strong academics and a serious hockey schedule.",
      familyQuestions: [
        "What does a 2028 defenseman's first year usually look like?",
        "How does admissions timing work for a hockey family?",
        "What video or school material should be sent first?",
      ],
      prepare: [
        "One-page profile",
        "Spring highlight link",
        "June tournament schedule",
        "Transcript snapshot",
      ],
    },
  },
  {
    id: "cranbrook-kingswood",
    name: "Cranbrook Kingswood",
    kind: "School",
    path: "Prep",
    location: "Bloomfield Hills, MI",
    contactName: "Coach Patel",
    contactRole: "Prep coach",
    email: "patel@cranbrook.example",
    status: "Ready to contact",
    priority: "Medium",
    nextDate: "June 20",
    lastTouch: "Admissions information saved May 14",
    nextStep: "Send profile, transcript snapshot, and May highlight link.",
    notes: "Strong school fit; application timing needs attention.",
    connectedGoal: "Compare prep school options with strong academics.",
    details: {
      whyOnList: "A school-first option that still keeps hockey development visible.",
      familyQuestions: [
        "What academic information should be sent before a visit?",
        "How many hockey events should the family attend?",
        "What is the admissions timeline for a 2028 player?",
      ],
      prepare: ["Transcript snapshot", "Teacher contact list", "Highlight link"],
    },
  },
  {
    id: "jr-bruins-main-camp",
    name: "Jr. Bruins Main Camp",
    kind: "Camp",
    path: "USPHL",
    location: "Marlborough, MA",
    contactName: "Coach Moreau",
    contactRole: "Camp contact",
    email: "moreau@jrbruins.example",
    status: "Planned",
    priority: "Medium",
    nextDate: "July 12-14",
    lastTouch: "Call with assistant coach May 10",
    nextStep: "Confirm registration and update the family calendar.",
    notes: "Useful exposure to a junior environment; school plan still matters.",
    connectedGoal: "Learn what a junior camp weekend feels like.",
    details: {
      whyOnList: "A practical way to see pace, schedule, and communication expectations.",
      familyQuestions: [
        "What level should Evan expect at camp?",
        "What should parents ask after camp ends?",
        "How does this camp connect to future opportunities?",
      ],
      prepare: ["Registration receipt", "Equipment checklist", "Simple post-camp notes"],
    },
  },
  {
    id: "islanders-hockey-club",
    name: "Islanders Hockey Club",
    kind: "Team",
    path: "NCDC / USPHL",
    location: "Tyngsboro, MA",
    contactName: "Coach Walsh",
    contactRole: "Program contact",
    email: "walsh@islanders.example",
    status: "Researching",
    priority: "Low",
    nextDate: "August 3",
    lastTouch: "Parent note added May 7",
    nextStep: "Confirm the age-group pathway and evaluation skate details.",
    notes: "Keep as an option if prep timing changes.",
    connectedGoal: "Understand junior and split-season options.",
    details: {
      whyOnList: "A regional junior pathway to understand before making larger travel decisions.",
      familyQuestions: [
        "Which age group should the family ask about?",
        "How does school work with this option?",
        "What does the evaluation skate actually decide?",
      ],
      prepare: ["Current team schedule", "Family school constraints", "Basic questions list"],
    },
  },
  {
    id: "kent-admissions-call",
    name: "Kent School Admissions Call",
    kind: "Opportunity",
    path: "Prep",
    location: "Video call",
    contactName: "Admissions office",
    contactRole: "School contact",
    email: "admissions@kent.example",
    status: "Contacted",
    priority: "Medium",
    nextDate: "May 29",
    lastTouch: "Call time saved May 16",
    nextStep: "Prepare academic and boarding questions before the call.",
    notes: "Useful comparison point for prep school fit.",
    connectedGoal: "Clarify school expectations before sending more hockey material.",
    details: {
      whyOnList: "Helps the family understand the school side before chasing hockey details.",
      familyQuestions: [
        "What courses should Evan take next year?",
        "What does a campus visit include?",
        "How should a coach reference be included?",
      ],
      prepare: ["Academic questions", "Current transcript", "Family travel availability"],
    },
  },
];

export const weeklyTasks: Task[] = [
  {
    title: "Follow up with Northwood",
    target: "Northwood School",
    due: "Today",
    type: "Email",
  },
  {
    title: "Add one full-game video link",
    target: "My Player",
    due: "Wednesday",
    type: "Video",
  },
  {
    title: "Confirm Jr. Bruins camp registration",
    target: "Jr. Bruins Main Camp",
    due: "Thursday",
    type: "Camp",
  },
  {
    title: "Add spring transcript snapshot",
    target: "My Player",
    due: "Friday",
    type: "School",
  },
  {
    title: "Prepare questions for Kent admissions",
    target: "Kent School Admissions Call",
    due: "Friday",
    type: "Call",
  },
];

export const events: Event[] = [
  {
    title: "Kent admissions call",
    date: "May 29",
    location: "Video call",
    kind: "Call",
  },
  {
    title: "Northwood prospect skate",
    date: "June 8",
    location: "Lake Placid, NY",
    kind: "Camp",
  },
  {
    title: "Cranbrook visit window",
    date: "June 20",
    location: "Bloomfield Hills, MI",
    kind: "Visit",
  },
  {
    title: "Jr. Bruins main camp",
    date: "July 12-14",
    location: "Marlborough, MA",
    kind: "Camp",
  },
];

export const myPlan = {
  weekFocus: "Move the prep school options forward and clean up the player packet.",
  shortTermGoals: [
    "Choose which prep schools deserve a serious conversation this month.",
    "Send only complete, accurate player information to priority targets.",
    "Keep camp and visit dates visible for the whole family.",
  ],
  longTermGoals: [
    "Find a hockey and school setting where Evan can keep developing without rushing.",
    "Understand prep, academy, and junior options before making a major move.",
    "Keep NCAA D3 and strong academic options open as the longer-term direction.",
  ],
  selectedPaths: [
    {
      name: "AAA to Prep",
      note: "Stay with current AAA team while comparing boarding and day-school options.",
      nextStep: "Finish prep school outreach before the June tournament block.",
    },
    {
      name: "Prep to Junior",
      note: "Use prep as the main development and school environment before junior decisions.",
      nextStep: "Ask each prep contact how they help families understand junior options.",
    },
    {
      name: "NCAA D3 academic path",
      note: "Longer-term option that keeps academics and fit at the center.",
      nextStep: "Keep transcript and coach references current.",
    },
  ] satisfies PathOption[],
  connectedTargetIds: ["northwood-school", "cranbrook-kingswood", "kent-admissions-call"],
  nextSteps: [
    {
      title: "Send Northwood follow-up",
      owner: "Dana",
      timing: "Today",
    },
    {
      title: "Update full-game video link",
      owner: "Evan",
      timing: "Wednesday",
    },
    {
      title: "Review prep school questions together",
      owner: "Family",
      timing: "Friday",
    },
  ] satisfies PlanStep[],
};

export const roadmapSections: RoadmapSection[] = [
  {
    title: "Start Here",
    intro: "Most families begin by comparing the player's current team and school setting.",
    cards: [
      {
        id: "aaa",
        name: "AAA",
        label: "Club hockey path",
        description: "High-level club hockey with regular practices, showcases, and travel.",
        parentNote: "This can work well when the school plan is stable and the schedule is manageable.",
        commonNextStep: "Track upcoming showcases, video needs, and which programs are worth contacting.",
      },
      {
        id: "high-school",
        name: "High School",
        label: "Local school path",
        description: "School-based hockey that may pair with split-season or club opportunities.",
        parentNote: "Families should understand how strong the schedule is and what extra exposure is needed.",
        commonNextStep: "Compare the school season, club options, and video opportunities.",
      },
      {
        id: "prep",
        name: "Prep",
        label: "School-first hockey path",
        description: "Private school hockey with academics, admissions, and team fit all connected.",
        parentNote: "This path needs both hockey conversations and school application discipline.",
        commonNextStep: "Prepare transcript, profile, video, and admissions questions.",
      },
      {
        id: "academy",
        name: "Academy",
        label: "Training-heavy path",
        description: "A hockey-focused setting built around daily training, games, and school planning.",
        parentNote: "Ask how academics, billet or housing, and long travel days are handled.",
        commonNextStep: "Compare schedule, school support, cost, and player development fit.",
      },
    ],
  },
  {
    title: "Next Options",
    intro: "Older players may compare junior, post-grad, and league-specific routes.",
    cards: [
      {
        id: "ushl",
        name: "USHL",
        label: "Top U.S. junior option",
        description: "A highly competitive junior route for players ready for a major hockey step.",
        parentNote: "Families should be careful, patient, and realistic about timing.",
        commonNextStep: "Watch for camp invites, coach communication, and fit with school goals.",
      },
      {
        id: "chl",
        name: "CHL",
        label: "Major junior option",
        description: "A major junior path that requires careful discussion about school and eligibility rules.",
        parentNote: "Rules and family priorities can change, so confirm details with trusted current sources.",
        commonNextStep: "Write down the school, housing, and long-term questions before any decision.",
      },
      {
        id: "nahl",
        name: "NAHL",
        label: "U.S. junior option",
        description: "A strong junior path for players working toward college hockey opportunities.",
        parentNote: "Families should understand roster timing, tenders, camps, and school planning.",
        commonNextStep: "Track camps, coach notes, and which teams fit the player's role.",
      },
      {
        id: "ncdc",
        name: "NCDC",
        label: "Junior path",
        description: "A junior option that can connect to college conversations and development goals.",
        parentNote: "Ask how the program supports school, travel, and player development.",
        commonNextStep: "Confirm evaluation dates and what information the coach wants first.",
      },
      {
        id: "ehl",
        name: "EHL",
        label: "College-focused junior path",
        description: "A junior route often considered by players targeting college hockey fit.",
        parentNote: "The right team context matters more than the league name by itself.",
        commonNextStep: "Compare teams, academics, cost, and actual next steps.",
      },
      {
        id: "usphl",
        name: "USPHL",
        label: "Junior league path",
        description: "A broad junior option with different levels and program structures.",
        parentNote: "Families should ask which level is being discussed and what it means.",
        commonNextStep: "Clarify team level, school plan, fees, and evaluation dates.",
      },
      {
        id: "prep-pg",
        name: "Prep / PG",
        label: "Extra school year option",
        description: "A possible extra year to mature, improve academics, and keep playing.",
        parentNote: "This is a family decision about time, school, cost, and development.",
        commonNextStep: "Ask schools what a post-grad year would actually include.",
      },
    ],
  },
  {
    title: "Later Goals",
    intro: "The end goal should stay flexible while the family keeps good records.",
    cards: [
      {
        id: "ncaa-d1",
        name: "NCAA D1",
        label: "College hockey",
        description: "A very competitive college path that requires hockey, school, and timing to line up.",
        parentNote: "Keep the language grounded; no app can promise this outcome.",
        commonNextStep: "Keep academics, video, schedule, and coach references current.",
      },
      {
        id: "ncaa-d3",
        name: "NCAA D3",
        label: "College hockey",
        description: "A college path where school fit, hockey role, and admissions can all matter.",
        parentNote: "This can be a strong path for families who value academics and fit.",
        commonNextStep: "Build a balanced school list and track coach communication.",
      },
      {
        id: "acha",
        name: "ACHA",
        label: "College club hockey",
        description: "A college hockey option with many levels and school experiences.",
        parentNote: "Good fit can mean the player loves the school and still plays meaningful hockey.",
        commonNextStep: "Compare schools first, then understand each team and schedule.",
      },
      {
        id: "pro-minor-pro",
        name: "Pro / Minor Pro",
        label: "After college or junior",
        description: "A later hockey option for a small number of players after more development.",
        parentNote: "Treat it as a long-term possibility, not a planning promise.",
        commonNextStep: "Focus on the next good development setting, not a distant claim.",
      },
    ],
  },
];
