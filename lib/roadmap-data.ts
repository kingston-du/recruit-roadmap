export type PathwayStageId =
  | "youth-school"
  | "prep-academy"
  | "us-junior"
  | "canadian-junior"
  | "college"
  | "later-hockey";

export type LeagueType = "Youth" | "School" | "Prep" | "Academy" | "Junior" | "College" | "Pro";

export type Geography =
  | "United States"
  | "Canada"
  | "United States / Canada"
  | "North America";

export type PerspectiveType = "For parents" | "For coaches" | "For scouts";

export type SourceLink = {
  label: string;
  url: string;
};

export type NotableTeam = {
  name: string;
  location: string;
  url: string;
  note: string;
};

export type PerspectiveNote = {
  type: PerspectiveType;
  body: string;
};

export type League = {
  slug: string;
  name: string;
  shortName: string;
  type: LeagueType;
  stageId: PathwayStageId;
  geography: Geography;
  category: string;
  summary: string;
  overview: string;
  whoFor: string[];
  entryPoints: string[];
  researchQuestions: string[];
  costLogistics: string[];
  notableTeams: NotableTeam[];
  perspectives: PerspectiveNote[];
  sources: SourceLink[];
  lastReviewed: string;
};

export type PathwayStage = {
  id: PathwayStageId;
  eyebrow: string;
  title: string;
  description: string;
};

export const lastContentReviewDate = "2026-06-18";

export const pathwayStages: PathwayStage[] = [
  {
    id: "youth-school",
    eyebrow: "Foundation",
    title: "Youth, AAA, and high school",
    description:
      "The first big choices involve coaching, ice time, travel, school, and the amount of hockey a family can manage.",
  },
  {
    id: "prep-academy",
    eyebrow: "Structured development",
    title: "Prep and academy programs",
    description:
      "Prep schools and academies combine hockey with school, and sometimes housing. The full experience and full cost both matter.",
  },
  {
    id: "us-junior",
    eyebrow: "U.S. junior",
    title: "U.S. junior hockey",
    description:
      "Junior teams can differ a lot in playing time, fees, housing, coaching, and help with college hockey.",
  },
  {
    id: "canadian-junior",
    eyebrow: "Canadian junior",
    title: "Canadian major junior and Junior A",
    description:
      "Major junior, the BCHL, and Junior A each have their own rules, costs, and effects on school and college options.",
  },
  {
    id: "college",
    eyebrow: "College hockey",
    title: "College hockey",
    description:
      "College hockey includes varsity and club teams. The school, cost, campus, and roster spot all deserve equal attention.",
  },
  {
    id: "later-hockey",
    eyebrow: "Later hockey",
    title: "Professional and minor pro outcomes",
    description:
      "A look at professional hockey for older players and for families who want to understand what comes after college or junior.",
  },
];

export const leagues: League[] = [
  {
    slug: "aaa-hockey",
    name: "AAA / Tier I Youth Hockey",
    shortName: "AAA",
    type: "Youth",
    stageId: "youth-school",
    geography: "United States",
    category: "Elite youth club",
    summary:
      "The highest youth club level in USA Hockey, with frequent travel, tournaments, and a demanding schedule.",
    overview:
      "AAA, also called Tier I, is usually the most demanding youth club hockey available in an area. The pace can be excellent, but a family still needs to look closely at the coach, the player's likely role, the school schedule, travel, and total cost.",
    whoFor: [
      "Players already thriving in a serious practice and travel environment.",
      "Families prepared for frequent travel, extra training, and a large season bill.",
      "Players who need strong competition before school, prep, academy, or junior decisions.",
    ],
    entryPoints: [
      "Open tryouts or invite skates.",
      "Coach referrals from current youth programs.",
      "District or affiliate events tied to USA Hockey pathways.",
    ],
    researchQuestions: [
      "How much would the player actually play?",
      "How much travel sits on school weekends?",
      "Does the team produce usable video and a clear schedule?",
      "What is the development plan beyond the jersey name?",
    ],
    costLogistics: [
      "Team fee, tournament fee, travel, hotels, meals, extra training, and missed school time.",
      "Parent travel capacity and sibling/family schedule impact.",
      "Whether the program has academic support expectations during heavy travel.",
    ],
    notableTeams: [
      {
        name: "Shattuck-St. Mary's",
        location: "Faribault, Minnesota",
        url: "https://www.s-sm.org/athletics/hockey",
        note: "School and academy style program often researched by elite youth families.",
      },
      {
        name: "Little Caesars",
        location: "Detroit, Michigan",
        url: "https://littlecaesarshockey.com/",
        note: "Long-running Michigan youth program with national-level teams.",
      },
      {
        name: "Chicago Mission",
        location: "Chicago, Illinois",
        url: "https://www.chicagomission.com/",
        note: "Chicago-area Tier I program commonly seen in national youth conversations.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Making the team is only part of the decision. Ask whether the ice time, travel, and school load will work for the whole family.",
      },
      {
        type: "For coaches",
        body: "Good AAA hockey teaches pace. Players still need useful feedback, steady habits, and a role they understand.",
      },
    ],
    sources: [
      { label: "USA Hockey Youth Tier I Nationals", url: "https://nationals.usahockey.com/2026youthtieri" },
      { label: "USA Hockey Annual Guide", url: "https://www.usahockey.com/annualguide" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "high-school-hockey",
    name: "High School Hockey",
    shortName: "High school",
    type: "School",
    stageId: "youth-school",
    geography: "United States / Canada",
    category: "School based hockey",
    summary:
      "Hockey tied to a player's school, either on its own or alongside club and seasonal programs.",
    overview:
      "High school hockey means something different from one region to the next. In Minnesota it can be the main season. In other places, players may combine it with club hockey or spring and summer events.",
    whoFor: [
      "Players whose school program offers the right mix of role, coaching, academics, and schedule.",
      "Families wanting a stronger school and community connection.",
      "Players using school hockey alongside club, showcase, or development options.",
    ],
    entryPoints: [
      "School tryouts.",
      "Enrollment or transfer into a school with a team.",
      "Outside the season communication with school coaches where allowed.",
    ],
    researchQuestions: [
      "How strong is the schedule compared with the player's goals?",
      "Can the family get game video?",
      "How does the coach handle development, communication, and role?",
      "Which outside events can the player attend without doing too much?",
    ],
    costLogistics: [
      "School athletic fees, booster costs, equipment, travel, and outside the season development.",
      "Academic eligibility and school attendance expectations.",
      "How club and high school calendars fit together.",
    ],
    notableTeams: [
      {
        name: "Minnesota boys high school hockey",
        location: "Minnesota",
        url: "https://www.mshsl.org/sports-and-activities/hockey-boys",
        note: "A major state high school hockey ecosystem and a useful example of a school-centered path.",
      },
      {
        name: "Massachusetts high school hockey",
        location: "Massachusetts",
        url: "https://www.miaa.net/sports/hockey",
        note: "A public/private high school landscape often paired with club and showcase decisions.",
      },
      {
        name: "Michigan high school hockey",
        location: "Michigan",
        url: "https://www.mhsaa.com/sports/ice-hockey",
        note: "A Midwest high school option families may compare with AAA or junior options.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "High school hockey can work very well when a player gets real minutes, enjoys school, and still has room to improve.",
      },
      {
        type: "For scouts",
        body: "Look at the schedule, the player's role, and the quality of the game video. The words high school hockey do not tell the full story.",
      },
    ],
    sources: [
      { label: "Minnesota State High School League boys hockey", url: "https://www.mshsl.org/sports-and-activities/hockey-boys" },
      { label: "USA Hockey High School Nationals", url: "https://nationals.usahockey.com/2026highschool" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "nepsac-prep",
    name: "NEPSAC Boys Prep Hockey",
    shortName: "NEPSAC",
    type: "Prep",
    stageId: "prep-academy",
    geography: "United States",
    category: "Prep school",
    summary:
      "New England prep school hockey, where admission, tuition, school life, and the team all come with one decision.",
    overview:
      "Choosing a NEPSAC school starts with the school itself. Hockey is a major part of the decision, but admission, financial aid, boarding or day student life, academics, and the coach's plans for the player matter just as much.",
    whoFor: [
      "Players who may benefit from a structured school environment.",
      "Families weighing academics and hockey in one decision.",
      "Players who need time, maturity, and strong daily surroundings before junior or college conversations.",
    ],
    entryPoints: [
      "Admissions inquiry and campus visit.",
      "Coach communication with video, transcript, and references.",
      "A referral from the current coach, a school showcase, or a prospect event.",
    ],
    researchQuestions: [
      "Is the player admissible and affordable for the family?",
      "How much is the player likely to play in the first year?",
      "How do the admission dates line up with the coach's timeline?",
      "What happens if the team is no longer right for the player after enrollment?",
    ],
    costLogistics: [
      "Tuition, boarding/day cost, financial aid timing, travel, gear, and school breaks.",
      "Academic course plan and graduation timing.",
      "Whether the family is considering a repeat year or a postgraduate year.",
    ],
    notableTeams: [
      {
        name: "Avon Old Farms",
        location: "Avon, Connecticut",
        url: "https://www.avonoldfarms.com/athletics/teams/hockey-varsity",
        note: "New England prep program families often include in research lists.",
      },
      {
        name: "Cushing Academy",
        location: "Ashburnham, Massachusetts",
        url: "https://www.cushing.org/athletics/teams/boys-ice-hockey",
        note: "Prep program with boys hockey, academics, and boarding school considerations.",
      },
      {
        name: "Phillips Andover",
        location: "Andover, Massachusetts",
        url: "https://athletics.andover.edu/teams/bih",
        note: "Academically focused prep environment with boys varsity hockey.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "The school should still feel like a good choice if hockey does not go exactly as planned.",
      },
      {
        type: "For coaches",
        body: "Have a transcript, video, and current schedule ready. Ask the coach plainly about playing time and admission dates.",
      },
    ],
    sources: [
      { label: "NEPSAC boys ice hockey", url: "https://nepsac.org/coaches-associations/boys-sports/boys-ice-hockey-nepsbiha/" },
      { label: "NEPSAC home", url: "https://nepsac.org/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "csshl",
    name: "Canadian Sport School Hockey League",
    shortName: "CSSHL",
    type: "Academy",
    stageId: "prep-academy",
    geography: "Canada",
    category: "Sport school / academy",
    summary:
      "A Canadian academy league that combines school, daily training, and games across several age groups.",
    overview:
      "CSSHL programs build school and hockey into the same daily schedule. Each school handles classes, training, travel, and residence differently, so ask for details about the exact program and division.",
    whoFor: [
      "Players seeking a daily training environment attached to school.",
      "Families considering residence or academy life.",
      "Players comparing western Canadian academy options with prep, AAA, or junior paths.",
    ],
    entryPoints: [
      "Program application or evaluation camp.",
      "Coach conversation with academic and hockey materials.",
      "School/residence visit and admissions review.",
    ],
    researchQuestions: [
      "Which division and age group would the player enter?",
      "What is the actual school model and academic support?",
      "How much travel is required?",
      "What is the residence or billet plan?",
    ],
    costLogistics: [
      "Tuition, academy fee, residence, travel, equipment, and family travel.",
      "Provincial or national sanctioning context for the specific school.",
      "Course transfer and graduation requirements.",
    ],
    notableTeams: [
      {
        name: "BWC Academy",
        location: "Burnaby, British Columbia",
        url: "https://www.csshl.ca/team/bwc-academy/",
        note: "CSSHL program example from the official league ecosystem.",
      },
      {
        name: "Edge School",
        location: "Calgary, Alberta",
        url: "https://www.csshl.ca/team/edge-school/",
        note: "Sport school program families commonly research in Alberta.",
      },
      {
        name: "Rink Hockey Academy Winnipeg",
        location: "Winnipeg, Manitoba",
        url: "https://www.csshl.ca/team/rink-hockey-academy-winnipeg/",
        note: "Academy-style program within the CSSHL footprint.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "A daily academy schedule can be excellent, but only when the school, housing, rest, and price work for the family.",
      },
      {
        type: "For scouts",
        body: "Academy games may draw scouts, but a player's performance and role matter more than the academy name.",
      },
    ],
    sources: [
      { label: "CSSHL home", url: "https://www.csshl.ca/" },
      { label: "CSSHL about", url: "https://www.csshl.ca/about/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "ushl",
    name: "United States Hockey League",
    shortName: "USHL",
    type: "Junior",
    stageId: "us-junior",
    geography: "United States",
    category: "USA Hockey Tier I junior",
    summary:
      "USA Hockey's top junior league and a common option to NCAA Division I hockey.",
    overview:
      "The USHL is extremely selective. An invite to camp is not the same as a roster spot, so ask exactly where the player stands. The draft, tenders, school, billet family, and likely place in the lineup all need clear answers.",
    whoFor: [
      "Players already competing at or near top junior pace.",
      "Families prepared for a serious junior lifestyle conversation.",
      "Players with strong college hockey goals and clear readiness signals.",
    ],
    entryPoints: [
      "USHL draft or tender process.",
      "Team main camp or futures camp.",
      "Identification through elite youth, prep, academy, or junior performance.",
    ],
    researchQuestions: [
      "Is there a real roster path or only a camp look?",
      "How does the team handle school and billet support?",
      "What player type does the team need?",
      "What happens if the player is affiliated but not rostered?",
    ],
    costLogistics: [
      "Billet and living logistics, school plan, travel home, equipment, and NCAA eligibility considerations.",
      "Camp fees and whether the camp is evaluation, exposure, or building team depth.",
      "Timing around drafts, tenders, affiliates, and protected lists.",
    ],
    notableTeams: [
      {
        name: "Chicago Steel",
        location: "Geneva, Illinois",
        url: "https://chicagosteelhockeyteam.com/",
        note: "USHL program commonly referenced in top level junior research.",
      },
      {
        name: "Fargo Force",
        location: "Fargo, North Dakota",
        url: "https://fargoforce.com/",
        note: "Upper Midwest USHL organization for families studying Tier I junior.",
      },
      {
        name: "Waterloo Black Hawks",
        location: "Waterloo, Iowa",
        url: "https://waterlooblackhawks.com/",
        note: "Long-running USHL organization with a visible junior footprint.",
      },
    ],
    perspectives: [
      {
        type: "For scouts",
        body: "USHL interest matters, but ask whether there is an actual roster opening and who will help with school and housing.",
      },
      {
        type: "For parents",
        body: "Ask who handles school, where the player will live, how often the team communicates, and what happens when he is out of the lineup.",
      },
    ],
    sources: [
      { label: "USHL official site", url: "https://ushl.com/" },
      { label: "USA Hockey junior hockey", url: "https://www.usahockey.com/juniorhockey" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "nahl",
    name: "North American Hockey League",
    shortName: "NAHL",
    type: "Junior",
    stageId: "us-junior",
    geography: "United States",
    category: "USA Hockey Tier II junior",
    summary:
      "USA Hockey's Tier II junior league and a well known option toward college hockey.",
    overview:
      "The NAHL sits below the USHL in USA Hockey's junior system. Teams recruit differently, so find out whether the conversation is about a tender, a draft pick, camp, or a roster spot. Playing time, housing, and school support vary by team.",
    whoFor: [
      "Players ready for older junior competition.",
      "Families comparing junior leagues that place players in college programs.",
      "Players who need more development time before college decisions.",
    ],
    entryPoints: [
      "NAHL draft, tender, or team camp.",
      "Main camp invite after prep, AAA, academy, or lower junior performance.",
      "Direct coach outreach with video and schedule.",
    ],
    researchQuestions: [
      "Is the team talking about a roster spot, affiliate spot, or camp evaluation?",
      "What does the player development plan look like?",
      "How does the team support school or college placement?",
      "What is the team's current depth chart by position?",
    ],
    costLogistics: [
      "Billet, travel, equipment, living expenses, and camp fees.",
      "School, online course, or graduation plan.",
      "Tender and draft implications for other options.",
    ],
    notableTeams: [
      {
        name: "Austin Bruins",
        location: "Austin, Minnesota",
        url: "https://austinbruins.com/",
        note: "Midwest NAHL organization for families comparing Tier II junior fits.",
      },
      {
        name: "Bismarck Bobcats",
        location: "Bismarck, North Dakota",
        url: "https://www.bismarckbobcats.com/",
        note: "NAHL organization with a long-running league footprint.",
      },
      {
        name: "Anchorage Wolverines",
        location: "Anchorage, Alaska",
        url: "https://www.anchoragewolverines.com/",
        note: "Example of the broad geography families must consider in the NAHL.",
      },
    ],
    perspectives: [
      {
        type: "For coaches",
        body: "A useful NAHL conversation includes a likely role, a timeline, and an honest list of what the player still needs to improve.",
      },
      {
        type: "For parents",
        body: "Compare billet arrangements, school plans, trips home, and where similar players went after the season.",
      },
    ],
    sources: [
      { label: "NAHL official site", url: "https://www.nahl.com/" },
      { label: "USA Hockey junior hockey", url: "https://www.usahockey.com/juniorhockey" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "ncdc",
    name: "National Collegiate Development Conference",
    shortName: "NCDC",
    type: "Junior",
    stageId: "us-junior",
    geography: "United States / Canada",
    category: "USPHL top junior division",
    summary:
      "The highest junior division in the USPHL, with teams in the United States and Canada.",
    overview:
      "The NCDC is the top USPHL division, but the experience depends on the team. Ask about the player's place on the roster, every fee, housing, the schedule, and how the coaching staff works with colleges.",
    whoFor: [
      "Players comparing U.S. junior options with college goals.",
      "Families who want regional junior options as well as more selective leagues.",
      "Players looking for older competition and continued development.",
    ],
    entryPoints: [
      "Team tryouts and main camps.",
      "Direct coach outreach with video.",
      "Showcase or referral from current coaches.",
    ],
    researchQuestions: [
      "What is included financially and what is extra?",
      "How does this specific team place players or support college conversations?",
      "Where would the player sit on the roster for his age group?",
      "How does the schedule compare with NAHL, EHL, or USPHL Premier options?",
    ],
    costLogistics: [
      "Housing, travel, equipment, league/team fees if applicable, and family visits.",
      "College advising and academic plan.",
      "Whether the team has a clear development path for the player's position.",
    ],
    notableTeams: [
      {
        name: "Jersey Hitmen",
        location: "Wayne, New Jersey",
        url: "https://www.jerseyhitmen.net/",
        note: "Established USPHL/NCDC organization often researched in the Northeast.",
      },
      {
        name: "South Shore Kings",
        location: "Foxboro, Massachusetts",
        url: "https://www.southshorekings.com/",
        note: "Massachusetts program in the NCDC footprint.",
      },
      {
        name: "Idaho Falls Spud Kings",
        location: "Idaho Falls, Idaho",
        url: "https://www.idahofallsspudkings.com/",
        note: "Western NCDC example showing the league's growing geography.",
      },
    ],
    perspectives: [
      {
        type: "For scouts",
        body: "The level and daily experience can differ by market. Judge the team and coaching staff, not only the league name.",
      },
      {
        type: "For parents",
        body: "Get the costs, housing plan, schedule, and college support in writing before committing.",
      },
    ],
    sources: [
      { label: "NCDC official site", url: "https://usphl.com/ncdc/" },
      { label: "USPHL official site", url: "https://usphl.com/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "usphl-premier",
    name: "USPHL Premier",
    shortName: "USPHL Premier",
    type: "Junior",
    stageId: "us-junior",
    geography: "United States / Canada",
    category: "Broad junior division",
    summary:
      "A large junior division whose teams vary widely in level, cost, travel, and player experience.",
    overview:
      "USPHL Premier covers many markets and many levels of play. One team's reputation says little about another. Research the coach, roster, schedule, housing, fees, and recent player moves for the exact team calling you.",
    whoFor: [
      "Players looking for regular ice time in junior hockey.",
      "Families comparing regional affordability with development value.",
      "Players who need more games, maturity, and structure before college or higher junior options.",
    ],
    entryPoints: [
      "Open tryouts, team camps, direct outreach, or showcases.",
      "Referral from current coach or skills coach.",
      "Movement from youth, high school, prep, or lower junior levels.",
    ],
    researchQuestions: [
      "What is the team's level compared with nearby options?",
      "What is the full season cost?",
      "How many players actually move to the stated next step?",
      "Will the player get regular minutes and useful feedback?",
    ],
    costLogistics: [
      "Team fee, housing, meals, travel, equipment, showcases, and school or work plan.",
      "Whether fees differ by team or market.",
      "How the family will evaluate value after the season.",
    ],
    notableTeams: [
      {
        name: "Northern Cyclones",
        location: "Hudson, New Hampshire",
        url: "https://www.northerncyclones.com/",
        note: "Multi-level organization commonly researched in USPHL conversations.",
      },
      {
        name: "Connecticut Jr. Rangers",
        location: "Stamford, Connecticut",
        url: "https://www.ctjrrangers.com/",
        note: "Northeast program example for families comparing USPHL levels.",
      },
      {
        name: "Vernal Oilers",
        location: "Vernal, Utah",
        url: "https://www.vernaloilers.com/",
        note: "Western program example showing the league's broad footprint.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Write down the cost, likely role, housing, travel, and recent player moves for every team you speak with.",
      },
      {
        type: "For coaches",
        body: "Regular ice time with a good coach may help more than sitting on a team with a stronger name.",
      },
    ],
    sources: [
      { label: "USPHL Premier official site", url: "https://usphl.com/premier/" },
      { label: "USPHL official site", url: "https://usphl.com/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "ehl",
    name: "Eastern Hockey League",
    shortName: "EHL",
    type: "Junior",
    stageId: "us-junior",
    geography: "United States",
    category: "Northeast junior",
    summary:
      "A junior league in the Northeast and Mid Atlantic with a strong focus on college hockey.",
    overview:
      "The EHL gives players another year or two to develop and speak with college programs. The experience depends on the team, so ask how the coach communicates, what the season costs, how school works, and where recent players went next.",
    whoFor: [
      "Players seeking junior games on a team that works with college programs.",
      "Families in or near the Northeast comparing cost and geography.",
      "Players needing more time before NCAA D3, ACHA, or other college options.",
    ],
    entryPoints: [
      "Team tryouts and league events.",
      "Direct coach outreach with profile and video.",
      "A recommendation from the player's current coach.",
    ],
    researchQuestions: [
      "Which college programs does the team speak with regularly?",
      "What level of player succeeds on this roster?",
      "What is the practice and game environment?",
      "What does the cost include?",
    ],
    costLogistics: [
      "Team fee, housing, travel, showcases, and school or work plan.",
      "Distance from home and family support.",
      "Whether the player can build a strong role quickly.",
    ],
    notableTeams: [
      {
        name: "New Hampshire Avalanche",
        location: "Hooksett, New Hampshire",
        url: "https://www.nhavalanche.com/",
        note: "EHL organization frequently researched in New England junior paths.",
      },
      {
        name: "New Jersey 87's",
        location: "Middletown, New Jersey",
        url: "https://www.nj87s.com/",
        note: "Mid Atlantic example in the EHL footprint.",
      },
      {
        name: "East Coast Wizards",
        location: "Bedford, Massachusetts",
        url: "https://www.eastcoastwizards.com/",
        note: "Massachusetts program listed in the EHL team ecosystem.",
      },
    ],
    perspectives: [
      {
        type: "For coaches",
        body: "The coach should be able to explain the player's role, daily expectations, and the colleges that may suit him.",
      },
      {
        type: "For parents",
        body: "Be clear about the purpose of the season. It may be development, college interest, or simply more time to play.",
      },
    ],
    sources: [
      { label: "EHL official site", url: "https://easternhockeyleague.org/" },
      { label: "EHL teams", url: "https://easternhockeyleague.org/teams/ehl/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "na3hl",
    name: "North American 3 Hockey League",
    shortName: "NA3HL",
    type: "Junior",
    stageId: "us-junior",
    geography: "United States",
    category: "USA Hockey Tier III junior",
    summary:
      "A USA Hockey Tier III league in the same league family as the NAHL.",
    overview:
      "The NA3HL can give a player regular games and more development time. Ask for the full cost, the expected role, the daily training plan, and recent examples of players who moved to another junior league or college.",
    whoFor: [
      "Players who need more development time and regular junior minutes.",
      "Families comparing local or regional junior options.",
      "Players looking to build toward college club, NCAA D3 possibilities, or higher junior opportunities.",
    ],
    entryPoints: [
      "NA3HL draft, tryouts, team camps, or direct outreach.",
      "Movement from high school, AAA, prep, or other junior levels.",
      "Referral from current coaches.",
    ],
    researchQuestions: [
      "How does the team develop players day to day?",
      "Where have players gone after this team?",
      "What is the complete cost and housing plan?",
      "How many players have moved up recently, and to where?",
    ],
    costLogistics: [
      "Team fees, billet or housing costs, travel, showcases, and school or work plans.",
      "Whether the family can afford a season that may not directly produce a higher level offer.",
      "Distance and travel burden.",
    ],
    notableTeams: [
      {
        name: "Rochester Grizzlies",
        location: "Rochester, Minnesota",
        url: "https://www.rochestergrizz.com/",
        note: "Upper Midwest NA3HL program example.",
      },
      {
        name: "St. Louis Jr. Blues",
        location: "Affton, Missouri",
        url: "https://www.stljrblues.org/",
        note: "Long-running junior organization in the NA3HL ecosystem.",
      },
      {
        name: "Granite City Lumberjacks",
        location: "Sauk Rapids, Minnesota",
        url: "https://www.lumberjackshockey.com/",
        note: "Minnesota NA3HL program families may see in Tier III research.",
      },
    ],
    perspectives: [
      {
        type: "For scouts",
        body: "Tier III can make sense when the player will play, improve, and has a sound plan for the following season.",
      },
      {
        type: "For parents",
        body: "Start your comparison with the total bill and what the player will receive for it.",
      },
    ],
    sources: [
      { label: "NA3HL official site", url: "https://na3hl.com/" },
      { label: "USA Hockey junior hockey", url: "https://www.usahockey.com/juniorhockey" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "chl",
    name: "Canadian Hockey League",
    shortName: "CHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Major junior organization",
    summary:
      "The organization that includes the WHL, OHL, and QMJHL major junior leagues.",
    overview:
      "The CHL is made up of the WHL, OHL, and QMJHL. A major junior offer is a serious decision. Ask about education money, billet housing, team rights, eligibility rules, and what signing means for every other option.",
    whoFor: [
      "Players being seriously evaluated for major junior hockey.",
      "Families prepared to study education packages, housing, and career implications.",
      "Players considering a highly competitive junior environment in Canada or U.S. CHL markets.",
    ],
    entryPoints: [
      "CHL member league drafts or priority selections.",
      "Team camps and scouting identification.",
      "Protected list or rights conversations.",
    ],
    researchQuestions: [
      "Which member league and team holds the opportunity?",
      "What are the education package details?",
      "How do current NCAA and eligibility rules affect this decision?",
      "When does the team expect the player to join, and how would it use him?",
    ],
    costLogistics: [
      "Billet/housing, school, travel, equipment, family visits, and education package terms.",
      "Travel between countries logistics for U.S. families.",
      "Current eligibility and scholarship rules, verified directly with governing bodies.",
    ],
    notableTeams: [
      {
        name: "London Knights",
        location: "London, Ontario",
        url: "https://chl.ca/ohl-knights/",
        note: "OHL program commonly researched by families studying major junior.",
      },
      {
        name: "Medicine Hat Tigers",
        location: "Medicine Hat, Alberta",
        url: "https://chl.ca/whl-tigers/",
        note: "WHL program example in the CHL ecosystem.",
      },
      {
        name: "Halifax Mooseheads",
        location: "Halifax, Nova Scotia",
        url: "https://chl.ca/lhjmq-mooseheads/",
        note: "QMJHL program example in Atlantic Canada.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Do not rush a CHL decision. Confirm the education package, team rights, billet plan, and current eligibility rules yourself.",
      },
      {
        type: "For scouts",
        body: "Interest from a major junior team is important. The player still needs to be ready, have a place to play, and want the same things his family wants.",
      },
    ],
    sources: [
      { label: "CHL about", url: "https://chl.ca/aboutthechl/" },
      { label: "CHL official site", url: "https://chl.ca/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "whl",
    name: "Western Hockey League",
    shortName: "WHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "CHL member league",
    summary:
      "A major junior league with teams across Western Canada and the Pacific Northwest.",
    overview:
      "The WHL is one of three leagues in the CHL. When a team shows interest, ask whether it holds the player's rights, where he sits on the depth chart, how school will work, where he will live, and when the team expects an answer.",
    whoFor: [
      "Players in western Canadian or Pacific Northwest scouting conversations.",
      "Families evaluating major junior against NCAA, Junior A, prep, or academy options.",
      "Players ready for a demanding junior hockey environment.",
    ],
    entryPoints: [
      "WHL Prospects Draft or team protected list interest.",
      "Team camps and scouting identification.",
      "Academy, prep, or elite youth performance.",
    ],
    researchQuestions: [
      "Does the team see the player as a current roster player or future prospect?",
      "What education support is offered?",
      "How does the WHL path affect other options?",
      "What is the billet and family communication structure?",
    ],
    costLogistics: [
      "Housing, the education package, travel, family visits, and border paperwork.",
      "Rights and camp timing.",
      "Current NCAA and eligibility implications.",
    ],
    notableTeams: [
      {
        name: "Brandon Wheat Kings",
        location: "Brandon, Manitoba",
        url: "https://chl.ca/whl-wheatkings/",
        note: "WHL club listed through the official CHL/WHL site.",
      },
      {
        name: "Everett Silvertips",
        location: "Everett, Washington",
        url: "https://chl.ca/whl-silvertips/",
        note: "based in the United States WHL example in the Pacific Northwest.",
      },
      {
        name: "Kamloops Blazers",
        location: "Kamloops, British Columbia",
        url: "https://chl.ca/whl-blazers/",
        note: "Western Canadian WHL club families may encounter in major junior research.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Rights, a camp invite, and an offered roster spot are three different things. Ask which one is actually on the table.",
      },
      {
        type: "For scouts",
        body: "The WHL suits players who are ready for the pace and schedule. Coaches should speak plainly about the player's likely role.",
      },
    ],
    sources: [
      { label: "WHL official site", url: "https://chl.ca/whl/" },
      { label: "WHL about", url: "https://chl.ca/whl/about/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "ohl",
    name: "Ontario Hockey League",
    shortName: "OHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "CHL member league",
    summary:
      "A major junior league based mainly in Ontario, with a few teams in the United States.",
    overview:
      "The OHL is one of the three CHL leagues. Before a player signs or reports, confirm the current eligibility rules, team rights, education package, expected role, billet arrangements, and which other options remain open.",
    whoFor: [
      "Players being scouted or drafted into OHL conversations.",
      "Families in Ontario or nearby United States markets comparing major junior with NCAA options.",
      "Players ready for a demanding junior schedule and lifestyle.",
    ],
    entryPoints: [
      "OHL Priority Selection or team camp.",
      "Scouting through AAA, prep, academy, or junior play.",
      "Team communication after evaluation events.",
    ],
    researchQuestions: [
      "What is the team's timeline for the player?",
      "What education package applies?",
      "How would this affect NCAA or school options?",
      "What is the player's likely ice time and development role?",
    ],
    costLogistics: [
      "Billet housing, the education package, family travel, school, and border paperwork.",
      "Rights, protected lists, and camp commitments.",
      "Current eligibility rules verified from official sources.",
    ],
    notableTeams: [
      {
        name: "London Knights",
        location: "London, Ontario",
        url: "https://chl.ca/ohl-knights/",
        note: "Prominent OHL organization families often research in major junior comparisons.",
      },
      {
        name: "Kitchener Rangers",
        location: "Kitchener, Ontario",
        url: "https://chl.ca/ohl-rangers/",
        note: "OHL club example from the official league ecosystem.",
      },
      {
        name: "Erie Otters",
        location: "Erie, Pennsylvania",
        url: "https://chl.ca/ohl-otters/",
        note: "based in the United States OHL club showing the league's travel between countries footprint.",
      },
    ],
    perspectives: [
      {
        type: "For scouts",
        body: "Ask what the OHL team actually wants from the player. Draft status alone does not explain the opportunity.",
      },
      {
        type: "For parents",
        body: "Keep four items at the top of the list: education money, eligibility, billet housing, and playing time.",
      },
    ],
    sources: [
      { label: "OHL official site", url: "https://chl.ca/ohl/" },
      { label: "CHL official site", url: "https://chl.ca/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "qmjhl",
    name: "Quebec Maritimes Junior Hockey League",
    shortName: "QMJHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "CHL member league",
    summary:
      "A major junior league with teams in Quebec and Atlantic Canada.",
    overview:
      "The QMJHL is one of the three CHL leagues. Ask the team about school language, the education package, billet housing, the player's expected role, and the current rules that affect college eligibility.",
    whoFor: [
      "Players being evaluated for major junior in Quebec or Atlantic Canada.",
      "Families comparing CHL options with Junior A, prep, academy, NCAA, or U SPORTS options.",
      "Players ready for older competition and major junior demands.",
    ],
    entryPoints: [
      "QMJHL draft or team camp.",
      "Scouting from Quebec, Atlantic Canada, prep, academy, or other elite play.",
      "Direct team communication after identification.",
    ],
    researchQuestions: [
      "What school and language support is available?",
      "What does the team expect in year one?",
      "How does the education package work?",
      "What options remain open after signing or reporting?",
    ],
    costLogistics: [
      "Billet, education, travel, family visits, and school/language support.",
      "Current CHL/NCAA eligibility and education package rules.",
      "Distance from home and parent communication cadence.",
    ],
    notableTeams: [
      {
        name: "Halifax Mooseheads",
        location: "Halifax, Nova Scotia",
        url: "https://chl.ca/lhjmq-mooseheads/",
        note: "Atlantic Canada QMJHL organization in the official CHL network.",
      },
      {
        name: "Quebec Remparts",
        location: "Quebec City, Quebec",
        url: "https://chl.ca/lhjmq-remparts/",
        note: "Quebec market QMJHL club families may research.",
      },
      {
        name: "Moncton Wildcats",
        location: "Moncton, New Brunswick",
        url: "https://chl.ca/lhjmq-wildcats/",
        note: "New Brunswick QMJHL club example.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Language, school, and distance from home may matter as much as hockey for a QMJHL player.",
      },
      {
        type: "For scouts",
        body: "Draft status does not decide whether a player is ready or whether the team is right for him.",
      },
    ],
    sources: [
      { label: "QMJHL official site", url: "https://chl.ca/lhjmq/en/" },
      { label: "QMJHL teams", url: "https://chl.ca/lhjmq/en/teams/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "bchl",
    name: "British Columbia Hockey League",
    shortName: "BCHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian junior",
    summary:
      "An independent junior league with teams in British Columbia and Alberta.",
    overview:
      "The BCHL is often compared with the CHL, AJHL, prep schools, academies, and junior leagues in the United States. Its structure and college relationships have changed in recent years, so confirm the current rules with the league and the college governing body.",
    whoFor: [
      "Players comparing the top Canadian junior options.",
      "Families focused on development and college possibilities.",
      "Players in western Canada or the United States who are open to crossing the border.",
    ],
    entryPoints: [
      "Team camps and direct coach conversations.",
      "Scouting through academy, prep, AAA, or Junior A play.",
      "Referral from current coaches or advisors.",
    ],
    researchQuestions: [
      "What is the team's current league and eligibility context?",
      "What is the college placement history for similar players?",
      "How does the team handle school and housing?",
      "What role is available by position and age?",
    ],
    costLogistics: [
      "Housing, travel, equipment, team fees if applicable, and school plan.",
      "Travel between countries and college eligibility implications.",
      "Family travel across British Columbia and Alberta.",
    ],
    notableTeams: [
      {
        name: "Penticton Vees",
        location: "Penticton, British Columbia",
        url: "https://www.pentictonvees.ca/",
        note: "BCHL organization commonly researched in western Canadian junior paths.",
      },
      {
        name: "Brooks Bandits",
        location: "Brooks, Alberta",
        url: "https://www.brooksbandits.ca/",
        note: "Alberta market BCHL example after recent western junior changes.",
      },
      {
        name: "Surrey Eagles",
        location: "Surrey, British Columbia",
        url: "https://www.surreyeagles.ca/",
        note: "Lower Mainland BCHL organization for regional comparison.",
      },
    ],
    perspectives: [
      {
        type: "For scouts",
        body: "Old advice about the BCHL may no longer be correct. Check the league status and eligibility rules now in effect.",
      },
      {
        type: "For parents",
        body: "Ask each team about school, housing, every fee, and where players of a similar age and position went next.",
      },
    ],
    sources: [
      { label: "BCHL official site", url: "https://bchl.ca/" },
      { label: "BCHL team contacts", url: "https://bchl.ca/team-contacts" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "ajhl",
    name: "Alberta Junior Hockey League",
    shortName: "AJHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian Junior A",
    summary:
      "A Junior A league in Alberta with teams across the province.",
    overview:
      "The AJHL is a Junior A option in Alberta. Its makeup has changed, so look at the current teams and schedule before comparing it with the BCHL, CSSHL, CHL, or leagues in the United States.",
    whoFor: [
      "Players in Alberta or western Canada seeking Junior A opportunities.",
      "Families comparing school, cost, distance, and development environments.",
      "Players building toward college, higher junior, or U SPORTS options.",
    ],
    entryPoints: [
      "Team camps and spring identification skates.",
      "Direct outreach with video and current schedule.",
      "Regional scouting and coach referrals.",
    ],
    researchQuestions: [
      "How has the team's level changed with recent western junior movement?",
      "Where would the player sit on the roster for his age?",
      "How does the team support school or college goals?",
      "What are the exact fees and housing details?",
    ],
    costLogistics: [
      "Team fees, billet, travel, equipment, and family travel within Alberta.",
      "Education or work plan.",
      "League structure and eligibility updates.",
    ],
    notableTeams: [
      {
        name: "Calgary Canucks",
        location: "Calgary, Alberta",
        url: "https://www.calgarycanucks.ca/",
        note: "Calgary market AJHL club listed in league team materials.",
      },
      {
        name: "Camrose Kodiaks",
        location: "Camrose, Alberta",
        url: "https://www.camrosekodiaks.ca/",
        note: "Longstanding Alberta Junior A program.",
      },
      {
        name: "Drumheller Dragons",
        location: "Drumheller, Alberta",
        url: "https://www.drumhellerdragons.ca/",
        note: "AJHL program example outside the largest metro markets.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Western junior hockey has changed. Check the current teams and competition level instead of relying on an old description.",
      },
      {
        type: "For coaches",
        body: "An AJHL spot can work when the player knows how he will be used and what the coach expects him to earn next.",
      },
    ],
    sources: [
      { label: "AJHL official site", url: "https://www.ajhl.ca/" },
      { label: "AJHL standings and teams", url: "https://www.ajhl.ca/stats/standings" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "ojhl",
    name: "Ontario Junior Hockey League",
    shortName: "OJHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian Junior A",
    summary:
      "A large Junior A league with teams across Ontario and one in New York.",
    overview:
      "The OJHL has enough teams that the experience can vary across the league. Look at the exact roster, coach, travel schedule, school plan, fees, and where that club's players have gone recently.",
    whoFor: [
      "Players in Ontario or nearby U.S. markets considering Junior A.",
      "Families comparing OJHL with CCHL, NOJHL, BCHL, CHL, or U.S. junior options.",
      "Players looking for development time and college/U SPORTS possibilities.",
    ],
    entryPoints: [
      "Team camps and prospect events.",
      "Direct coach outreach with video.",
      "Scouting through AAA, prep, high school, or other junior leagues.",
    ],
    researchQuestions: [
      "What division and competitive environment fits the player?",
      "What is the team's recent advancement record?",
      "What is the full family cost?",
      "How does school or work fit the schedule?",
    ],
    costLogistics: [
      "Team fees, billet, travel, equipment, and local transportation.",
      "School/work plan during the season.",
      "Travel between countries implications for U.S. players.",
    ],
    notableTeams: [
      {
        name: "Collingwood Blues",
        location: "Collingwood, Ontario",
        url: "https://www.collingwoodblues.ca/",
        note: "OJHL program often seen in Ontario Junior A research.",
      },
      {
        name: "Trenton Golden Hawks",
        location: "Trenton, Ontario",
        url: "https://www.trentongoldenhawks.ca/",
        note: "Eastern Ontario OJHL club example.",
      },
      {
        name: "Buffalo Jr. Sabres",
        location: "Buffalo, New York",
        url: "https://www.buffalojrsabres.com/",
        note: "based in the United States OJHL example in the official league footprint.",
      },
    ],
    perspectives: [
      {
        type: "For scouts",
        body: "A general opinion of the OJHL will not tell you much about one club. Study the team and the role being offered.",
      },
      {
        type: "For parents",
        body: "Put the full cost and school plan next to any claims about college advancement.",
      },
    ],
    sources: [
      { label: "OJHL official site", url: "https://www.ojhl.ca/" },
      { label: "CJHL OJHL member clubs", url: "https://www.cjhlhockey.com/en/ojhl" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "cchl",
    name: "Central Canada Hockey League",
    shortName: "CCHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian Junior A",
    summary:
      "A Junior A league in Ottawa and the surrounding communities of Eastern Ontario.",
    overview:
      "The CCHL is centered in Eastern Ontario. Ask about the available roster spot, school arrangements, billet family, fees, travel, and where recent players of the same age and position moved next.",
    whoFor: [
      "Players in Eastern Ontario, western Quebec, or the northeastern United States.",
      "Families comparing Junior A with prep, CHL, or U.S. junior options.",
      "Players seeking more development before college or U SPORTS conversations.",
    ],
    entryPoints: [
      "Team camps and local scouting.",
      "Direct outreach with player profile and video.",
      "Referral from AAA, prep, or junior coaches.",
    ],
    researchQuestions: [
      "What role is available and how many similar players are already rostered?",
      "How does the team support academics or college conversations?",
      "What is the billet and travel plan?",
      "What are recent next steps for players by age and position?",
    ],
    costLogistics: [
      "Fees, housing, travel, equipment, school plan, and family visit distance.",
      "Travel between countries or provincial paperwork where applicable.",
      "Showcases and exposure events.",
    ],
    notableTeams: [
      {
        name: "Ottawa Jr. Senators",
        location: "Ottawa, Ontario",
        url: "https://www.ottawajuniorsenators.com/",
        note: "Ottawa area CCHL club commonly researched in Junior A comparisons.",
      },
      {
        name: "Carleton Place Canadians",
        location: "Carleton Place, Ontario",
        url: "https://www.cpcanadians.com/",
        note: "CCHL organization with a visible Junior A footprint.",
      },
      {
        name: "Pembroke Lumber Kings",
        location: "Pembroke, Ontario",
        url: "https://www.pembrokelumberkings.ca/",
        note: "Historic Eastern Ontario Junior A program.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "The CCHL may keep some families closer to home. That does not replace a careful look at playing time and cost.",
      },
      {
        type: "For coaches",
        body: "The coach should be able to explain how the player will be used, what he needs to improve, and which teams or schools may come next.",
      },
    ],
    sources: [
      { label: "CCHL official site", url: "https://www.thecchl.ca/" },
      { label: "CJHL CCHL member clubs", url: "https://www.cjhlhockey.com/en/cchl" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "sjhl",
    name: "Saskatchewan Junior Hockey League",
    shortName: "SJHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian Junior A",
    summary:
      "A Junior A league with community teams across Saskatchewan and one in Manitoba.",
    overview:
      "SJHL teams play in smaller prairie communities and spend a lot of time on the road. Ask how the player will be used, who supports him each day, and where recent players from that team went afterward.",
    whoFor: [
      "Players in Saskatchewan, Manitoba, Alberta, or nearby U.S. regions.",
      "Families comparing prairie Junior A options.",
      "Players looking for regular games before college or U SPORTS.",
    ],
    entryPoints: [
      "Team camps and regional scouting.",
      "Direct coach outreach.",
      "Movement from AAA, academy, high school, or other junior leagues.",
    ],
    researchQuestions: [
      "How does the team's travel schedule affect school or work?",
      "What kind of player succeeds in this market?",
      "What does the team provide for billets and support?",
      "What next steps have recent players taken?",
    ],
    costLogistics: [
      "Billet, team fees, travel, equipment, school or work plan, and family visits.",
      "Long distance travel across Saskatchewan.",
      "Weather and transportation realities for families visiting.",
    ],
    notableTeams: [
      {
        name: "Humboldt Broncos",
        location: "Humboldt, Saskatchewan",
        url: "https://www.humboldtbroncos.com/",
        note: "Saskatchewan Junior A program listed in league team materials.",
      },
      {
        name: "Flin Flon Bombers",
        location: "Flin Flon, Manitoba",
        url: "https://www.flinflonbombers.com/",
        note: "SJHL club with a notable across provincial borders location.",
      },
      {
        name: "Battlefords North Stars",
        location: "North Battleford, Saskatchewan",
        url: "https://www.northstars.ca/",
        note: "Community-based SJHL organization families may research.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Prairie junior can be a good experience when the billet home is solid and everyone understands the travel and playing time.",
      },
      {
        type: "For scouts",
        body: "SJHL players are visible in their towns. Coaches notice how they handle hockey and the responsibility that comes with it.",
      },
    ],
    sources: [
      { label: "SJHL official site", url: "https://www.sjhl.ca/" },
      { label: "CJHL SJHL member clubs", url: "https://www.cjhlhockey.com/en/sjhl" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "mjhl",
    name: "Manitoba Junior Hockey League",
    shortName: "MJHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian Junior A",
    summary:
      "A Junior A league with teams throughout Manitoba.",
    overview:
      "The MJHL is another prairie Junior A option. Compare each team's roster needs, travel, fees, school or work arrangements, billet setup, and recent player moves.",
    whoFor: [
      "Players in Manitoba and nearby western Canadian markets.",
      "Families comparing Junior A options with academy, CHL, or U.S. junior options.",
      "Players who need a strong role and continued development time.",
    ],
    entryPoints: [
      "Team camps and prospect skates.",
      "Regional scouting.",
      "Direct outreach with profile, video, and schedule.",
    ],
    researchQuestions: [
      "What role would the player have by age and position?",
      "What are the team's recent advancement examples?",
      "How is housing handled?",
      "How does the schedule support school or work?",
    ],
    costLogistics: [
      "Fees, billet, travel, equipment, winter travel, and school or work plan.",
      "Family distance to games and home visits.",
      "Showcase and exposure costs.",
    ],
    notableTeams: [
      {
        name: "Steinbach Pistons",
        location: "Steinbach, Manitoba",
        url: "https://www.steinbachpistons.ca/",
        note: "MJHL club frequently seen in Manitoba Junior A research.",
      },
      {
        name: "Portage Terriers",
        location: "Portage la Prairie, Manitoba",
        url: "https://www.portageterriers.com/",
        note: "Long-running MJHL organization.",
      },
      {
        name: "Winkler Flyers",
        location: "Winkler, Manitoba",
        url: "https://www.winklerflyers.com/",
        note: "Southern Manitoba Junior A program example.",
      },
    ],
    perspectives: [
      {
        type: "For coaches",
        body: "The season makes more sense when the player knows his role and what he needs to show by the end of it.",
      },
      {
        type: "For parents",
        body: "Talk through winter driving, road trips, and visits home before the season starts.",
      },
    ],
    sources: [
      { label: "MJHL official site", url: "https://www.mjhlhockey.ca/" },
      { label: "CJHL MJHL member clubs", url: "https://www.cjhlhockey.com/en/mjhl" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "sijhl",
    name: "Superior International Junior Hockey League",
    shortName: "SIJHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian Junior A",
    summary:
      "A smaller Junior A league in northwestern Ontario and nearby parts of the United States.",
    overview:
      "The SIJHL has a small group of teams spread across a large area. Ask about travel, billet housing, fees, the player's role, and where recent players from that club went next.",
    whoFor: [
      "Players in northwestern Ontario, Manitoba, Minnesota, Michigan, or nearby regions.",
      "Families comparing smaller market Junior A environments.",
      "Players seeking role, games, and development time.",
    ],
    entryPoints: [
      "Team camps and regional scouting.",
      "Direct coach outreach.",
      "Movement from AAA, high school, academy, or other junior levels.",
    ],
    researchQuestions: [
      "How does the smaller footprint affect travel and exposure?",
      "What is the team's recent advancement history?",
      "What is included in housing and fees?",
      "How much could the player expect to play right away?",
    ],
    costLogistics: [
      "Fees, billet, local travel, long distance family visits, and winter travel.",
      "School/work plan during the season.",
      "Travel between countries details for U.S. players.",
    ],
    notableTeams: [
      {
        name: "Kam River Fighting Walleye",
        location: "Oliver Paipoonge, Ontario",
        url: "https://www.fightingwalleye.com/",
        note: "SIJHL organization in the Thunder Bay area.",
      },
      {
        name: "Dryden GM Ice Dogs",
        location: "Dryden, Ontario",
        url: "https://www.drydenicedogs.net/",
        note: "Northwestern Ontario Junior A program.",
      },
      {
        name: "Sioux Lookout Bombers",
        location: "Sioux Lookout, Ontario",
        url: "https://www.siouxlookoutbombers.com/",
        note: "SIJHL club example in the official league footprint.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "A smaller market may suit a player who will play often and has dependable support away from home.",
      },
      {
        type: "For scouts",
        body: "Scouts care about what a player does with his minutes and responsibility, regardless of league size.",
      },
    ],
    sources: [
      { label: "SIJHL official site", url: "https://sijhlhockey.com/" },
      { label: "CJHL SIJHL member clubs", url: "https://www.cjhlhockey.com/en/sijhl" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "nojhl",
    name: "Northern Ontario Junior Hockey League",
    shortName: "NOJHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian Junior A",
    summary:
      "A Junior A league in Northern Ontario with teams near the Michigan border.",
    overview:
      "NOJHL teams cover a wide area in Northern Ontario. Look closely at the road schedule, billet support, fees, coaching, and the place the player would have on the roster.",
    whoFor: [
      "Players in northern Ontario, Michigan, or nearby areas.",
      "Families considering Junior A with a community based team environment.",
      "Players who need more development time and regular minutes.",
    ],
    entryPoints: [
      "Team camps, local scouting, and direct outreach.",
      "AAA, high school, academy, or junior referrals.",
      "Regional showcases.",
    ],
    researchQuestions: [
      "What role would the player have on this roster?",
      "How is travel handled across the league footprint?",
      "What are the team's recent advancement examples?",
      "How strong is the billet and daily support system?",
    ],
    costLogistics: [
      "Team fees, billet, travel, equipment, school or work plan, and family visits.",
      "Weather and distance logistics.",
      "Border paperwork and travel for players from the United States.",
    ],
    notableTeams: [
      {
        name: "Timmins Rock",
        location: "Timmins, Ontario",
        url: "https://www.timminsrock.com/",
        note: "NOJHL program families may encounter in Northern Ontario research.",
      },
      {
        name: "Soo Thunderbirds",
        location: "Sault Ste. Marie, Ontario",
        url: "https://www.soothunderbirds.com/",
        note: "NOJHL club near the United States and Canada border.",
      },
      {
        name: "Greater Sudbury Cubs",
        location: "Sudbury, Ontario",
        url: "https://www.greatersudburycubs.com/",
        note: "Northern Ontario Junior A example from the league footprint.",
      },
    ],
    perspectives: [
      {
        type: "For coaches",
        body: "A coach should explain the player's role, how the staff will help him improve, and what he could earn after a good season.",
      },
      {
        type: "For parents",
        body: "Distance from home and the quality of the billet arrangement matter just as much as the league level.",
      },
    ],
    sources: [
      { label: "NOJHL official site", url: "https://nojhl.com/" },
      { label: "NOJHL about", url: "https://nojhl.com/about-the-nojhl" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "qjhl",
    name: "Quebec Junior Hockey League",
    shortName: "QJHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian Junior A",
    summary:
      "Quebec's Junior AAA league, also known by its French abbreviation LHJAAAQ.",
    overview:
      "The QJHL, also known as the LHJAAAQ, is Quebec's Junior A league. Ask about the language used at school and with the team, the work or school schedule, fees, playing time, and recent player moves.",
    whoFor: [
      "Players in Quebec or nearby markets comparing Junior A options.",
      "Families weighing French/English environment and school logistics.",
      "Players seeking a role and continued development after midget/AAA, prep, or school hockey.",
    ],
    entryPoints: [
      "Team camps and league draft/identification options.",
      "Direct coach communication.",
      "Referral from Quebec youth, prep, or junior coaches.",
    ],
    researchQuestions: [
      "What help is available with language, school, or work?",
      "How does this team move players forward?",
      "What are the total costs?",
      "Where would the player sit on the roster for his age?",
    ],
    costLogistics: [
      "Team fees, billet or commute, travel, equipment, and school or work plan.",
      "Language environment and family communication.",
      "Travel between countries or provincial paperwork if applicable.",
    ],
    notableTeams: [
      {
        name: "Condors du Cegep Beauce-Appalaches",
        location: "Saint-Georges, Quebec",
        url: "https://www.lhjaaaq.com/",
        note: "QJHL member club listed through the official league site.",
      },
      {
        name: "Everest de la Cote-du-Sud",
        location: "Montmagny, Quebec",
        url: "https://www.lhjaaaq.com/",
        note: "Quebec Junior AAA example for families studying the league.",
      },
      {
        name: "Flames de Gatineau",
        location: "Gatineau, Quebec",
        url: "https://www.lhjaaaq.com/",
        note: "Outaouais-market QJHL example.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Language, school, and the daily commute may have as much effect on the season as hockey does.",
      },
      {
        type: "For coaches",
        body: "Ask the coach what he expects the player to improve by the end of the season.",
      },
    ],
    sources: [
      { label: "QJHL official site", url: "https://www.lhjaaaq.com/" },
      { label: "CJHL QJHL member clubs", url: "https://www.cjhlhockey.com/en/lhjaaaq" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "mhl",
    name: "Maritime Junior Hockey League",
    shortName: "MHL",
    type: "Junior",
    stageId: "canadian-junior",
    geography: "Canada",
    category: "Canadian Junior A",
    summary:
      "A Junior A league in New Brunswick, Nova Scotia, and Prince Edward Island.",
    overview:
      "The MHL is the Junior A league for Atlantic Canada. Ask each team about road travel, billet support, school or work, fees, the available roster spot, and where recent players went next.",
    whoFor: [
      "Players in Atlantic Canada or families considering an Atlantic junior option.",
      "Players needing development time before college, U SPORTS, or higher junior options.",
      "Families comparing MHL with QMJHL, prep, academy, or U.S. junior paths.",
    ],
    entryPoints: [
      "Team camps and regional scouting.",
      "Direct outreach with video and player profile.",
      "Referral from current coaches.",
    ],
    researchQuestions: [
      "How does the team support schooling and billets?",
      "What role would the player have?",
      "What are recent next steps for similar players?",
      "How does the travel schedule affect family logistics?",
    ],
    costLogistics: [
      "Fees, billet, travel across Atlantic Canada, equipment, school or work plan, and family visits.",
      "Weather and distance planning.",
      "Showcase and exposure costs.",
    ],
    notableTeams: [
      {
        name: "Summerside Western Capitals",
        location: "Summerside, Prince Edward Island",
        url: "https://www.summersidewesterncapitals.ca/",
        note: "Prince Edward Island MHL program.",
      },
      {
        name: "Truro Bearcats",
        location: "Truro, Nova Scotia",
        url: "https://www.trurojrabearcats.ca/",
        note: "Nova Scotia MHL club example.",
      },
      {
        name: "Yarmouth Mariners",
        location: "Yarmouth, Nova Scotia",
        url: "https://www.yarmouthmariners.ca/",
        note: "Atlantic Junior A organization families may research.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Playing in Atlantic Canada can be a good life experience. Make sure the distance from home and billet support will work.",
      },
      {
        type: "For scouts",
        body: "Regular minutes in the MHL can help a player if he and the coach agree on what he is trying to earn next.",
      },
    ],
    sources: [
      { label: "MHL official site", url: "https://www.themhl.ca/" },
      { label: "CJHL MHL member league context", url: "https://www.cjhlhockey.com/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "ncaa-d1",
    name: "NCAA Division I Men's Hockey",
    shortName: "NCAA D1",
    type: "College",
    stageId: "college",
    geography: "United States",
    category: "Varsity college",
    summary:
      "The most selective varsity college hockey level in the United States.",
    overview:
      "NCAA Division I men's hockey has very few roster spots. Keep transcripts, video, schedules, references, and compliance information current. Interest from a coach does not guarantee admission or a place on the team.",
    whoFor: [
      "Players already performing at high junior, prep, academy, or elite youth levels.",
      "Families prepared for admissions and NCAA compliance details.",
      "Players whose academic and hockey profiles both fit a target school.",
    ],
    entryPoints: [
      "Evaluation through junior, prep, academy, high school, or elite club play.",
      "Compliant coach communication.",
      "Camps, visits, video, and current coach references.",
    ],
    researchQuestions: [
      "Does the school fit academically and socially?",
      "What roster needs exist by graduation year and position?",
      "What communication rules apply right now?",
      "What financial and admissions realities should the family understand?",
    ],
    costLogistics: [
      "Tuition, scholarship/aid rules, admissions timing, visits, testing, transcripts, and NCAA compliance.",
      "Travel for camps and campus visits.",
      "Balancing hockey opportunity against degree and campus fit.",
    ],
    notableTeams: [
      {
        name: "Boston College",
        location: "Chestnut Hill, Massachusetts",
        url: "https://bceagles.com/sports/mens-ice-hockey",
        note: "NCAA D1 program example from Hockey East.",
      },
      {
        name: "University of Michigan",
        location: "Ann Arbor, Michigan",
        url: "https://mgoblue.com/sports/mens-ice-hockey",
        note: "Big Ten NCAA D1 program example.",
      },
      {
        name: "University of Denver",
        location: "Denver, Colorado",
        url: "https://denverpioneers.com/sports/mens-ice-hockey",
        note: "NCHC NCAA D1 program example.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "The player should want the school even if his hockey role changes.",
      },
      {
        type: "For coaches",
        body: "Have current video, a transcript, the season schedule, and coach references ready before contacting schools.",
      },
    ],
    sources: [
      { label: "NCAA D1 men's hockey", url: "https://www.ncaa.com/sports/icehockey-men/d1" },
      { label: "NCAA men's hockey stats", url: "https://www.ncaa.com/stats/icehockey-men/d1/current/team/178" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "ncaa-d3",
    name: "NCAA Division III Men's Hockey",
    shortName: "NCAA D3",
    type: "College",
    stageId: "college",
    geography: "United States",
    category: "Varsity college",
    summary:
      "Varsity college hockey where academics, admission, cost, and playing time all matter.",
    overview:
      "The level of NCAA Division III hockey varies by conference and school. Build the college list around academics first, then compare admission standards, financial aid, roster needs, and the coach's plans for the player.",
    whoFor: [
      "Players who want serious college hockey at a school they would choose on its own.",
      "Families comparing academic programs, campus culture, and hockey role.",
      "Players coming from junior, prep, academy, high school, or club paths.",
    ],
    entryPoints: [
      "Coach outreach with transcript, video, schedule, and references.",
      "Junior, prep, academy, or high school evaluation.",
      "Camps, admissions conversations, and campus visits.",
    ],
    researchQuestions: [
      "Is the player admissible and likely to thrive academically?",
      "What role does the coach see?",
      "What is the financial aid picture?",
      "What level is the program within its conference?",
    ],
    costLogistics: [
      "Tuition, aid, admissions deadlines, visits, applications, testing, and travel.",
      "No athletic scholarships at Division III; verify aid directly with each school.",
      "Academic workload and distance from home.",
    ],
    notableTeams: [
      {
        name: "Hobart College",
        location: "Geneva, New York",
        url: "https://hwsathletics.com/sports/mens-ice-hockey",
        note: "NCAA D3 program example for families studying strong varsity hockey and academics.",
      },
      {
        name: "Babson College",
        location: "Wellesley, Massachusetts",
        url: "https://babsonathletics.com/sports/mens-ice-hockey",
        note: "Northeast NCAA D3 program example.",
      },
      {
        name: "St. Norbert College",
        location: "De Pere, Wisconsin",
        url: "https://athletics.snc.edu/sports/mens-ice-hockey",
        note: "Midwest NCAA D3 program example.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Choose a school the player would still want if hockey became a smaller part of college life.",
      },
      {
        type: "For scouts",
        body: "Division III teams vary. Compare the conference, current roster, admission standards, and available role.",
      },
    ],
    sources: [
      { label: "NCAA D3 men's hockey", url: "https://www.ncaa.com/sports/icehockey-men/d3" },
      { label: "NCAA D3 championship bracket", url: "https://www.ncaa.com/brackets/icehockey-men/d3/2026" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "acha",
    name: "American Collegiate Hockey Association",
    shortName: "ACHA",
    type: "College",
    stageId: "college",
    geography: "United States",
    category: "College club hockey",
    summary:
      "College club hockey with several men's divisions and hundreds of teams.",
    overview:
      "ACHA hockey ranges from casual club teams to programs with serious schedules and strong competition. Choose the college first, then ask about tryouts, dues, travel, practice time, and who runs the team.",
    whoFor: [
      "Players who want college hockey as part of a broader school experience.",
      "Families comparing school fit ahead of varsity label.",
      "Players who may not fit NCAA varsity but still want competitive college hockey.",
    ],
    entryPoints: [
      "Admission to the school followed by team contact or tryout.",
      "Coach outreach before application or deposit.",
      "Club prospect skates or student involvement events.",
    ],
    researchQuestions: [
      "Which ACHA division does the team play in?",
      "How competitive are tryouts?",
      "What are dues, travel costs, and time demands?",
      "How does the team fit with academics and campus life?",
    ],
    costLogistics: [
      "Tuition, club dues, travel, equipment, team fees, and tryout costs.",
      "Academic workload and travel schedule.",
      "Whether students, coaches, or the school itself run and fund the team.",
    ],
    notableTeams: [
      {
        name: "Ohio University",
        location: "Athens, Ohio",
        url: "https://www.ohio.edu/recreation/sport-clubs/mens-ice-hockey",
        note: "ACHA men's program example.",
      },
      {
        name: "Florida Gulf Coast University",
        location: "Fort Myers, Florida",
        url: "https://fgcuicehockey.com/",
        note: "ACHA program often researched by club hockey families.",
      },
      {
        name: "Air Force Academy",
        location: "Colorado Springs, Colorado",
        url: "https://airforcehockey.com/",
        note: "ACHA men's division example from the official ACHA championship listings.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "ACHA can work very well when the school is right and the dues and travel are affordable.",
      },
      {
        type: "For coaches",
        body: "Some club teams require a major time commitment. Ask how often they practice, how far they travel, and how roster decisions are made.",
      },
    ],
    sources: [
      { label: "ACHA official site", url: "https://www.achahockey.org/" },
      { label: "ACHA teams and divisions", url: "https://www.achahockey.org/" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "u-sports",
    name: "U SPORTS Men's Hockey",
    shortName: "U SPORTS",
    type: "College",
    stageId: "college",
    geography: "Canada",
    category: "Canadian university hockey",
    summary:
      "Varsity university hockey at schools across Canada.",
    overview:
      "U SPORTS is Canada's varsity university hockey system. Start with the degree and admission requirements, then check eligibility, costs, distance from home, and how the player's junior experience affects his options.",
    whoFor: [
      "Players considering Canadian universities.",
      "Families comparing Canadian university hockey with NCAA, ACHA, CHL education packages, or Junior A paths.",
      "Players whose academic and hockey profiles fit a Canadian school.",
    ],
    entryPoints: [
      "University application and coach communication.",
      "Evaluation through junior, prep, academy, or top youth hockey.",
      "Visits, video, transcripts, and references.",
    ],
    researchQuestions: [
      "Is the player eligible for U SPORTS competition?",
      "Does the academic program fit?",
      "What role does the coach project?",
      "How do scholarships, aid, or education packages apply?",
    ],
    costLogistics: [
      "Tuition, housing, travel, admissions, eligibility paperwork, and academic fit.",
      "Provincial distance from home and family travel.",
      "Prior junior experience and eligibility context.",
    ],
    notableTeams: [
      {
        name: "UNB Reds",
        location: "Fredericton, New Brunswick",
        url: "https://vreds.ca/sports/mice/index",
        note: "U SPORTS program families commonly research.",
      },
      {
        name: "Alberta Golden Bears",
        location: "Edmonton, Alberta",
        url: "https://bearsandpandas.ca/sports/mens-ice-hockey",
        note: "Western Canadian university hockey program example.",
      },
      {
        name: "UQTR Patriotes",
        location: "Trois-Rivieres, Quebec",
        url: "https://www.uqtr.ca/sport/",
        note: "Quebec university hockey example.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Start with the university and degree. Then decide whether the hockey program adds what the player wants.",
      },
      {
        type: "For scouts",
        body: "Many U SPORTS players arrive after junior hockey, so age and experience can affect roster decisions.",
      },
    ],
    sources: [
      { label: "U SPORTS men's hockey", url: "https://en.usports.ca/sports/mice/index" },
      { label: "U SPORTS men's hockey news", url: "https://en.usports.ca/sports/mice/headlines-featured" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "ahl",
    name: "American Hockey League",
    shortName: "AHL",
    type: "Pro",
    stageId: "later-hockey",
    geography: "United States / Canada",
    category: "Primary NHL development league",
    summary:
      "The main professional development league directly below the NHL.",
    overview:
      "The AHL sits directly below the NHL. Players usually arrive through an NHL organization, an AHL contract, or after strong college, major junior, European, or ECHL play. It is background information for young families, not a youth planning target.",
    whoFor: [
      "Players already in professional contract conversations.",
      "Families learning how the highest professional leagues in North America are organized.",
      "Older players moving through NHL organization depth charts.",
    ],
    entryPoints: [
      "NHL contract assignment or AHL contract.",
      "Professional tryout or team invite.",
      "Movement after NCAA, CHL, Europe, ECHL, or other professional play.",
    ],
    researchQuestions: [
      "Is the player under NHL or AHL contract?",
      "What development role exists in the organization?",
      "How does two way assignment work?",
      "What jobs in hockey or outside it could follow?",
    ],
    costLogistics: [
      "Professional contract terms, relocation, taxes, insurance, agent guidance, and family logistics.",
      "Education or career planning beyond hockey.",
      "Health, training, and travel demands.",
    ],
    notableTeams: [
      {
        name: "Hershey Bears",
        location: "Hershey, Pennsylvania",
        url: "https://www.hersheybears.com/",
        note: "Long-running AHL organization.",
      },
      {
        name: "Toronto Marlies",
        location: "Toronto, Ontario",
        url: "https://www.marlies.ca/",
        note: "AHL affiliate example in Canada.",
      },
      {
        name: "Abbotsford Canucks",
        location: "Abbotsford, British Columbia",
        url: "https://abbotsford.canucks.com/",
        note: "Western Canadian AHL organization.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Young players do not need an AHL plan. It is enough to know where the league sits in professional hockey.",
      },
      {
        type: "For scouts",
        body: "At the AHL level, contract terms, organizational depth, and the available role drive the decision.",
      },
    ],
    sources: [
      { label: "AHL official site", url: "https://theahl.com/" },
      { label: "AHL FAQ", url: "https://theahl.com/faq" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "echl",
    name: "ECHL",
    shortName: "ECHL",
    type: "Pro",
    stageId: "later-hockey",
    geography: "United States / Canada",
    category: "AA professional hockey",
    summary:
      "A professional league below the AHL with teams in the United States and Canada.",
    overview:
      "The ECHL is a professional league below the AHL. Players may sign after college or major junior, arrive from another professional league, or be assigned by an affiliated organization. It is not something a youth family needs to plan around.",
    whoFor: [
      "Older players pursuing professional contracts.",
      "Families learning how minor pro hockey works.",
      "Players moving from college, junior, or lower pro into a contracted environment.",
    ],
    entryPoints: [
      "ECHL contract or tryout.",
      "Assignment from an organization affiliated with the AHL or NHL.",
      "A contract after college, the CHL, or another professional league.",
    ],
    researchQuestions: [
      "What contract and affiliate structure applies?",
      "How much is the player likely to play?",
      "How does the team connect with AHL or NHL affiliates?",
      "What is the career plan outside hockey?",
    ],
    costLogistics: [
      "Professional contract, relocation, taxes, insurance, housing, and agent guidance.",
      "Health, training, and travel demands.",
      "Career planning beyond hockey.",
    ],
    notableTeams: [
      {
        name: "Toledo Walleye",
        location: "Toledo, Ohio",
        url: "https://www.toledowalleye.com/",
        note: "ECHL organization families may see in minor pro research.",
      },
      {
        name: "Florida Everblades",
        location: "Estero, Florida",
        url: "https://www.floridaeverblades.com/",
        note: "Long-running ECHL club.",
      },
      {
        name: "Idaho Steelheads",
        location: "Boise, Idaho",
        url: "https://www.idahosteelheads.com/",
        note: "Western ECHL program example.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "Minor professional hockey is a job decision for an adult player, not a promise made during youth hockey.",
      },
      {
        type: "For scouts",
        body: "An ECHL contract can open another professional opportunity. Pay, housing, affiliates, and playing time all matter.",
      },
    ],
    sources: [
      { label: "ECHL official site", url: "https://echl.com/" },
      { label: "ECHL teams", url: "https://echl.com/teams" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "sphl",
    name: "SPHL",
    shortName: "SPHL",
    type: "Pro",
    stageId: "later-hockey",
    geography: "United States",
    category: "Independent minor pro",
    summary:
      "An independent professional league with teams in the South and Midwest.",
    overview:
      "The SPHL is an independent professional league for adult players. Some players arrive from college, junior, Europe, or another professional league. For younger families, this page simply explains one option that exists after school and junior hockey.",
    whoFor: [
      "Older players exploring professional hockey opportunities.",
      "Families learning the difference between college, junior, and minor pro outcomes.",
      "Players considering independent pro options.",
    ],
    entryPoints: [
      "Team tryouts or professional contract conversations.",
      "Movement from college, junior, ECHL, Europe, or other pro leagues.",
      "Agent contacts and opportunities.",
    ],
    researchQuestions: [
      "What does the contract actually provide?",
      "What is the team role?",
      "How does this option fit career and education plans?",
      "What are housing and relocation expectations?",
    ],
    costLogistics: [
      "Professional contract, housing, relocation, taxes, insurance, and offseason work.",
      "Agent and career planning.",
      "Health and travel demands.",
    ],
    notableTeams: [
      {
        name: "Birmingham Bulls",
        location: "Pelham, Alabama",
        url: "https://www.bullshockey.net/",
        note: "SPHL organization example.",
      },
      {
        name: "Huntsville Havoc",
        location: "Huntsville, Alabama",
        url: "https://www.huntsvillehavoc.com/",
        note: "Southern U.S. minor pro program.",
      },
      {
        name: "Peoria Rivermen",
        location: "Peoria, Illinois",
        url: "https://www.rivermen.net/",
        note: "Midwest SPHL program example.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "This is an adult career choice. Young players still need to keep school and life outside hockey in view.",
      },
      {
        type: "For scouts",
        body: "Teams at this level look at contracts, roster needs, health, and whether a player handles himself like a professional.",
      },
    ],
    sources: [
      { label: "SPHL official site", url: "https://www.thesphl.com/" },
      { label: "SPHL history", url: "https://www.thesphl.com/history" },
    ],
    lastReviewed: lastContentReviewDate,
  },
  {
    slug: "fphl",
    name: "Federal Prospects Hockey League",
    shortName: "FPHL",
    type: "Pro",
    stageId: "later-hockey",
    geography: "United States",
    category: "Single A minor pro",
    summary:
      "A lower minor professional league for adult players trying to continue in hockey.",
    overview:
      "The FPHL is a lower minor professional league. Players considering it need to look at the contract, housing, travel, health coverage, and work outside the season. It shows how many different levels exist under the better known professional leagues.",
    whoFor: [
      "Older players seeking professional opportunities.",
      "Families learning about the lower levels of professional hockey.",
      "Players comparing lower minor pro with career, school, or coaching paths.",
    ],
    entryPoints: [
      "Team tryouts and professional contract conversations.",
      "Agent contacts and opportunities.",
      "Movement from college, junior, or other pro leagues.",
    ],
    researchQuestions: [
      "What are the contract terms and housing details?",
      "How does this fit long term career plans?",
      "What role is available?",
      "What are the health, travel, and financial realities?",
    ],
    costLogistics: [
      "Contract, housing, relocation, taxes, insurance, and offseason work.",
      "Career planning outside hockey.",
      "Travel and health demands.",
    ],
    notableTeams: [
      {
        name: "Binghamton Black Bears",
        location: "Binghamton, New York",
        url: "https://www.binghamtonblackbears.com/",
        note: "FPHL organization example.",
      },
      {
        name: "Watertown Wolves",
        location: "Watertown, New York",
        url: "https://www.watertownwolves.net/",
        note: "New York FPHL club example.",
      },
      {
        name: "Port Huron Prowlers",
        location: "Port Huron, Michigan",
        url: "https://www.phprowlers.com/",
        note: "Michigan minor pro program in the FPHL footprint.",
      },
    ],
    perspectives: [
      {
        type: "For parents",
        body: "This league should not shape decisions for a player who is 14 or 15. It is simply one adult option much later on.",
      },
      {
        type: "For coaches",
        body: "Before signing, a player needs qualified advice about the contract, health coverage, taxes, and work after hockey.",
      },
    ],
    sources: [
      { label: "FPHL official site", url: "https://www.federalhockey.com/" },
      { label: "FPHL directory", url: "https://www.federalhockey.com/directory" },
    ],
    lastReviewed: lastContentReviewDate,
  },
];

export const oldProductRoutes = [
  "/admin",
  "/auth",
  "/login",
  "/signup",
  "/pricing",
  "/today",
  "/my-plan",
  "/targets",
  "/my-player",
  "/settings",
  "/setup-assist",
] as const;

export function getLeagueBySlug(slug: string) {
  return leagues.find((league) => league.slug === slug);
}

export function getLeaguesByStage(stageId: PathwayStageId) {
  return leagues.filter((league) => league.stageId === stageId);
}

export function getLeaguePath(league: Pick<League, "slug">) {
  return `/leagues/${league.slug}`;
}

export function formatReviewDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${monthNames[month - 1]} ${day}, ${year}`;
}
