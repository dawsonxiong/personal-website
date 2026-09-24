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
  /** Where the name links: the live site or package page when there is one, else the repo. */
  href: string;
  /** Shown as a GitHub icon beside the name. */
  repo: string;
  /** One line under the name, like a job title: what it is, plus any award. */
  tagline: string;
  date: string;
  /** One sentence. */
  description: string;
  stack: string;
  /** How it works, a few short bullets under "A little more". */
  details?: string[];
  work?: WorkSample[];
}

export const projects = [
  {
    name: "Beacon",
    href: "https://github.com/owenguoo/htn26",
    repo: "https://github.com/owenguoo/htn26",
    tagline: "Multi-phone person search · Hack the North 2026 finalist",
    date: "Sep 2026",
    description:
      "Turns the phones in a crowded room into a camera network to find a missing person.",
    stack:
      "Swift 6, ARKit, SwiftUI, Expo, Python, FastAPI, WebSockets, YOLOE, OSNet, Baseten, OpenAI, Cloudflare Tunnel",
    details: [
      "Phones scan a QR code, calibrate on printed markers, and stream frames plus ARKit pose to a FastAPI hub.",
      "A YOLOE and OSNet re-ID service on a Baseten GPU matches each frame to the reference photos in about 127 ms.",
      "The console maps every phone and a likelihood heatmap, then cues searchers with arrows, flashes and haptics.",
      "I built the iOS client (413 tests, ARKit confined to one file) and most of the console.",
    ],
    work: [
      {
        src: "/portfolio/beacon/join-search-poster.webp",
        video: "/portfolio/beacon/join-search.mp4",
        alt: "Screen recording of the Beacon iOS app opening to its join screen, with the hub link, a Scan the QR code button and Join search",
        caption: "Opening the Expo app",
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
    stack:
      "Next.js, React, TypeScript, Prisma, Supabase Postgres, Upstash Redis, WXT, Chrome Manifest V3, Tailwind, Vercel",
    details: [
      "A daily cron pulls about 40 RSS feeds and clusters duplicate coverage by title similarity in a 48-hour window.",
      "The feed API ranks stories by recency, tag match and source authority. Titles are never rewritten.",
      "Tags, votes and the reading list live in chrome.storage.",
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
        caption: "Story summary with a comment thread",
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
    href: "/",
    repo: "https://github.com/dawsonxiong/personal-website",
    tagline: "This site",
    date: "Sep 2026",
    description:
      "My portfolio, set over an interactive pool. Drop in floaties and they drift, bob and bump into each other.",
    stack: "Next.js 16, React 19, TypeScript, WebGL2, Tailwind v4, shadcn/ui, Base UI, Vercel",
    details: [
      "A WebGL2 fragment shader draws the water, caustics and floor shadows, and scales its buffer to hold the frame rate.",
      "A small custom solver steps the floaties at 1/120 s with damped bounces and steers them around the content.",
      "The misc tab pulls my Monkeytype personal bests from its public API, cached for an hour.",
    ],
    work: [
      {
        src: "/portfolio/personal-website/home.webp",
        alt: "The about page: a frosted card introducing Dawson over a blue WebGL pool, with a rubber duck floating above it",
        caption: "About page",
        width: 1600,
        height: 1000,
      },
    ],
  },
  {
    name: "Thock",
    href: "https://github.com/dawsonxiong/thock",
    repo: "https://github.com/dawsonxiong/thock",
    tagline: "Typing test for the terminal",
    date: "Aug 2026",
    description:
      "MonkeyType straight in the terminal, with blazing fast performance. Built using Go.",
    stack: "Go, Bubble Tea v2, Lip Gloss, Cobra",
    details: [
      "One Bubble Tea model drives the test, results and stats screens at 120 FPS.",
      "Every run is appended to a JSONL log that feeds the per-second chart and the trend sparklines.",
      "A keystroke through update and render takes about 4 µs, 2,000× inside the frame budget.",
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
    href: "https://github.com/dawsonxiong/stemplayer",
    repo: "https://github.com/dawsonxiong/stemplayer",
    tagline: "Split any song into stems and mix them on a 3D device",
    date: "Mar–Aug 2026",
    description: "Use Kanye's Stem Player right in the browser. Splits any song into its stems.",
    stack:
      "React Router 7, Cloudflare Workers, R2, Workers KV, Modal, Demucs, Three.js, React Three Fiber, Web Audio, Zustand",
    details: [
      "Uploads go straight to Cloudflare R2; a Modal GPU runs Demucs and posts four stems back through a webhook.",
      "A Web Audio graph plays the stems in sync; dragging the LED grooves on the model sets each level.",
      "Echo and gate effects, a mix recorder, keyboard shortcuts and three colourways.",
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
    href: "https://github.com/dawsonxiong/ConvertKit",
    repo: "https://github.com/dawsonxiong/ConvertKit",
    tagline: "Local macOS file converter",
    date: "Mar–Sep 2026",
    description:
      "A performance-first Rust macOS app with 22 file tools, from video compression and Whisper transcription to PDF splitting.",
    stack:
      "Rust, Tauri 2, Tokio, React, TypeScript, Vite, Zustand, Tailwind, FFmpeg, whisper.cpp, Hugging Face",
    details: [
      "React builds a typed job and checks which engines are installed over Tauri IPC before anything runs.",
      "Rust hands each job to FFmpeg, ImageMagick, Pandoc or whisper.cpp and streams progress back as events.",
      "Container-only conversions skip re-encoding: ffprobe checks the codecs, then the file is remuxed instantly.",
      "29 input formats, 202 valid conversions, about 470 tests.",
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
      "MathView converts LaTeX to SVG paths with MathJax and draws them with react-native-svg, offline and instantly.",
      "Inline and display math mix with plain text in one string; the KaTeX WebView mode stays as an option.",
      "A fork of iAmAdheil’s renderer, extended with the native SVG mode.",
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
    stack:
      "Next.js, React, TypeScript, Prisma Postgres, Auth.js, Google OAuth, Recharts, Tailwind, shadcn/ui, Vercel",
    details: [
      "Log a mood from 0 to 10 with tags and a note; sharing is one-directional and per person.",
      "Google sign-in through Auth.js with database sessions in Prisma.",
      "A token-authenticated endpoint lets an iOS Shortcut log a mood without opening the app.",
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
    href: "https://github.com/dawsonxiong/LinkedIt",
    repo: "https://github.com/dawsonxiong/LinkedIt",
    tagline: "Sponsor contact finder · Best Beginner Hack, GeeseHacks 2025",
    date: "Jan 2025",
    description: "Finds the right people to contact at a company for sponsorship.",
    stack: "Python, Selenium, Flask, React, Vite, Tailwind",
    details: [
      "Type a company and a role; a Flask endpoint drives headless Chrome through a LinkedIn people search.",
      "Hits are filtered by role and company and returned as JSON to a React front end of profile cards.",
      "I wrote the scraper and API; my teammates built the front end.",
    ],
    work: [
      {
        src: "/portfolio/linkedit/home.webp",
        alt: "LinkedIt home page with an info panel and two phone mockups holding the company and position search form",
        caption: "Home",
        width: 1600,
        height: 866,
      },
    ],
  },
  {
    name: "LaTeX.ly",
    href: "https://github.com/dawsonxiong/LaTeX.ly",
    repo: "https://github.com/dawsonxiong/LaTeX.ly",
    tagline: "Handwritten math to LaTeX",
    date: "Nov 2024–Apr 2025",
    description: "Turns a photo of a handwritten or printed equation into LaTeX.",
    stack: "Python, PyTorch, OpenCV, Flask, Next.js, Tailwind",
    details: [
      "OpenCV cleans the image, finds each symbol’s contour and re-merges split glyphs like = and i.",
      "Each crop is normalised to 64×64 and classified by a PyTorch CNN, then assembled into LaTeX left to right.",
      "Five model versions trained on 49k+ symbol images: 24k generated across 25 fonts, 25k handwritten from CROHME.",
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
  /** Only when the credit differs from the album artist, like Apple Music's track list. */
  artist?: string;
  /** m:ss */
  length?: string;
  /** Shows a star beside the track. */
  favourite?: boolean;
}

interface Album {
  title: string;
  artist: string;
  cover: string;
  tracks: Track[];
}

// Hand-picked, in no particular order.
export const albums: Album[] = [
  {
    title: "9 Months & 50 Hours",
    artist: "Fred again.. & Latin Mafia",
    cover: "/portfolio/covers/9-months-50-hours.jpg",
    tracks: [
      { title: "Hey Hey", length: "2:05" },
      { title: "Alvafro", artist: "LATIN MAFIA & Fred again..", length: "3:58" },
      { title: "Bonita" },
      { title: "benjy chord" },
      { title: "Cmon (LATIN MAFIA & Fred edit)", artist: "Fred again.. & Brian Eno" },
      { title: "Quiereme", artist: "LATIN MAFIA, Fred again.. & bby" },
      {
        title: "casino143 (Rue De La Fortuna Remix)",
        artist: "IVOXYGEN, LATIN MAFIA & Fred again..",
      },
      { title: "Film Scene Soundtrack", artist: "Fred again.., KatzPascale & LATIN MAFIA" },
      { title: "Open Eye Signal (under the fabric)", artist: "Jon Hopkins" },
      { title: "Piensas En Mi" },
      { title: "Halo", artist: "Fred again.., LATIN MAFIA & Lil Yachty" },
      { title: "Te Estoy Correteando", artist: "LATIN MAFIA & Fred again.." },
      { title: "Mabe", artist: "Fred again.., LATIN MAFIA & Mabe Fratti" },
      { title: "I wish it wasnt" },
    ],
  },
  {
    title: "Blonde",
    artist: "Frank Ocean",
    cover: "/portfolio/covers/blonde.jpg",
    tracks: [
      { title: "Nikes", length: "5:14" },
      { title: "Ivy", length: "4:09" },
      { title: "Pink + White", length: "3:04" },
      { title: "Be Yourself", length: "1:26" },
      { title: "Solo", length: "4:17" },
      { title: "Skyline To", length: "3:04" },
      { title: "Self Control", length: "4:09" },
      { title: "Good Guy", length: "1:06" },
      { title: "Nights", length: "5:07" },
      { title: "Solo (Reprise)", length: "1:18" },
      { title: "Pretty Sweet", length: "2:38" },
      { title: "Facebook Story", length: "1:08" },
      { title: "Close to You", length: "1:25" },
      { title: "White Ferrari", length: "4:08" },
      { title: "Seigfried", length: "5:34" },
      { title: "Godspeed", length: "2:57" },
      { title: "Futura Free", length: "9:24" },
    ],
  },
  {
    title: "Nothing Was the Same",
    artist: "Drake",
    cover: "/portfolio/covers/nothing-was-the-same.jpg",
    tracks: [
      { title: "Tuscan Leather", length: "6:06" },
      { title: "Furthest Thing", length: "4:27" },
      { title: "Started from the Bottom", length: "2:54" },
      { title: "Wu-Tang Forever", length: "3:38" },
      { title: "Own It", length: "4:11" },
      { title: "Worst Behavior", length: "4:30" },
      { title: "From Time", artist: "Drake & Jhené Aiko", length: "5:22" },
      { title: "Hold On, We’re Going Home", artist: "Drake & Majid Jordan", length: "3:48" },
      { title: "Connect", length: "5:11" },
      { title: "The Language", length: "3:44" },
      { title: "305 to My City", artist: "Drake & Detail", length: "4:16" },
      { title: "Too Much", length: "4:22" },
      { title: "Pound Cake / Paris Morton Music 2", artist: "Drake & JAY-Z", length: "7:13" },
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
