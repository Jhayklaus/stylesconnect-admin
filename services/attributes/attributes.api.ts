import { apiClient } from "../client";
import { ApiError } from "../types";
import { MOCKS } from "../mock/config";
import { delay } from "../mock/transport";
import { MOCK_CATEGORIES } from "./attributes.mock";
import type {
  AttributeBody,
  AttributeListParams,
  AttributeResource,
  AttributeRow,
} from "./attributes.types";

/**
 * Reads are verified to come back unwrapped. Writes aren't exercised against
 * production data, so tolerate either form rather than guess.
 */
function unwrap<T>(body: T | { data: T }): T {
  return body && typeof body === "object" && "data" in body ? body.data : body;
}

/** GET /admin/:resource */
export async function fetchAttributes<R extends AttributeResource>(
  resource: R,
  params: AttributeListParams = {}
): Promise<AttributeRow[R][]> {
  if (MOCKS.attributes) {
    await delay(150);
    // Only categories have a consumer while fixtures are on.
    return (resource === "categories" ? MOCK_CATEGORIES : []) as AttributeRow[R][];
  }

  const { data } = await apiClient.get<AttributeRow[R][]>(`/admin/${resource}`, { params });
  return data;
}

/** GET /admin/:resource/:id — not available for categories. */
export async function fetchAttribute<R extends AttributeResource>(
  resource: R,
  id: number
): Promise<AttributeRow[R]> {
  if (MOCKS.attributes) {
    throw new ApiError({ message: "Not available while fixtures are on", status: 404 });
  }

  const { data } = await apiClient.get<AttributeRow[R]>(`/admin/${resource}/${id}`);
  return data;
}

/** POST /admin/:resource */
export async function createAttribute<R extends AttributeResource>(
  resource: R,
  body: AttributeBody[R]
): Promise<AttributeRow[R]> {
  const { data } = await apiClient.post<AttributeRow[R] | { data: AttributeRow[R] }>(
    `/admin/${resource}`,
    body
  );
  return unwrap(data);
}

/** PUT /admin/:resource/:id */
export async function updateAttribute<R extends AttributeResource>(
  resource: R,
  id: number,
  body: AttributeBody[R]
): Promise<AttributeRow[R]> {
  const { data } = await apiClient.put<AttributeRow[R] | { data: AttributeRow[R] }>(
    `/admin/${resource}/${id}`,
    body
  );
  return unwrap(data);
}

/** DELETE /admin/:resource/:id */
export async function deleteAttribute(resource: AttributeResource, id: number): Promise<void> {
  await apiClient.delete(`/admin/${resource}/${id}`);
}
