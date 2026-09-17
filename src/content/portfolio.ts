// Keep portfolio copy and the hand-written activity log in one place.
// Experience dates are from the previous portfolio; no live data fetch is needed.
export const experience = [
  {
    company: "RevisionDojo",
    href: "https://revisiondojo.com",
    role: "Senior software engineer",
    date: "May 2025–present",
    description: "Building tools that bring AI into the classroom.",
    details: "University discovery, vocabulary practice, social features, and a mobile app.",
  },
  {
    company: "Canada China Public Relations Foundation",
    href: "https://cc-prf.com",
    role: "Software engineer",
    date: "May–Aug 2025",
    description: "Built the foundation’s website with Next.js and TypeScript.",
  },
  {
    company: "Datacurve",
    href: "https://shipd.ai",
    role: "AI reasoning specialist, Shipd",
    date: "Sep 2024–May 2025",
    description: "Labelled, analyzed, and reviewed data to train foundational models.",
  },
];

export const projects = [
  {
    name: "LaTeX.ly",
    href: "https://github.com/dawsonxiong/latex-ly",
    description:
      "From handwritten math to LaTeX. An OCR model trained to recognize mathematical symbols.",
    stack: "Python, PyTorch, OpenCV, Next.js",
    details:
      "Built a training set of more than 49,000 generated and handwritten symbol images, with a preprocessing pipeline for noisy handwriting.",
  },
  {
    name: "LinkedIt",
    href: "https://github.com/dawsonxiong/LinkedIt",
    description: "A shorter path from finding a potential sponsor to making a connection.",
    stack: "React, Flask, Selenium",
    details:
      "Search by two terms to find relevant LinkedIn profiles and contact details. Winner of Best Beginner Hack at GeeseHacks 2025.",
  },
  {
    name: "React Native LaTeX renderer",
    href: "https://github.com/dawsonxiong/react-native-LaTeX-renderer",
    description: "A lightweight, auto-resizing way to render math in React Native apps.",
    stack: "React Native, KaTeX",
  },
  {
    name: "This little pool",
    href: "#about",
    description: "A home for my work, with moving water and a duck that likes its personal space.",
    stack: "Next.js, TypeScript, WebGL",
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
