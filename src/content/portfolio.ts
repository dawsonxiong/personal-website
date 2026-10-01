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
    role: "Founding Software Engineer",
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
  install?: { download: string; label: string; note?: string } | { command: string };
  /** One line under the name, like a job title: what it is, plus any award. */
  tagline: string;
  date: string;
  /** One sentence. */
  description: string;
  /** Languages first, then the frameworks and libraries that define it; no hosting or minor utilities. */
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
    stack: "Swift, Python, JavaScript, SwiftUI, ARKit, Expo, FastAPI, Three.js, YOLOE",
    details: [
      "Searchers join by scanning a QR code and calibrate by pointing at a printed marker. Their phones then stream camera frames and ARKit position to a FastAPI hub.",
      "A GPU service on Baseten uses YOLOE to spot people in each frame and OSNet to compare them with the reference photos. A match comes back in about 127 ms.",
      "The operator’s console shows every phone on a map, with a heatmap of where the person likely is. It guides searchers with arrows, screen flashes and haptics.",
      "I built the iOS client and most of the console.",
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
    stack: "TypeScript, Next.js, React, WXT, Prisma, Supabase Postgres, Upstash Redis, Tailwind",
    details: [
      "Once a day, a cron job pulls about 40 RSS feeds. Stories with similar titles published within 48 hours of each other are merged into one card.",
      "The feed ranks stories by how recent they are, how well they match your tags and how trusted the source is. Headlines are never rewritten.",
      "Your tags, votes and reading list are saved in chrome.storage, so you don’t need an account.",
    ],
    work: [
      {
        src: "/portfolio/pulse/feed-v2.webp",
        alt: "Pulse new-tab page showing a grid of developer news stories with source icon, age, vote and save buttons, a tag sidebar, and For you / Latest, Filter and Search controls",
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
    name: "Personal website",
    href: "https://dawsonxiong.com",
    repo: "https://github.com/dawsonxiong/personal-website",
    tagline: "This site",
    date: "Sep 2026",
    description:
      "My portfolio, set over an interactive pool. Drop in floaties and they drift, bob and bump into each other.",
    stack: "TypeScript, GLSL, Next.js 16, React 19, WebGL2, Tailwind v4, shadcn/ui",
    details: [
      "A WebGL2 shader draws the water, the caustics and the shadows on the pool floor. If the frame rate drops, it renders at a lower resolution to keep up.",
      "The floaties run on a small custom physics solver. It steps every 1/120 s, softens their bounces and steers them around the page content.",
      "The misc tab shows my Monkeytype personal bests, pulled from Monkeytype’s public API and cached for an hour.",
    ],
    work: [
      {
        src: "/portfolio/personal-website/home-v2.webp",
        alt: "The about page: a frosted card introducing Dawson over a blue WebGL pool, with a rubber duck floating above it",
        caption: "About page",
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
    stack: "Go, Bubble Tea v2, Cobra",
    details: [
      "The whole app is one Bubble Tea model, Go’s terminal UI framework. It runs the test, results, stats and LAN race screens and redraws at 120 FPS.",
      "Every run is added as a line to a JSONL log. That log feeds the per-second chart and the trend sparklines.",
      "Handling a keystroke and rebuilding the screen takes about 4 µs, roughly 2,000× faster than a 120 FPS frame allows.",
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
      "TypeScript, Python, vinext, Cloudflare Workers, React Three Fiber, Web Audio, Modal, Demucs",
    details: [
      "Drop in a song or paste a YouTube link. Uploads go straight to Cloudflare R2, then a Modal GPU job splits the track into four stems with Demucs.",
      "The stems come back through a webhook and play in sync through Web Audio. Drag along the LED grooves on the 3D device to turn each one up or down.",
      "There are also echo, reverb and filter effects, a speed control, a mix recorder, keyboard shortcuts and three colourways.",
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
      note: "Apple Silicon. It isn’t notarized, so on first launch choose Open Anyway in System Settings › Privacy & Security.",
    },
    tagline: "Local macOS file converter",
    date: "Mar–Sep 2026",
    description:
      "A performance-first Rust macOS app with 22 file tools, from video compression and Whisper transcription to PDF splitting.",
    stack: "Rust, TypeScript, Tauri 2, Tokio, React, Tailwind, FFmpeg, whisper.cpp",
    details: [
      "The React UI builds a typed job, then asks the Rust backend whether the tools it needs are installed. A missing one is flagged before anything runs.",
      "Rust hands the job to FFmpeg, ImageMagick, Pandoc or whisper.cpp and streams progress back to the UI as it goes.",
      "If only the container changes, like MP4 to MOV with the same codecs, ffprobe spots it. The file is repackaged instead of re-encoded, which is near-instant.",
      "It handles 29 input formats and 202 valid conversions.",
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
      "An npm package that renders LaTeX in React Native as native SVG, with no WebView.",
    stack: "TypeScript, React Native, MathJax, react-native-svg",
    details: [
      "MathView turns LaTeX into SVG paths with MathJax and draws them with react-native-svg. It works offline and renders instantly.",
      "Inline and display math can sit alongside plain text in one string. The KaTeX WebView mode is still there as an option.",
      "It started as a fork of iAmAdheil’s renderer, which I extended with the native SVG mode.",
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
    name: "how do you feel?",
    href: "https://how-do-you-feel.vercel.app",
    repo: "https://github.com/dawsonxiong/how-do-you-feel",
    tagline: "A mood tracker you can share",
    date: "Sep–Oct 2025",
    description:
      "A daily mood tracker where friends who share their history show up as extra lines on your chart.",
    stack: "TypeScript, Next.js, React, Prisma Postgres, Auth.js, Recharts, Tailwind, shadcn/ui",
    details: [
      "Log your mood from 0 to 10 with tags and a note. Sharing goes one way and is set per person, so you choose exactly who sees your history.",
      "You sign in with Google through Auth.js, and sessions are stored in the database with Prisma.",
      "An iOS Shortcut can log a mood without opening the app. It calls an endpoint that checks a personal API token.",
    ],
    work: [
      {
        src: "/portfolio/how-do-you-feel/home.webp",
        alt: "how do you feel? home screen: a mood form set to 8/10, happy, with tags and a note, beside a history chart plotting six weeks of moods for You, Dawson and Alex",
        caption: "Mood logging and history",
        width: 1600,
        height: 913,
      },
      {
        src: "/portfolio/how-do-you-feel/connections.webp",
        alt: "Connections dialog: an exact-email search finding Wendy with an add button, and connections Dawson, sharing both ways, and Alex, who shares their mood with you",
        caption: "Sharing moods with friends",
        width: 1200,
        height: 1316,
      },
      // {
      //   src: "/portfolio/how-do-you-feel/mobile-setup.webp",
      //   alt: "Shortcuts and homescreen setup dialog with steps for adding the app to the home screen and building an iOS Shortcut around the submit URL",
      //   caption: "iOS Shortcuts setup",
      //   width: 1200,
      //   height: 1590,
      // },
      {
        src: "/portfolio/how-do-you-feel/dark.webp",
        alt: "The same home screen in dark mode, with the mood form and the three-person history chart",
        caption: "Dark mode",
        width: 1600,
        height: 913,
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
    stack: "Python, JavaScript, Flask, Selenium, React, Vite, Tailwind",
    details: [
      "Type in a company and a role. A Flask endpoint then drives a headless Chrome browser through a LinkedIn people search.",
      "It keeps only the people whose role matches both, then sends them back as JSON for the React front end to show as profile cards.",
      "I wrote the scraper and the API, and my teammates built the front end.",
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
    stack: "Python, JavaScript, PyTorch, OpenCV, Flask, Next.js, Tailwind",
    details: [
      "OpenCV cleans up the image and finds the outline of each symbol. Symbols that come apart into pieces, like = and i, get merged back together.",
      "Each symbol is cropped, resized to 64×64 and classified by a PyTorch CNN. The results are read left to right and assembled into LaTeX.",
      "I trained five versions of the model on 49k+ symbol images: 24k generated across 25 fonts and 25k handwritten ones from CROHME.",
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
