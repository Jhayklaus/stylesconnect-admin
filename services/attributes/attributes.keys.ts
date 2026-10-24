import type { AttributeListParams, AttributeResource } from "./attributes.types";

export const attributeKeys = {
  all: ["attributes"] as const,
  resource: (resource: AttributeResource) => [...attributeKeys.all, resource] as const,
  list: (resource: AttributeResource, params: AttributeListParams = {}) =>
    [...attributeKeys.resource(resource), "list", params] as const,
  detail: (resource: AttributeResource, id: number) =>
    [...attributeKeys.resource(resource), "detail", id] as const,
};
