/**
 * The design's y-axis ticks are 0 / 100k / 500k / 1m / 10m / 100m / 500m —
 * evenly spaced but at wildly unequal ratios (5x, 2x, 10x, 10x, 5x). That's
 * neither linear nor logarithmic; it's a hand-placed Figma axis.
 *
 * Rather than approximate it, we plot values in "band space" (a piecewise
 * linear interpolation between those breakpoints) on a plain linear axis, then
 * label the integer ticks. Reproduces the mockup exactly and keeps the
 * transform in one pure, reversible place.
 *
 * Note for the designer: an axis with even spacing at uneven ratios visually
 * exaggerates small values. A true log axis would be more honest and is a
 * one-line change here.
 */
export const BANDS = [0, 100_000, 500_000, 1_000_000, 10_000_000, 100_000_000, 500_000_000];

export const BAND_LABELS = ["0", "100k", "500k", "1m", "10m", "100m", "500m"];

export const BAND_TICKS = BANDS.map((_, i) => i);

/** Naira → band-space position (0 … BANDS.length - 1). */
export function toBand(value: number): number {
  if (value <= BANDS[0]) return 0;
  for (let i = 1; i < BANDS.length; i++) {
    if (value <= BANDS[i]) {
      const span = BANDS[i] - BANDS[i - 1];
      return i - 1 + (value - BANDS[i - 1]) / span;
    }
  }
  return BANDS.length - 1;
}

/** Band-space position → naira. */
export function fromBand(position: number): number {
  const clamped = Math.min(Math.max(0, position), BANDS.length - 1);
  const lower = Math.floor(clamped);
  const upper = Math.min(lower + 1, BANDS.length - 1);
  const frac = clamped - lower;
  return Math.round(BANDS[lower] + (BANDS[upper] - BANDS[lower]) * frac);
}
