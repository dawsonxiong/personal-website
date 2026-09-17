const FAST_FRAME_MS = 1000 / 60;
const SLOW_FRAME_MS = 1000 / 30;
const MIN_QUALITY = 0.45;
const TIMING_EPSILON_MS = 0.01;

export function createFrameClock() {
  let previousCallback: number | null = null;
  let previousDraw = 0;
  let remainder = 0;
  let targetFrameMs = FAST_FRAME_MS;
  let quality = 1;
  let stopped = false;
  let samples = 0;
  let intervals: number[] = [];
  let cadence = SLOW_FRAME_MS;

  const sample = (interval: number) => {
    samples++;
    intervals.push(interval);
    if (intervals.length < 45) return;
    intervals.sort((a, b) => a - b);
    const median = intervals[intervals.length >> 1];
    intervals = [];

    // Observe every callback, including frames we choose not to draw. A steady
    // 30 Hz browser cadence alone cannot tell us whether the GPU is overloaded.
    cadence = Math.min(cadence, median);
    if (samples <= 90 || median <= Math.max(cadence, targetFrameMs) + 6) return;

    // Only reduce quality, avoiding repeated resolution changes while reading.
    if (quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality * 0.78);
    } else if (targetFrameMs === FAST_FRAME_MS) {
      targetFrameMs = SLOW_FRAME_MS;
    } else if (median > 70) {
      stopped = true;
    }
  };

  return {
    get quality() {
      return quality;
    },
    get stopped() {
      return stopped;
    },
    next(now: number): number | null {
      if (stopped) return null;
      if (previousCallback === null) {
        previousCallback = now;
        previousDraw = now;
        return 0;
      }

      const interval = now - previousCallback;
      previousCallback = now;
      sample(interval);
      if (stopped) return null;

      remainder += interval;
      if (remainder + TIMING_EPSILON_MS < targetFrameMs) return null;
      // Keep the partial interval so refresh rates that do not divide 60 evenly
      // still reach the cap. Discard whole missed frames instead of catching up.
      remainder = Math.max(
        0,
        remainder - Math.floor((remainder + TIMING_EPSILON_MS) / targetFrameMs) * targetFrameMs,
      );
      const delta = Math.min((now - previousDraw) / 1000, 0.05);
      previousDraw = now;
      return delta;
    },
    reset() {
      previousCallback = null;
      remainder = 0;
      intervals = [];
      samples = 0;
      cadence = SLOW_FRAME_MS;
      stopped = false;
    },
  };
}
