// Monkeytype personal bests from the public profile endpoint (no key needed).
// Cached for an hour; falls back to the last known numbers if the fetch fails.
const PROFILE_URL = "https://api.monkeytype.com/users/dawsonxiong/profile";
export const MONKEYTYPE_PROFILE = "https://monkeytype.com/profile/dawsonxiong";

export interface PersonalBest {
  label: string;
  wpm: number;
  // Share of the all-time English leaderboard, e.g. 2.76 for "top 2.76%".
  topPercent?: number;
}

interface RawBest {
  wpm: number;
}

type RawBests = Partial<Record<"time" | "words", Record<string, RawBest[]>>>;

type RawLeaderboards = Partial<
  Record<"time", Record<string, { english?: { rank: number; count: number } }>>
>;

const modes = [
  { mode: "time", length: "15", label: "15 seconds" },
  { mode: "time", length: "30", label: "30 seconds" },
  { mode: "time", length: "60", label: "60 seconds" },
] as const;

const fallback: PersonalBest[] = [
  { label: "15 seconds", wpm: 166, topPercent: 2.76 },
  { label: "30 seconds", wpm: 152 },
  { label: "60 seconds", wpm: 141, topPercent: 2.32 },
];

export async function getPersonalBests(): Promise<PersonalBest[]> {
  try {
    const res = await fetch(PROFILE_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return fallback;
    const json = (await res.json()) as {
      data?: { personalBests?: RawBests; allTimeLbs?: RawLeaderboards };
    };
    const bests = json.data?.personalBests;
    const leaderboards = json.data?.allTimeLbs;
    if (!bests) return fallback;

    const result = modes.flatMap(({ mode, length, label }) => {
      const entries = bests[mode]?.[length] ?? [];
      if (entries.length === 0) return [];
      const best = entries.reduce((a, b) => (b.wpm > a.wpm ? b : a));
      const lb = leaderboards?.[mode]?.[length]?.english;
      const topPercent = lb && lb.count > 0 ? (lb.rank / lb.count) * 100 : undefined;
      return [{ label, wpm: Math.round(best.wpm), topPercent }];
    });
    return result.length > 0 ? result : fallback;
  } catch {
    return fallback;
  }
}
