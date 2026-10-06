// Keep portfolio copy and the hand-picked misc lists in one place.
// Resume content and selected work samples live in the tree; only the Monkeytype bests are fetched.
interface WorkSample {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  fit?: "cover" | "contain";
  video?: string;
}

interface Experience {
  company: string;
  href: string;
  role: string;
  date: string;
  description: string;
  logo: string;
  stack?: string;
  details?: string;
  work?: WorkSample[];
}

export const experience = [
  {
    company: "Scott’s SAT Prep",
    href: "https://www.scottssatprep.com",
    role: "Founding Engineer",
    date: "Aug 2026–present",
    description:
      "Built 1500 Blueprint’s study planner, practice tools, and account management, and bolstered the platform’s security.",
    logo: "/portfolio/organizations/scotts-sat-prep.svg",
    work: [
      {
        src: "/portfolio/1500-blueprint/home.webp",
        alt: "1500 Blueprint dashboard: a sidebar with study plan, courses, question bank, drills, full-length tests and flashcards, a Max upgrade card, the current Desmos 101 course and quick links",
        caption: "1500 Blueprint dashboard",
        width: 1600,
        height: 928,
      },
    ],
  },
  {
    company: "General Learning (YC F24)",
    href: "https://www.generallearning.com",
    role: "Senior Software Engineer",
    date: "May 2025–Aug 2026",
    description:
      "Helped grow RevisionDojo from 250K to 750K+ users. Shipped the mobile app (20k+ downloads, 4.8 stars) and high-retention learning features.",
    logo: "/portfolio/organizations/general-learning.svg",
    work: [
      {
        src: "/portfolio/revisiondojo/mobile-tour-poster.webp",
        video: "/portfolio/revisiondojo/mobile-tour.mp4",
        alt: "Screen recording of the RevisionDojo iOS app: the subject home and study plan, the weekly planner, a Jojo AI quiz, achievements, lessons, notes with definitions, and flashcards",
        caption: "Mobile app",
        width: 720,
        height: 1566,
        fit: "contain",
      },
      {
        src: "/portfolio/revisiondojo/features-poster.webp",
        video: "/portfolio/revisiondojo/features.mp4",
        alt: "Screen recording scrolling through RevisionDojo’s features page, from the One toolkit for every part of the IB hero through the practice and learn tool lists",
        caption: "Features page",
        width: 1600,
        height: 922,
      },
      {
        src: "/portfolio/revisiondojo/coursework-studio.webp",
        alt: "RevisionDojo Coursework Studio for a Biology extended essay: setup details, the research question being refined with Jojo, a submitted progress checklist, a 25/34 grade and deadlines",
        caption: "Coursework Studio",
        width: 1600,
        height: 928,
      },
      {
        src: "/portfolio/revisiondojo/model-essay.webp",
        alt: "RevisionDojo Psychology model essay for a 22-mark Paper 2 question, highlighted by thesis, technique, evidence, analysis and signposting, with a tooltip explaining one technique highlight",
        caption: "Annotated model essays",
        width: 1600,
        height: 928,
      },
      {
        src: "/portfolio/revisiondojo/flashcards-poster.webp",
        video: "/portfolio/revisiondojo/flashcards.mp4",
        alt: "Screen recording of RevisionDojo flashcards: the My flashcards dashboard with memory strength and a review heatmap, then an image-occlusion Biology card rated with Again, Hard, Good and Easy beside a progress panel",
        caption: "Spaced-repetition flashcards",
        width: 1600,
        height: 928,
      },
      {
        src: "/portfolio/revisiondojo/literary-hub-poster.webp",
        video: "/portfolio/revisiondojo/literary-hub.mp4",
        alt: "Screen recording of RevisionDojo’s literary hub: picking A Doll’s House from a shelf of drama texts, reading its summary, then its study modules of lessons, videos, practice questions and flashcards",
        caption: "Literary hub",
        width: 1600,
        height: 922,
      },
      {
        src: "/portfolio/revisiondojo/universities.webp",
        alt: "RevisionDojo university profile with admissions data and a campus map",
        caption: "University discovery",
        width: 1128,
        height: 1432,
      },
      {
        src: "/portfolio/revisiondojo/vocab.webp",
        alt: "RevisionDojo vocabulary practice interface",
        caption: "Vocabulary practice",
        width: 1400,
        height: 834,
      },
      {
        src: "/portfolio/revisiondojo/friends.webp",
        alt: "RevisionDojo friends interface",
        caption: "Friends feature",
        width: 1400,
        height: 1264,
      },
      {
        src: "/portfolio/revisiondojo/changelog.webp",
        alt: "RevisionDojo’s What’s new changelog announcing the Mac app, with emoji reactions and a Suggest feature box",
        caption: "In-app changelog",
        width: 1200,
        height: 1323,
      },
      {
        src: "/portfolio/revisiondojo/help-center-poster.webp",
        video: "/portfolio/revisiondojo/help-center.mp4",
        alt: "Screen recording of RevisionDojo’s help center: topic cards, then expandable FAQs on plans and billing, coursework and marking, and teachers and schools",
        caption: "Help center",
        width: 1600,
        height: 922,
      },
    ],
  },
  {
    company: "Crest Compass Professional Resource Foundation",
    href: "https://cc-prf.com",
    role: "Lead Software Engineer",
    date: "May 2025–Jan 2026",
    description:
      "Led the migration from WordPress to Next.js. Built a custom CMS for blogs and an encrypted payments system.",
    logo: "/portfolio/organizations/ccprf.svg",
    work: [
      {
        src: "/portfolio/ccprf/home.webp",
        alt: "CCPRF home page: the Connecting Value, Empowering Growth hero beside a Unionville Festival photo carousel, over the foundation’s introduction",
        caption: "Home page",
        width: 1600,
        height: 929,
      },
      {
        src: "/portfolio/ccprf/events.webp",
        alt: "CCPRF Workshops & Events page with cards for a golf day, the Unionville Festival and a DJI drone training day",
        caption: "Blogs from the custom CMS",
        width: 1600,
        height: 928,
      },
      {
        src: "/portfolio/ccprf/event-post.webp",
        alt: "A CCPRF event post, Technological Leap: DJI Drone Experience & Training Day, with the article beside an event details card and a Become a Member prompt",
        caption: "Blog post",
        width: 1600,
        height: 929,
      },
    ],
  },
  {
    company: "Datacurve (YC W24)",
    href: "https://datacurve.ai",
    role: "Machine Learning Data Consultant",
    date: "Sep 2024–Apr 2025",
    description:
      "Reviewed coding problems for LLM training data and helped tighten evaluation quality.",
    logo: "/portfolio/organizations/datacurve.svg",
  },
] satisfies Experience[];

interface Project {
  name: string;
  /** The live site or package page the name links to; without one the name is plain text. */
  href?: string;
  /** Shown as a GitHub icon beside the name. */
  repo: string;
  /** Hackathon submission, shown as a Devpost icon beside the GitHub one. */
  devpost?: string;
  /** How to get it: a file to download, or a command to copy. */
  install?: { download: string; label: string; tooltip?: string } | { command: string };
  /** One line under the name, like a job title: what it is, plus any award. */
  tagline: string;
  date: string;
  /** One sentence. */
  description: string;
  /**
   * Languages, then frameworks, then libraries (styling last), then data, infrastructure and
   * models, each group following the language order. No version numbers, hosting-only services
   * or minor utilities.
   */
  stack: string;
  /** How it works, a few short bullets under "More". */
  details?: string[];
  work?: WorkSample[];
}

export const projects = [
  {
    name: "Beacon",
    repo: "https://github.com/owenguoo/htn26",
    devpost: "https://devpost.com/software/swarm-sight",
    tagline: "Multi-phone person search · Hack the North 2026 finalist",
    date: "Sep 2026",
    description:
      "Turns the phones in a crowded room into a camera network to find a missing person.",
    stack: "Swift, Python, JavaScript, SwiftUI, FastAPI, Expo, ARKit, Three.js, YOLOE",
    details: [
      "Searchers scan a QR code to join. A Swift app then streams each phone’s camera frames and ARKit position over WebSockets to a FastAPI hub.",
      "A Baseten GPU service spots people with YOLOE and matches them to reference photos with OSNet in about 127 ms.",
      "VGGT rebuilds the room in 3D from the phones’ frames, and the console guides searchers with a live heatmap, arrows, flashes and haptics.",
      "In simulation, a PPO policy rescued 47.6% more people than greedy search.",
    ],
    work: [
      {
        src: "/portfolio/beacon/join-search-poster.webp",
        video: "/portfolio/beacon/join-search.mp4",
        alt: "Screen recording of the Beacon iOS app opening to its join screen, with the hub link, a Scan the QR code button and Join search",
        caption: "Opening the Expo app to join a search",
        width: 720,
        height: 1566,
        fit: "contain",
      },
      {
        src: "/portfolio/beacon/phone-detection.webp",
        alt: "Beacon phone view mid-search: a heading strip pointing towards the stage, a Person 52% match box drawn around someone at a desk, two hazard boxes, and a minimap showing 1% searched",
        caption: "Using YOLOE and OSNet to detect people and threats",
        width: 1179,
        height: 2556,
        fit: "contain",
      },
      {
        src: "/portfolio/beacon/phone-sector.webp",
        alt: "Beacon phone screen saying At your sector, Check sighting, over the frame the phone captured, with the prompt Sweep it slowly, phone up",
        caption: "Using vector embeddings to confirm sighting",
        width: 1179,
        height: 2556,
        fit: "contain",
      },
      {
        src: "/portfolio/beacon/room-scan.webp",
        alt: "Beacon console’s 3D map showing the room reconstructed from phone frames, with a searcher placed inside it, a threats list and system details",
        caption: "Reconstructing room in 3D using VGGT-Ω",
        width: 1600,
        height: 889,
      },
      {
        src: "/portfolio/beacon/grid-search.webp",
        alt: "Beacon operator console during a search: the floor plan split into a lettered grid with 24 phones assigned to sectors, their planned paths, and a roster showing what each phone is doing",
        caption: "Search heatmap and sector divison",
        width: 1600,
        height: 919,
      },
      {
        src: "/portfolio/beacon/simulation.webp",
        alt: "Beacon simulation page comparing a Bayesian greedy search planner against a reinforcement-learning planner on a floor plan",
        caption: "Comparing greedy vs RL Neural Network search algorithms",
        width: 1600,
        height: 1000,
      },
    ],
  },
  {
    name: "Pulse",
    href: "https://pulse-kappa-green.vercel.app",
    repo: "https://github.com/dawsonxiong/pulse",
    tagline: "Developer news on every new tab",
    date: "Sep 2026",
    description:
      "A Chrome extension that replaces the new tab with a high-signal developer news feed. Think daily.dev but much cleaner.",
    stack: "TypeScript, Next.js, React, WXT, Tailwind, Prisma, Postgres, Redis",
    details: [
      "A daily Vercel cron job pulls about 40 RSS feeds from blogs and tech sites.",
      "Headlines that overlap within 48 hours are merged into one card per story.",
      "Stories are ranked by recency, your tags and how trusted the source is.",
    ],
    work: [
      {
        src: "/portfolio/pulse/feed-v3.webp",
        alt: "Pulse new-tab page showing a grid of developer news stories, each with a thumbnail, source icon, age, and vote and save buttons, beside a tag sidebar with For you / Latest, Filter and Search controls",
        caption: "New-tab feed",
        width: 1600,
        height: 1000,
      },
      {
        src: "/portfolio/pulse/story-thread-v2.webp",
        alt: "A Pulse story opened over the feed: title, source and age, Summary and Article tabs, a link to the original, the summary text, and a threaded comments section with a reply nested under the first comment, a display-name field and a comment box",
        caption: "Story summary with comments",
        width: 1600,
        height: 1000,
      },
      {
        src: "/portfolio/pulse/edit-tags-v2.webp",
        alt: "Pulse’s Edit tags page: languages, tools and topics as toggle chips, with TypeScript, Rust, Go, React, Next.js and Databases selected",
        caption: "Picking your tags",
        width: 1600,
        height: 1000,
      },
    ],
  },
  {
    name: "Thock",
    repo: "https://github.com/dawsonxiong/thock",
    install: { command: "go install github.com/dawsonxiong/thock@latest" },
    tagline: "Typing test for the terminal",
    date: "Aug 2026",
    description:
      "MonkeyType straight in the terminal, with blazing fast performance. Built using Go.",
    stack: "Go, Bubble Tea, Cobra",
    details: [
      "The whole app is one Bubble Tea model that runs every screen at 120 FPS.",
      "It uses Monkeytype’s scoring, so fixed typos still count against accuracy.",
      "Race rooms announce themselves on your network and show everyone’s cursor live. Each room’s two-word code also spells its address.",
      "Each keystroke and redraw takes about 4 µs, 2,000× under a 120 FPS frame.",
    ],
    work: [
      {
        src: "/portfolio/thock/start-tokyonight.webp",
        alt: "Thock start screen: the ASCII thock banner above the time and word-list options, with the first three lines of words waiting to be typed",
        caption: "Start screen",
        width: 1600,
        height: 1041,
      },
      {
        src: "/portfolio/thock/race-typing-tokyonight.webp",
        alt: "Thock mid-race: lanes for dawson, alex and wendy with pace trails, and alex's and wendy's cursors shown as coloured blocks inside the text",
        caption: "Multiplayer mode",
        width: 1600,
        height: 1041,
      },
      {
        src: "/portfolio/thock/race-results-tokyonight.webp",
        alt: "Thock race results after round two: places, wpm and finishing times for dawson, alex and wendy, each racer's pace on a shared clock, and a tally of wins",
        caption: "Race results after two rounds",
        width: 1600,
        height: 1041,
      },
      {
        src: "/portfolio/thock/typing-tokyonight.webp",
        alt: "Thock mid-test with typed words in white, a mistyped letter in red and upcoming words dimmed, live wpm in the corner",
        caption: "Mid-test",
        width: 1600,
        height: 1041,
      },
      {
        src: "/portfolio/thock/results-tokyonight.webp",
        alt: "Thock results after a real 30-second test: 116 wpm, 99% accuracy, a raw-wpm-per-second bar chart with the one mistake marked",
        caption: "Results after a 30s test",
        width: 1600,
        height: 1041,
      },
      {
        src: "/portfolio/thock/stats-tokyonight.webp",
        alt: "Thock stats screen over ten runs: best and average wpm, a run-history chart, accuracy and consistency sparklines, and a per-mode table",
        caption: "Stats across ten runs",
        width: 1600,
        height: 1041,
      },
    ],
  },
  {
    name: "Stem Player",
    href: "https://stemplayer.dawsonxiong.workers.dev",
    repo: "https://github.com/dawsonxiong/stemplayer",
    tagline: "Split any song into stems and mix them on a 3D device",
    date: "Mar–Aug 2026",
    description: "Use Kanye's Stem Player right in the browser. Splits any song into its stems.",
    stack:
      "TypeScript, Python, vinext, React Three Fiber, Web Audio, Cloudflare Workers, Modal, Demucs",
    details: [
      "Upload a song or paste a link. The file goes straight to Cloudflare R2, then a Modal GPU job splits it into four stems with Demucs.",
      "The stems come back through a webhook and play in sync with Web Audio. Drag the sliders on the 3D model to turn each one up or down.",
      "It also has echo, reverb and filter effects, a speed control and a mix recorder.",
    ],
    work: [
      {
        src: "/portfolio/stem-player/device.webp",
        alt: "Stem Player web app with a 3D render of the tan device, its four LED grooves lit, above an upload zone",
        caption: "The device, waiting for a track",
        width: 1600,
        height: 1000,
      },
    ],
  },
  {
    name: "ConvertKit",
    repo: "https://github.com/dawsonxiong/ConvertKit",
    install: {
      download:
        "https://github.com/dawsonxiong/ConvertKit/releases/latest/download/ConvertKit_aarch64.dmg",
      label: "Download for macOS",
      tooltip:
        "Apple Silicon. On first launch, choose Open Anyway in System Settings > Privacy & Security.",
    },
    tagline: "Local macOS file converter",
    date: "Mar–Sep 2026",
    description:
      "A performance-first Rust macOS app with 22 file tools, from video compression and Whisper transcription to PDF splitting.",
    stack: "Rust, TypeScript, Tauri, React, Tokio, Tailwind, FFmpeg, whisper.cpp",
    details: [
      "The React UI sends typed jobs to Rust over Tauri. Rust runs FFmpeg, ImageMagick, Pandoc or whisper.cpp and streams progress back.",
      "If only the container changes, like MP4 to MOV, ffprobe catches it and the file is repackaged instead of re-encoded, which is near-instant.",
      "Each Tokio job has its own cancellation token, so encodes stop cleanly.",
      "It handles 29 input formats and 202 conversions, all offline.",
    ],
    work: [
      {
        src: "/portfolio/convertkit/convert-live.webp",
        alt: "ConvertKit’s converter after a real run: an MP4 turned into a MOV, 72.5 MB to 9.1 MB, and a PNG turned into a JPEG, 2.1 MB to 247 KB",
        caption: "Converting a video and a photo",
        width: 1600,
        height: 1105,
      },
      {
        src: "/portfolio/convertkit/compress-result.webp",
        alt: "ConvertKit’s compress-video result: the MP4 went from 72.5 MB to 2.4 MB, 97% smaller",
        caption: "Compressed video, 97% smaller",
        width: 1600,
        height: 1105,
      },
      {
        src: "/portfolio/convertkit/extract-text.webp",
        alt: "ConvertKit’s extract-text tool after pulling 5.6 KB of text out of a math assignment PDF",
        caption: "Extract text from a PDF",
        width: 1600,
        height: 1105,
      },
      {
        src: "/portfolio/convertkit/dashboard.webp",
        alt: "ConvertKit dashboard with popular tools, Finder quick actions and today’s jobs in recent activity",
        caption: "Dashboard and recent activity",
        width: 1600,
        height: 1105,
      },
    ],
  },
  {
    name: "react-native-latex-renderer",
    href: "https://www.npmjs.com/package/@dawsonxiong/react-native-latex-renderer",
    repo: "https://github.com/dawsonxiong/react-native-LaTeX-renderer",
    tagline: "Native LaTeX rendering for React Native",
    date: "Mar 2026",
    description:
      "An npm package that renders LaTeX in React Native as a native SVG, with no WebView. Peak 143 weekly downloads.",
    stack: "TypeScript, React Native, MathJax, react-native-svg",
    details: [
      "MathJax turns LaTeX into SVG paths and react-native-svg draws them natively, so it works offline and renders instantly.",
      "Inline and display math mix with plain text, with a KaTeX WebView fallback.",
    ],
    work: [
      {
        src: "/portfolio/react-native-latex-renderer/mathview.webp",
        alt: "A React Native screen rendering mixed text and LaTeX equations natively with MathView",
        caption: "MathView example",
        width: 1200,
        height: 2609,
        fit: "contain",
      },
    ],
  },
  {
    name: "LinkedIt",
    repo: "https://github.com/dawsonxiong/LinkedIt",
    devpost: "https://devpost.com/software/linkedit",
    tagline: "Sponsor contact finder · Best Beginner Hack, GeeseHacks 2025",
    date: "Jan 2025",
    description: "Finds the right people to contact at a company for sponsorship.",
    stack: "Python, JavaScript, Flask, React, Selenium, Vite, Tailwind",
    details: [
      "Flask drives headless Chrome with Selenium to search LinkedIn.",
      "Matches come back as JSON and show up as profile cards in React.",
    ],
    work: [
      {
        src: "/portfolio/linkedit/home.webp",
        alt: "LinkedIt home page with an info panel and two phone mockups holding the company and position search form",
        caption: "Home page",
        width: 1600,
        height: 866,
      },
    ],
  },
  {
    name: "LaTeX.ly",
    repo: "https://github.com/dawsonxiong/LaTeX.ly",
    tagline: "Handwritten math to LaTeX",
    date: "Nov 2024–Apr 2025",
    description: "Turns a photo of a handwritten or printed equation into LaTeX.",
    stack: "Python, JavaScript, Flask, Next.js, PyTorch, OpenCV, Tailwind",
    details: [
      "OpenCV splits the photo into symbols, rejoining broken ones like = and i.",
      "An 81-class PyTorch CNN reads each 64×64 symbol, left to right, into LaTeX.",
      "I trained five versions of the model on 49k+ symbols: 24k rendered across 25 fonts and 25k handwritten from CROHME.",
      "A Flask API serves the model to a Next.js front end.",
    ],
    work: [
      {
        src: "/portfolio/latex-ly/result.webp",
        alt: "LaTeX.ly with an uploaded equation image, the generated LaTeX and a rendered preview",
        caption: "Generated LaTeX and preview",
        width: 1600,
        height: 1000,
      },
      {
        src: "/portfolio/latex-ly/contours.webp",
        alt: "The equation E(x) = μ + 6σ with a green contour box drawn around each detected symbol",
        caption: "Contour detection per symbol",
        width: 890,
        height: 158,
        fit: "contain",
      },
      {
        src: "/portfolio/latex-ly/home.webp",
        alt: "LaTeX.ly landing page with an upload card for equation images",
        caption: "Upload",
        width: 1600,
        height: 1000,
      },
    ],
  },
] satisfies Project[];

interface Track {
  title: string;
  /** Only when it credits someone beyond the album artist, so most rows stay one line. */
  artist?: string;
  /** m:ss */
  length?: string;
  /** Marks the track with a star in the number column. */
  favourite?: boolean;
}

interface Album {
  title: string;
  artist: string;
  cover: string;
  tracks: Track[];
}

// Hand-picked, in no particular order. Titles, credits and lengths as Apple Music lists them,
// minus credits that only reorder the album artists.
export const albums: Album[] = [
  {
    title: "9 months & 50 hours",
    artist: "Fred again.. & LATIN MAFIA",
    cover: "/portfolio/covers/9-months-50-hours.jpg",
    tracks: [
      { title: "Hey Hey", length: "2:05", favourite: true },
      { title: "Alvafro", length: "3:58", favourite: true },
      { title: "Bonita", length: "3:06" },
      { title: "benjy chord", length: "2:45" },
      {
        title: "Cmon (LATIN MAFIA & Fred edit)",
        artist: "Fred again.. & Brian Eno",
        length: "4:15",
      },
      {
        title: "Quiereme",
        artist: "LATIN MAFIA, Fred again.. & bby",
        length: "2:55",
        favourite: true,
      },
      {
        title: "casino143 (Rue De La Fortuna Remix)",
        artist: "IVOXYGEN, LATIN MAFIA & Fred again..",
        length: "2:59",
      },
      {
        title: "Film Scene Soundtrack",
        artist: "Fred again.., KatzPascale & LATIN MAFIA",
        length: "2:45",
      },
      { title: "Open Eye Signal (under the fabric)", artist: "Jon Hopkins", length: "4:01" },
      { title: "Piensas En Mi", length: "3:18", favourite: true },
      { title: "Halo", artist: "Fred again.., LATIN MAFIA & Lil Yachty", length: "3:03" },
      { title: "Te Estoy Correteando", length: "3:14", favourite: true },
      { title: "Mabe", artist: "Fred again.., LATIN MAFIA & Mabe Fratti", length: "4:54" },
      { title: "I wish it wasnt", length: "3:46", favourite: true },
    ],
  },
  {
    title: "Blonde",
    artist: "Frank Ocean",
    cover: "/portfolio/covers/blonde.jpg",
    tracks: [
      { title: "Nikes", length: "5:14", favourite: true },
      { title: "Ivy", length: "4:09", favourite: true },
      { title: "Pink + White", length: "3:05", favourite: true },
      { title: "Be Yourself", length: "1:27" },
      { title: "Solo", length: "4:17" },
      { title: "Skyline To", length: "3:05" },
      { title: "Self Control", length: "4:10", favourite: true },
      { title: "Good Guy", length: "1:07" },
      { title: "Nights", length: "5:07", favourite: true },
      { title: "Solo (Reprise)", length: "1:19" },
      { title: "Pretty Sweet", length: "2:38" },
      { title: "Facebook Story", length: "1:09" },
      { title: "Close to You", length: "1:26" },
      { title: "White Ferrari", length: "4:09", favourite: true },
      { title: "Seigfried", length: "5:35", favourite: true },
      { title: "Godspeed", length: "2:58" },
      { title: "Futura Free", length: "9:24", favourite: true },
    ],
  },
  {
    title: "Nothing Was the Same",
    artist: "Drake",
    cover: "/portfolio/covers/nothing-was-the-same.jpg",
    tracks: [
      { title: "Tuscan Leather", length: "6:06", favourite: true },
      { title: "Furthest Thing", length: "4:27", favourite: true },
      { title: "Started From the Bottom", length: "2:54" },
      { title: "Wu-Tang Forever", length: "3:38" },
      { title: "Own It", length: "4:12" },
      { title: "Worst Behavior", length: "4:31" },
      { title: "From Time (feat. Jhene Aiko)", length: "5:22", favourite: true },
      { title: "Hold On, We’re Going Home (feat. Majid Jordan)", length: "3:51", favourite: true },
      { title: "Connect", length: "4:56" },
      { title: "The Language", length: "3:44" },
      { title: "305 To My City (feat. Detail)", length: "4:16" },
      { title: "Too Much", length: "4:22" },
      { title: "Pound Cake / Paris Morton Music 2 (feat. JAŸ-Z)", length: "7:14", favourite: true },
      { title: "Come Thru", length: "3:57" },
      { title: "All Me (feat. 2 Chainz & Big Sean)", length: "4:32" },
    ],
  },
];

export const songs = [
  {
    title: "u + me = <3",
    artist: "Olivia Rodrigo",
    cover: "/portfolio/covers/u-me-3.jpg",
  },
  {
    title: "Every Breath You Take",
    artist: "The Police",
    cover: "/portfolio/covers/every-breath-you-take.jpg",
  },
  {
    title: "Devil in a New Dress",
    artist: "Kanye West",
    cover: "/portfolio/covers/devil-in-a-new-dress.jpg",
  },
];

export const pokerHand = {
  cards: [
    { rank: "J", suit: "♥", name: "Jack of hearts" },
    { rank: "10", suit: "♥", name: "Ten of hearts" },
  ],
} as const;
