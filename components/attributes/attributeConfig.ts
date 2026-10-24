import type { Attribute, AttributeResource } from "@/services/attributes";

export interface AttributeTab {
  resource: AttributeResource;
  /** Tab label, plural. */
  label: string;
  /** Used in buttons and dialogs: "Add size", "Delete colour?". */
  singular: string;
}

/** Tab order follows the listing form: what it is, who it's for, then the details. */
export const ATTRIBUTE_TABS: AttributeTab[] = [
  { resource: "categories", label: "Categories", singular: "category" },
  { resource: "types", label: "Types", singular: "type" },
  { resource: "audiences", label: "Audiences", singular: "audience" },
  { resource: "colors", label: "Colors", singular: "color" },
  { resource: "sizes", label: "Sizes", singular: "size" },
  { resource: "sleeve-types", label: "Sleeve types", singular: "sleeve type" },
  { resource: "production-timelines", label: "Timelines", singular: "production timeline" },
];

export function attributeTab(resource: string): AttributeTab {
  return ATTRIBUTE_TABS.find((t) => t.resource === resource) ?? ATTRIBUTE_TABS[0];
}

/** Any row across the seven resources — only types and colors carry extras. */
export type AnyAttribute = Attribute & {
  category_id?: number;
  category?: Attribute;
  hex_code?: string;
};
