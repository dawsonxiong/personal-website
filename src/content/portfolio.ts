// Keep portfolio copy and the hand-written activity log in one place.
// Resume content and selected work samples live in the tree; no live data fetch is needed.
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
  logoAlt: string;
  stack?: string;
  details?: string;
  work?: WorkSample[];
}

export const experience = [
  {
    company: "Scott's SAT Prep",
    href: "https://www.scottssatprep.com",
    role: "Founding Software Engineer",
    date: "Aug 2026–present",
    description:
      "Built 1500 Blueprint's study planner, practive tools, and account management, and performed a security audit.",
    logo: "/portfolio/organizations/scotts-sat-prep.svg",
    logoAlt: "Scott's SAT Prep logo",
  },
  {
    company: "General Learning (YC F24)",
    href: "https://www.generallearning.com",
    role: "Founding Engineer",
    date: "May 2025–Aug 2026",
    description:
      "Helped grow RevisionDojo from 250K to 750K+ users. Shipped the mobile app and high-retention learning features.",
    logo: "/portfolio/organizations/general-learning.svg",
    logoAlt: "General Learning logo",
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
    description: "Led the migration from WordPress to Next.js. Built a custom CMS for blogs and an encrypted payments system.",
    logo: "/portfolio/organizations/ccprf.svg",
    logoAlt: "CCPRF logo",
  },
  {
    company: "Datacurve (YC W24)",
    href: "https://datacurve.ai",
    role: "Machine Learning Data Consultant",
    date: "Sep 2024–Apr 2025",
    description:
      "Reviewed coding problems for LLM training data and helped tighten evaluation quality.",
    logo: "/portfolio/organizations/datacurve.svg",
    logoAlt: "Datacurve logo",
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

// Newest first. Add actual updates here, including small works in progress.
export const activity = [
  {
    date: "2026-09-16",
    label: "Sep 16, 2026",
    text: "Turning my personal site into a swimming pool. You’re in it.",
    href: "#about",
  },
];
