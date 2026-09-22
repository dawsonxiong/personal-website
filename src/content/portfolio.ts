// Keep portfolio copy and the hand-picked misc lists in one place.
// Resume content and selected work samples live in the tree; only the Monkeytype bests are fetched.
interface WorkSample {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  fit?: "cover" | "contain";
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
        caption: "Social features",
        width: 1400,
        height: 1264,
      },
      {
        src: "/portfolio/revisiondojo/mobile.webp",
        alt: "RevisionDojo mobile app home screen",
        caption: "Mobile app",
        width: 1206,
        height: 2622,
        fit: "contain",
      },
    ],
  },
  {
    company: "Crest Compass Professional Resource Foundation",
    href: "https://cc-prf.com",
    role: "Lead Frontend Software Engineer",
    date: "May 2025–Jan 2026",
    description:
      "Led the migration from WordPress to Next.js. Built a custom CMS for blogs and an encrypted payments system.",
    logo: "/portfolio/organizations/ccprf.svg",
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

export const projects = [
  {
    name: "Thock",
    href: "https://github.com/dawsonxiong/thock",
    description: "A terminal typing engine with real-time WPM and accuracy metrics.",
    stack: "Go, Bubble Tea, concurrency, TUI",
    details:
      "Replaced terminal buffer re-renders with raw I/O loops and goroutines, cutting p99 input latency from 35 ms to 0.6 ms.",
  },
  {
    name: "ConvertKit",
    href: "https://github.com/dawsonxiong/convertkit",
    description: "A multi-format converter for images, audio, and documents.",
    stack: "Rust, Tokio, FFmpeg, systems programming",
    details:
      "Built a bounded async worker pool over FFmpeg C bindings that processes batches in parallel, 3× faster than HandBrake.",
  },
  {
    name: "LaTeX.ly",
    href: "https://github.com/dawsonxiong/latex-ly",
    description: "A math OCR engine that turns handwritten and printed equations into LaTeX.",
    stack: "Python, PyTorch, OpenCV, Next.js, TypeScript",
    details:
      "Trained a PyTorch CNN on 25K+ equations, lifting character and syntax accuracy from 48% to 91% over Tesseract OCR.",
  },
  {
    name: "LinkedIt",
    href: "https://github.com/dawsonxiong/LinkedIt",
    description: "A sponsor discovery platform that finds and filters relevant company profiles.",
    stack: "Python, Selenium, Flask, React, Tailwind CSS",
    details:
      "Cached scraped profiles per session to avoid redundant page loads; awarded first place at GeeseHacks.",
  },
];

// Hand-picked, in no particular order.
export const albums = [
  {
    title: "9 Months & 50 Hours",
    artist: "Fred again.. & Latin Mafia",
    cover: "/portfolio/covers/9-months-50-hours.jpg",
  },
  {
    title: "Blonde",
    artist: "Frank Ocean",
    cover: "/portfolio/covers/blonde.jpg",
  },
  {
    title: "Nothing Was the Same",
    artist: "Drake",
    cover: "/portfolio/covers/nothing-was-the-same.jpg",
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
