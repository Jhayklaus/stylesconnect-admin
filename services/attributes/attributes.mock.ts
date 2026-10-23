import type { Attribute } from "./attributes.types";

const STAMP = "2026-10-16T19:08:26.000000Z";

function row(id: number, name: string): Attribute {
  return { id, name, slug: name.toLowerCase().replace(/\s+/g, "-"), created_at: STAMP, updated_at: STAMP };
}

/** Matches the seeded production categories so the Listings filter reads the same. */
export const MOCK_CATEGORIES: Attribute[] = [row(1, "Tops"), row(2, "Bottoms"), row(3, "Full body")];
