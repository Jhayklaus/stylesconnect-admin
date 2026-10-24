/**
 * The listing taxonomies designers pick from. Unlike every other admin
 * resource these are plain Eloquent rows: numeric ids, and responses come back
 * unwrapped (raw arrays / raw objects, no `{ data, meta }` envelope).
 */
export type AttributeResource =
  | "categories"
  | "types"
  | "audiences"
  | "colors"
  | "sizes"
  | "sleeve-types"
  | "production-timelines";

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

/** A garment type ("Shirts") always belongs to one category ("Tops"). */
export interface ProductType extends Attribute {
  category_id: number;
  category: Attribute;
}

export interface Color extends Attribute {
  hex_code: string;
}

/** Row shape per resource. */
export interface AttributeRow {
  categories: Attribute;
  types: ProductType;
  audiences: Attribute;
  colors: Color;
  sizes: Attribute;
  "sleeve-types": Attribute;
  "production-timelines": Attribute;
}

/** Create/update body per resource. */
export interface AttributeBody {
  categories: { name: string };
  types: { name: string; category_id: number };
  audiences: { name: string };
  colors: { name: string; hex_code: string };
  sizes: { name: string };
  "sleeve-types": { name: string };
  "production-timelines": { name: string };
}

export interface AttributeListParams {
  /** types only — narrows to one category, by slug. */
  category?: string;
}
