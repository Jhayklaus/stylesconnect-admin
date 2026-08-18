/**
 * Shared fixture vocabulary. Everything here is deterministic so screenshots
 * and manual QA stay stable between reloads.
 */
export const PEOPLE = [
  "Juliet Igokwe", "Akinwale James", "Chidinma Okafor", "Tunde Bakare",
  "Amara Nwosu", "Joel Mbakwe", "Sandra Abdullahi", "Chibuike Okoronkwo",
  "Janet Baruwa", "Christabel Akinwale", "Femi Adeyemi", "Ngozi Eze",
  "Bola Salami", "Ifeoma Chukwu", "Segun Oyelaran", "Halima Yusuf",
  "Emeka Obi", "Yetunde Alabi", "Musa Danjuma", "Blessing Etim",
  "Kelechi Nnamdi", "Aisha Bello", "Uche Nwachukwu", "Damilola Sowande",
  "Grace Adeleke", "Ibrahim Lawal", "Tobi Ogunleye", "Zainab Musa",
  "Nkechi Uzo", "Peter Adeniyi", "Fatima Sani", "Chinedu Obiora",
  "Ronke Ajayi", "Samuel Idris", "Oluchi Nwankwo", "Bisi Fashola",
  "Hauwa Garba", "Kunle Balogun", "Adaeze Mbah", "Yusuf Aliyu",
  "Temitope Aluko", "Chiamaka Duru", "Ismail Bature",
];

export function emailFor(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`;
}

/**
 * Deterministic pseudo-random in [0,1) from a string seed — keeps fixture
 * numbers varied but stable.
 */
export function seeded(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // FNV-1a alone leaves near-identical seeds ("txn-1", "txn-2") clustered,
  // which made fixture columns look like a sequence. Avalanche the result.
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function pick<T>(items: T[], seed: string): T {
  return items[Math.floor(seeded(seed) * items.length) % items.length];
}

export function intBetween(min: number, max: number, seed: string): number {
  return min + Math.floor(seeded(seed) * (max - min + 1));
}

export function productImage(index: number): string {
  return `/mock/product-${(index % 4) + 1}.svg`;
}

/** ISO date `daysAgo` before a fixed anchor, so fixtures never drift. */
const ANCHOR = new Date("2026-08-12T11:00:00Z").getTime();
export function daysAgo(days: number): string {
  return new Date(ANCHOR - days * 86_400_000).toISOString();
}
