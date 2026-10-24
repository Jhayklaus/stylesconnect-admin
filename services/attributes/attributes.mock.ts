import type { Attribute, AttributeResource, AttributeRow, Color, ProductType } from "./attributes.types";

const STAMP = "2026-10-16T19:08:26.000000Z";

function row(id: number, name: string): Attribute {
  return {
    id,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    created_at: STAMP,
    updated_at: STAMP,
  };
}

const CATEGORIES = [row(1, "Tops"), row(2, "Bottoms"), row(3, "Full body")];

const TYPES: ProductType[] = [
  [1, "Shirts", 0],
  [2, "T-shirts", 0],
  [3, "Coats or jacket", 0],
  [4, "Trousers", 1],
  [5, "Skirts", 1],
  [6, "Dresses", 2],
  [7, "Jumpsuits", 2],
].map(([id, name, cat]) => ({
  ...row(id as number, name as string),
  category_id: CATEGORIES[cat as number].id,
  category: CATEGORIES[cat as number],
}));

const COLORS: Color[] = [
  [1, "Black", "#000000"],
  [2, "White", "#FFFFFF"],
  [3, "Green", "#2E7D32"],
  [4, "Rust", "#B7410E"],
].map(([id, name, hex]) => ({ ...row(id as number, name as string), hex_code: hex as string }));

/**
 * Mirrors the seeded production taxonomies. Mutable so add / edit / delete
 * stick while fixtures are on.
 */
export const MOCK_ATTRIBUTES: { [R in AttributeResource]: AttributeRow[R][] } = {
  categories: CATEGORIES,
  types: TYPES,
  audiences: ["Men", "Women", "Unisex", "Kids"].map((n, i) => row(i + 1, n)),
  colors: COLORS,
  sizes: ["XS", "S", "M", "L", "XL"].map((n, i) => row(i + 1, n)),
  "sleeve-types": ["Short Sleeve", "Long Sleeve", "Sleeveless"].map((n, i) => row(i + 1, n)),
  "production-timelines": ["1-2 business days", "3-5 business days", "1-2 weeks"].map((n, i) =>
    row(i + 1, n)
  ),
};

/** Builds a stored row from a create/update body, resolving a type's category. */
export function mockAttributeRow(
  resource: AttributeResource,
  id: number,
  body: Record<string, unknown>
): AttributeRow[AttributeResource] {
  const base = { ...row(id, String(body.name)), updated_at: new Date().toISOString() };
  if (resource === "types") {
    const category = CATEGORIES.find((c) => c.id === body.category_id) ?? CATEGORIES[0];
    return { ...base, category_id: category.id, category };
  }
  if (resource === "colors") return { ...base, hex_code: String(body.hex_code) };
  return base;
}
