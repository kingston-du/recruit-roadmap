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

export type PlanPath = {
  name: string;
  summary: string;
  whyConsidering: string;
  connectedTargets: Array<{
    name: string;
    kind: string;
    status: string;
  }>;
  nextSteps: string[];
  openQuestions: string[];
};

export type NextSeasonOptionGroup = {
  title: string;
  note: string;
  options: Array<{
    name: string;
    level: string;
    status: string;
    nextStep: string;
  }>;
};

export type PlanChecklistItem = {
  title: string;
  note: string;
  done: boolean;
};

export type TodayAction = {
  title: string;
  whyItMatters: string;
  urgency: string;
  relatedTo: string;
  buttonLabel: string;
  href: string;
};

export type AttentionItem = {
  title: string;
  note: string;
};

export type ProgressItem = {
  title: string;
  done: boolean;
};

export type RoadmapCard = {
  id: string;
  name: string;
  label: string;
  description: string;
  bestFor: string;
  commonNextStep: string;
  whatItIs: string;
  usuallyFor: string;
  howPlayersGetThere: string;
  whatToResearch: string[];
  misconceptions: string[];
  examples?: string[];
};

export type RoadmapSection = {
  title: string;
  intro: string;
  cards: RoadmapCard[];
};

export const playerProfile = {
  name: "Evan Miller",
  birthYear: "2008",
  gradYear: "2027",
  position: "Right-shot defense",
  shoots: "Right",
  height: "6'0\"",
  weight: "178 lb",
  hometown: "Worcester, MA",
  currentTeam: "Cushing Academy",
  currentSchool: "Cushing Academy",
  gpa: "3.72",
  testStatus: "SAT planned for August",
  familyOwner: "Dana Miller",
  targetSummary: "Junior hockey options for 2026-27 with NCAA D3 and ACHA kept open long term.",
  videoStatus: "Prep season highlights updated May 12",
  fullGameStatus: "Needs one recent full-game link from spring showcase play",
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

export const todayPlan = {
  heading: "Today’s Recruiting Plan",
  subheading: "Here are the most important next steps for this week.",
  actions: [
    {
      title: "Follow up with 2 coaches",
      whyItMatters:
        "A short, polite follow-up keeps active conversations from going quiet.",
      urgency: "Due today",
      relatedTo: "Junior Hockey Path",
      buttonLabel: "Open targets",
      href: "/targets",
    },
    {
      title: "Add recent game video to your player profile",
      whyItMatters:
        "Coaches need current video before the family sends more outreach.",
      urgency: "Due Wednesday",
      relatedTo: "My Player",
      buttonLabel: "Update profile",
      href: "/my-player",
    },
    {
      title: "Decide whether to attend a camp",
      whyItMatters:
        "The family should choose events that answer real questions about level and fit.",
      urgency: "Decide by Friday",
      relatedTo: "Junior options",
      buttonLabel: "Review plan",
      href: "/my-plan",
    },
  ] satisfies TodayAction[],
  needsAttention: [
    {
      title: "3 targets have no coach contact yet",
      note: "Add the right contact before sending any outreach.",
    },
    {
      title: "2 follow-ups are overdue",
      note: "Keep replies and next steps from getting buried.",
    },
    {
      title: "Profile is missing recent video",
      note: "Add one full-game link before contacting more teams.",
    },
  ] satisfies AttentionItem[],
  progressSummary: [
    { title: "Player profile started", done: true },
    { title: "8 targets added", done: true },
    { title: "3 coaches contacted", done: true },
    { title: "2 camps saved", done: true },
    { title: "1 response logged", done: true },
  ] satisfies ProgressItem[],
};

export const myPlan = {
  playerSnapshot: {
    birthYear: "2008",
    position: "Right-shot defenseman",
    currentTeam: "Cushing Academy",
    longTermDirection: "Junior hockey with NCAA D3 and ACHA options kept open.",
  },
  mainGoal:
    "Find the best next-step team for the 2026-27 season while keeping college hockey options open.",
  weekFocus: "Clarify junior and PG/prep options while finishing the player profile.",
  selectedPaths: [
    {
      name: "Junior Hockey Path",
      summary: "Explore junior teams that could provide older competition and a clear role.",
      whyConsidering:
        "A junior season may help Evan adjust to older pace before college conversations become more serious.",
      connectedTargets: [
        { name: "Islanders Hockey Club", kind: "NCDC / USPHL", status: "Researching" },
        { name: "Boston Jr. Bruins", kind: "USPHL Premier", status: "Camp planned" },
        { name: "New Hampshire Jr. Monarchs", kind: "EHL", status: "Add to target list" },
      ],
      nextSteps: [
        "Confirm which junior levels fit a 2008 defenseman for 2026-27.",
        "Ask current coach which teams should see full-game video first.",
        "Choose one or two tryouts or camps that answer real questions.",
      ],
      openQuestions: [
        "Which level offers the best balance of role, cost, school plan, and development?",
        "Would a junior team expect a full-season move or a different school setup?",
        "What timeline should the family follow for camps and coach outreach?",
      ],
    },
    {
      name: "College Hockey Path",
      summary: "Keep NCAA D3 and ACHA schools visible while next-season hockey is sorted out.",
      whyConsidering:
        "The family wants college hockey to remain an option without treating any outcome as certain.",
      connectedTargets: [
        { name: "Babson College", kind: "NCAA D3", status: "Long-term research" },
        { name: "Endicott College", kind: "NCAA D3", status: "Long-term research" },
        { name: "University of Rhode Island", kind: "ACHA", status: "Compare school fit" },
      ],
      nextSteps: [
        "Keep transcript, test plan, and player profile current.",
        "Build a balanced college watch list with academic fit first.",
        "Save coach notes separately from family school preferences.",
      ],
      openQuestions: [
        "Which schools fit Evan academically and socially?",
        "What level of college hockey is realistic to explore over time?",
        "How should the family balance D3 and ACHA conversations?",
      ],
    },
    {
      name: "PG / Prep Path",
      summary: "Compare one more prep or PG year if junior timing is not the best next step.",
      whyConsidering:
        "A PG or prep development year could give Evan more time, structure, and academic continuity.",
      connectedTargets: [
        { name: "Cushing Academy PG conversation", kind: "Prep / PG", status: "Questions open" },
        { name: "Northwood School", kind: "Prep", status: "Follow-up due" },
        { name: "Holderness School", kind: "Prep", status: "Researching" },
      ],
      nextSteps: [
        "Ask what a PG year would actually change for hockey and school.",
        "Compare total cost, role, schedule, and academic plan.",
        "Decide whether prep/PG stays active after junior conversations begin.",
      ],
      openQuestions: [
        "Would another prep year create a better role or just delay a decision?",
        "What academic plan would make the year worthwhile?",
        "Which coaches can give honest feedback on this option?",
      ],
    },
  ] satisfies PlanPath[],
  nextSeasonOptions: [
    {
      title: "Junior options",
      note: "Teams and leagues to compare for a possible 2026-27 junior season.",
      options: [
        {
          name: "Islanders Hockey Club",
          level: "NCDC / USPHL",
          status: "Researching",
          nextStep: "Confirm age group, cost, and evaluation timeline.",
        },
        {
          name: "Boston Jr. Bruins",
          level: "USPHL Premier",
          status: "Camp planned",
          nextStep: "Decide whether main camp answers the right questions.",
        },
        {
          name: "New Hampshire Jr. Monarchs",
          level: "EHL",
          status: "Add to target list",
          nextStep: "Find the right coach contact and save basic notes.",
        },
      ],
    },
    {
      title: "Prep / development options",
      note: "School-based options if another structured year is worth comparing.",
      options: [
        {
          name: "Cushing Academy PG conversation",
          level: "Prep / PG",
          status: "Questions open",
          nextStep: "Ask what role and academic plan would look like.",
        },
        {
          name: "Northwood School",
          level: "Prep",
          status: "Follow-up due",
          nextStep: "Send profile update and ask about 2026-27 fit.",
        },
        {
          name: "Holderness School",
          level: "Prep",
          status: "Researching",
          nextStep: "Compare school fit before any outreach.",
        },
      ],
    },
    {
      title: "College long-term options",
      note: "Schools to keep visible while the family learns more about fit and level.",
      options: [
        {
          name: "Babson College",
          level: "NCAA D3",
          status: "Long-term research",
          nextStep: "Save academic fit notes and roster context.",
        },
        {
          name: "Endicott College",
          level: "NCAA D3",
          status: "Long-term research",
          nextStep: "Add admissions and program notes.",
        },
        {
          name: "University of Rhode Island",
          level: "ACHA",
          status: "Compare school fit",
          nextStep: "Understand club schedule, cost, and tryout process.",
        },
      ],
    },
  ] satisfies NextSeasonOptionGroup[],
  thirtyDayPlan: [
    {
      title: "Finish player profile",
      note: "Update height, academics, current team, coach references, and contact info.",
      done: false,
    },
    {
      title: "Add 10 target teams",
      note: "Use junior, prep/development, and college long-term groups.",
      done: false,
    },
    {
      title: "Contact 5 coaches",
      note: "Send complete information only after profile and video are ready.",
      done: false,
    },
    {
      title: "Choose 2 camps/tryouts to evaluate",
      note: "Pick events that answer specific questions about level and fit.",
      done: false,
    },
    {
      title: "Follow up with responses",
      note: "Track replies, questions, and the next family decision.",
      done: false,
    },
  ] satisfies PlanChecklistItem[],
};

export const roadmapSections: RoadmapSection[] = [
  {
    title: "Starting Points",
    intro: "Where a player is playing now usually shapes the first set of choices.",
    cards: [
      {
        id: "aaa-hockey",
        name: "AAA Hockey",
        label: "Youth club",
        description: "A high-level youth club path with travel, showcases, and regular team competition.",
        bestFor: "Players already handling a demanding hockey schedule with family support.",
        commonNextStep: "Keep video, schedule, school info, and coach references organized.",
        whatItIs:
          "AAA hockey is a competitive youth club setting. It can provide strong games and exposure, but it still needs a thoughtful school and development plan.",
        usuallyFor:
          "Players who are ready for travel, deeper competition, and a more serious team schedule.",
        howPlayersGetThere:
          "Players usually join through tryouts, coach referrals, spring evaluation skates, or moving up from local programs.",
        whatToResearch: [
          "Practice and travel schedule",
          "Showcase or tournament calendar",
          "Player role and coaching fit",
          "School workload during travel weeks",
        ],
        misconceptions: [
          "AAA alone does not guarantee future junior or college options.",
          "The strongest name on the jersey is not always the best development fit.",
        ],
        examples: ["Regional AAA programs", "Tier 1 tournaments", "Major showcase weekends"],
      },
      {
        id: "high-school-hockey",
        name: "High School Hockey",
        label: "School team",
        description: "A school-based path that can pair with club, split-season, or showcase options.",
        bestFor: "Players who want school stability while continuing to develop.",
        commonNextStep: "Compare the school season with any outside training or exposure options.",
        whatItIs:
          "High school hockey keeps the player connected to school while providing meaningful team competition.",
        usuallyFor:
          "Players whose local school program is a good athletic, academic, and social fit.",
        howPlayersGetThere:
          "Players usually join through school tryouts and may add club, split-season, or off-season events.",
        whatToResearch: [
          "Strength of schedule",
          "Coach communication",
          "Video availability",
          "Off-season development plan",
        ],
        misconceptions: [
          "High school hockey is not automatically too low or automatically enough.",
          "Families may still need to track video, academics, and selected outside events.",
        ],
        examples: ["Varsity high school teams", "Split-season programs", "Summer showcases"],
      },
      {
        id: "prep-school",
        name: "Prep School",
        label: "School-first",
        description: "A private school route where academics, admissions, and hockey fit are connected.",
        bestFor: "Families comparing school environment and hockey development together.",
        commonNextStep: "Prepare transcript, profile, video, and admissions questions.",
        whatItIs:
          "Prep school hockey combines a school decision with a hockey decision. The process usually includes admissions, financial planning, and coach conversations.",
        usuallyFor:
          "Players who may benefit from a structured school setting, strong academics, and a serious hockey schedule.",
        howPlayersGetThere:
          "Players usually connect through coach outreach, visits, admissions conversations, showcases, and current-coach references.",
        whatToResearch: [
          "Admissions timeline",
          "Academic support",
          "Boarding or day-student expectations",
          "Team level and player role",
        ],
        misconceptions: [
          "A prep coach conversation is not the same as admission.",
          "A strong hockey fit still needs to make sense for school and family life.",
        ],
        examples: ["NEPSAC programs", "Independent prep programs", "Post-grad options"],
      },
      {
        id: "academy",
        name: "Academy",
        label: "Training-heavy",
        description: "A hockey-focused setting built around frequent training, games, and school planning.",
        bestFor: "Players who need a more concentrated daily development environment.",
        commonNextStep: "Compare schedule, school support, housing, cost, and player role.",
        whatItIs:
          "An academy is usually built around hockey development with school support arranged around the training calendar.",
        usuallyFor:
          "Players who can handle a focused training lifestyle and families who understand the school and housing plan.",
        howPlayersGetThere:
          "Players usually connect through evaluations, coach calls, visits, or recommendations from current coaches.",
        whatToResearch: [
          "Academic model",
          "Housing or billet setup",
          "Training load",
          "Game schedule and travel",
        ],
        misconceptions: [
          "More ice time is not automatically better if school, rest, or role are unclear.",
          "Families should not assume every academy has the same academic structure.",
        ],
        examples: ["Hockey academies", "Training-centered school programs", "Residential programs"],
      },
    ],
  },
  {
    title: "Development / Exposure Paths",
    intro: "Most families compare school-based prep options and junior hockey before bigger decisions.",
    cards: [
      {
        id: "prep-pg-year",
        name: "Prep / PG Year",
        label: "Extra school year",
        description: "An added school year that can support maturity, academics, and hockey development.",
        bestFor: "Players who may benefit from time, structure, and a stronger school profile.",
        commonNextStep: "Ask schools what the year includes academically, athletically, and financially.",
        whatItIs:
          "A prep or post-grad year can give a player another year in a school-based hockey environment before college or junior decisions.",
        usuallyFor:
          "Players who need more physical maturity, academic polish, exposure, or time to choose the right next step.",
        howPlayersGetThere:
          "Families usually connect through school outreach, visits, applications, coach calls, and references.",
        whatToResearch: [
          "Eligibility and age fit",
          "Course plan",
          "Team role",
          "Cost and housing",
        ],
        misconceptions: [
          "An extra year should have a clear purpose, not just delay a decision.",
          "A post-grad year is not automatically a college placement plan.",
        ],
        examples: ["Prep post-grad year", "Repeat junior year", "Academic bridge year"],
      },
      {
        id: "junior-hockey",
        name: "Junior Hockey",
        label: "Older development",
        description: "A post-youth path where older players develop before or around college options.",
        bestFor: "Players ready for older competition and a serious lifestyle conversation.",
        commonNextStep: "Clarify league level, team cost, school plan, housing, and player role.",
        whatItIs:
          "Junior hockey is a broad category for older players. The right league and team can vary widely by player, age, goals, and family situation.",
        usuallyFor:
          "Players who need more time and competition before college, or who are exploring a higher-level hockey path.",
        howPlayersGetThere:
          "Players usually connect through coach outreach, camps, tenders, drafts, showcases, or referrals.",
        whatToResearch: [
          "League and team level",
          "Fees and housing",
          "School or work plan",
          "How the coach sees the player's role",
        ],
        misconceptions: [
          "The league name alone does not tell the whole story.",
          "A camp invite is not the same as a roster spot.",
        ],
        examples: ["USHL", "CHL", "NAHL", "NCDC", "EHL", "USPHL Premier", "NA3HL"],
      },
    ],
  },
  {
    title: "Junior Branches",
    intro: "Junior options should be researched by league, team, cost, role, school plan, and timing.",
    cards: [
      {
        id: "ushl",
        name: "USHL",
        label: "U.S. junior",
        description: "A highly competitive U.S. junior league for players ready for a major step.",
        bestFor: "Players already tracking toward a top junior and college pathway.",
        commonNextStep: "Research team fit, camp process, draft/tender context, and school timing.",
        whatItIs:
          "The USHL is a high-level U.S. junior option. It is very selective and requires careful timing and fit.",
        usuallyFor:
          "Older players who are physically, mentally, and technically ready for high-level junior hockey.",
        howPlayersGetThere:
          "Players may be identified through elite youth hockey, camps, showcases, drafts, tenders, or coach networks.",
        whatToResearch: [
          "Team needs",
          "Camp purpose",
          "Education plan",
          "How the player would be used",
        ],
        misconceptions: [
          "Being noticed is not the same as having a clear roster role.",
          "The best path for one player may not fit another player.",
        ],
        examples: ["USHL clubs", "USHL combines", "Team main camps"],
      },
      {
        id: "chl",
        name: "CHL",
        label: "Major junior",
        description: "A major junior path that requires careful school and eligibility questions.",
        bestFor: "Players and families ready to study the full school, housing, and hockey impact.",
        commonNextStep: "Write down eligibility, education, housing, and long-term questions first.",
        whatItIs:
          "The CHL is a major junior route in Canada. Families should research current rules and implications before making decisions.",
        usuallyFor:
          "Players considering a major junior environment and willing to evaluate the full life and school picture.",
        howPlayersGetThere:
          "Players are typically identified through drafts, scouting, camps, regional play, and coach conversations.",
        whatToResearch: [
          "Current eligibility rules",
          "Education package",
          "Billet or housing plan",
          "Player role and timeline",
        ],
        misconceptions: [
          "A CHL conversation should not be treated casually.",
          "Families should verify current rules rather than relying on old assumptions.",
        ],
        examples: ["OHL", "WHL", "QMJHL"],
      },
      {
        id: "nahl",
        name: "NAHL",
        label: "U.S. junior",
        description: "A strong U.S. junior route often connected to college hockey goals.",
        bestFor: "Players who need a competitive junior setting before college decisions.",
        commonNextStep: "Track team contacts, camps, tender context, and likely player role.",
        whatItIs:
          "The NAHL is a U.S. junior league where players often continue developing toward college hockey.",
        usuallyFor:
          "Players ready for older competition with college hockey still part of the plan.",
        howPlayersGetThere:
          "Players may enter through drafts, tenders, camps, scouting, or coach referrals.",
        whatToResearch: [
          "Team style",
          "Roster needs",
          "Camp cost and purpose",
          "Academic or college support",
        ],
        misconceptions: [
          "A tender or camp conversation still needs careful context.",
          "Team fit matters as much as league label.",
        ],
        examples: ["NAHL teams", "NAHL combines", "Team camps"],
      },
      {
        id: "ncdc",
        name: "NCDC",
        label: "Junior path",
        description: "A junior option that can support development and college conversations.",
        bestFor: "Players comparing junior options with school and family logistics in mind.",
        commonNextStep: "Ask about team level, cost, housing, schedule, and college support.",
        whatItIs:
          "The NCDC is a junior pathway families may consider as part of the broader junior landscape.",
        usuallyFor:
          "Players seeking older competition and a team environment with development goals.",
        howPlayersGetThere:
          "Players usually connect through tryouts, camps, coach outreach, showcases, and referrals.",
        whatToResearch: [
          "Team structure",
          "Cost and housing",
          "Game schedule",
          "College placement support",
        ],
        misconceptions: [
          "Families should not assume every team experience is the same.",
          "A junior path still needs a school and life plan.",
        ],
        examples: ["NCDC teams", "NCDC combines", "Affiliate programs"],
      },
      {
        id: "ehl",
        name: "EHL",
        label: "Junior path",
        description: "A college-focused junior path for players seeking fit and development.",
        bestFor: "Players targeting a realistic college hockey and academic fit.",
        commonNextStep: "Compare team role, academics, costs, and coach communication.",
        whatItIs:
          "The EHL is a junior route that many families evaluate alongside academic and college hockey goals.",
        usuallyFor:
          "Players who need more time and games before identifying the right college environment.",
        howPlayersGetThere:
          "Players usually connect through showcases, team camps, referrals, and direct coach outreach.",
        whatToResearch: [
          "Team track record",
          "Player role",
          "Cost structure",
          "College conversations",
        ],
        misconceptions: [
          "A college-focused label does not replace individual research.",
          "The right team fit can matter more than a broad league impression.",
        ],
        examples: ["EHL teams", "EHL Premier", "College showcase events"],
      },
      {
        id: "usphl-premier",
        name: "USPHL Premier",
        label: "Junior path",
        description: "A broad junior option where team level and family fit need close review.",
        bestFor: "Players comparing regional junior opportunities and development roles.",
        commonNextStep: "Clarify team level, costs, housing, schedule, and what the coach expects.",
        whatItIs:
          "USPHL Premier is part of a broad junior landscape with many teams and local differences.",
        usuallyFor:
          "Players seeking junior competition while the family weighs cost, travel, and school plans.",
        howPlayersGetThere:
          "Players often connect through tryouts, showcases, camps, direct outreach, and referrals.",
        whatToResearch: [
          "Exact team level",
          "Fees and housing",
          "Practice and game schedule",
          "How players move on from the program",
        ],
        misconceptions: [
          "A broad league requires team-by-team research.",
          "A roster offer should still be reviewed against school, cost, and role.",
        ],
        examples: ["USPHL Premier teams", "USPHL showcases", "Team main camps"],
      },
      {
        id: "na3hl",
        name: "NA3HL",
        label: "Junior path",
        description: "A junior option that may support continued development and later opportunities.",
        bestFor: "Players who need more time, games, and structure before the next step.",
        commonNextStep: "Ask how the team develops players and what the realistic next step could be.",
        whatItIs:
          "The NA3HL is a junior route families may consider when looking for continued development and structure.",
        usuallyFor:
          "Players who are still maturing and need a clear team role, development plan, and family fit.",
        howPlayersGetThere:
          "Players usually connect through camps, tryouts, direct outreach, scouting, and referrals.",
        whatToResearch: [
          "Development plan",
          "Cost and housing",
          "Practice environment",
          "Next-step history",
        ],
        misconceptions: [
          "Lower-cost or local convenience should not be the only deciding factor.",
          "Families should ask what the path after the season could look like.",
        ],
        examples: ["NA3HL teams", "Team tryouts", "Regional junior showcases"],
      },
    ],
  },
  {
    title: "College Branches",
    intro: "College options are about hockey fit, school fit, admissions, cost, and timing.",
    cards: [
      {
        id: "ncaa-d1",
        name: "NCAA D1",
        label: "College hockey",
        description: "A very competitive college hockey path where timing and fit both matter.",
        bestFor: "Players already performing at a high level with strong academic organization.",
        commonNextStep: "Keep academics, video, schedule, references, and compliant communication current.",
        whatItIs:
          "NCAA D1 hockey is a highly selective college route. Families should keep language careful and focus on preparation.",
        usuallyFor:
          "Players who are strong hockey fits for D1 programs and can handle the academic and athletic demands.",
        howPlayersGetThere:
          "Players are usually evaluated through junior hockey, prep, academy, elite youth events, video, and coach networks.",
        whatToResearch: [
          "Academic fit",
          "Program needs",
          "Communication rules",
          "Campus and cost fit",
        ],
        misconceptions: [
          "No app or event can guarantee a D1 opportunity.",
          "Attention from a program does not equal admission or a roster spot.",
        ],
        examples: ["NCAA D1 programs", "College camps", "Junior/prep scouting"],
      },
      {
        id: "ncaa-d3",
        name: "NCAA D3",
        label: "College hockey",
        description: "A college path where school fit, hockey role, and admissions often work together.",
        bestFor: "Players who value academics, campus fit, and a meaningful hockey role.",
        commonNextStep: "Build a balanced school list and track coach conversations carefully.",
        whatItIs:
          "NCAA D3 hockey can be a strong college path when the school, academics, cost, and hockey role make sense together.",
        usuallyFor:
          "Players seeking a serious college hockey experience with a strong emphasis on school fit.",
        howPlayersGetThere:
          "Players usually connect through coach outreach, video, transcripts, visits, camps, and current-coach references.",
        whatToResearch: [
          "Admissions fit",
          "Academic programs",
          "Team level and role",
          "Financial aid and cost",
        ],
        misconceptions: [
          "D3 is not one single level of hockey.",
          "School fit should not be ignored for a hockey-only reason.",
        ],
        examples: ["NCAA D3 programs", "NESCAC", "UCHC", "SUNYAC"],
      },
      {
        id: "acha",
        name: "ACHA",
        label: "College club",
        description: "A college club hockey route with many levels and school experiences.",
        bestFor: "Players who want a strong college experience and still want competitive hockey.",
        commonNextStep: "Compare schools first, then understand each club team and schedule.",
        whatItIs:
          "ACHA hockey is college club hockey. The experience can vary widely by school and team level.",
        usuallyFor:
          "Players who want to choose the right college while keeping hockey as an important part of campus life.",
        howPlayersGetThere:
          "Players may contact coaches, attend school visits, join tryouts, or connect after admission.",
        whatToResearch: [
          "School fit",
          "Team level",
          "Tryout process",
          "Travel and fees",
        ],
        misconceptions: [
          "Club hockey can still be competitive and demanding.",
          "The school decision should lead the hockey decision for many ACHA paths.",
        ],
        examples: ["ACHA D1", "ACHA D2", "ACHA D3"],
      },
    ],
  },
  {
    title: "Outcomes",
    intro: "Outcomes are not promises. They are possible directions families may prepare for.",
    cards: [
      {
        id: "college-hockey",
        name: "College Hockey",
        label: "Student-athlete",
        description: "A path where school choice and hockey opportunity come together.",
        bestFor: "Players who want hockey to support a strong college experience.",
        commonNextStep: "Keep the school list, video, transcript, and coach notes current.",
        whatItIs:
          "College hockey can include varsity and club paths. The right version depends on academics, hockey level, cost, and fit.",
        usuallyFor:
          "Players who want to continue playing while building toward a degree and a broader future.",
        howPlayersGetThere:
          "Players usually arrive through youth, prep, academy, junior, high school, club, or camp pathways.",
        whatToResearch: [
          "Academic program",
          "Admissions standards",
          "Team fit",
          "Financial plan",
        ],
        misconceptions: [
          "College hockey is not one single path.",
          "The best college outcome is not always the highest hockey label.",
        ],
        examples: ["NCAA D1", "NCAA D3", "ACHA"],
      },
      {
        id: "pro-minor-pro",
        name: "Pro / Minor Pro",
        label: "Later hockey",
        description: "A later possibility for a small number of players after more development.",
        bestFor: "Players who keep progressing through high-level junior, college, or similar paths.",
        commonNextStep: "Focus on the next good development setting rather than distant promises.",
        whatItIs:
          "Professional and minor pro hockey are later outcomes. Families should treat them as possibilities, not planning guarantees.",
        usuallyFor:
          "Players who continue to perform and develop at advanced levels after youth and junior decisions.",
        howPlayersGetThere:
          "Players usually move through advanced junior, college, major junior, or other high-level routes before pro conversations.",
        whatToResearch: [
          "Current development setting",
          "Health and readiness",
          "Education plan",
          "Trusted advisor guidance",
        ],
        misconceptions: [
          "A young player's roadmap should not be built around a pro promise.",
          "Education and life planning still matter.",
        ],
        examples: ["Minor pro leagues", "College free-agent paths", "Major junior/pro pathways"],
      },
    ],
  },
];
