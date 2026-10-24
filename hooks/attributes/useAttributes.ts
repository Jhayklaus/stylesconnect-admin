import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  attributeKeys,
  createAttribute,
  deleteAttribute,
  fetchAttribute,
  fetchAttributes,
  updateAttribute,
  type AttributeBody,
  type AttributeListParams,
  type AttributeResource,
  type AttributeRow,
} from "@/services/attributes";
import { toast } from "@/lib/toast";
import type { ApiError } from "@/services/types";

export function useAttributes<R extends AttributeResource>(
  resource: R,
  params: AttributeListParams = {}
) {
  return useQuery<AttributeRow[R][], ApiError>({
    queryKey: attributeKeys.list(resource, params),
    queryFn: () => fetchAttributes(resource, params),
    // Taxonomies change rarely; don't refetch them on every screen visit.
    staleTime: 10 * 60 * 1000,
  });
}

export function useAttribute<R extends AttributeResource>(resource: R, id: number) {
  return useQuery<AttributeRow[R], ApiError>({
    queryKey: attributeKeys.detail(resource, id),
    queryFn: () => fetchAttribute(resource, id),
  });
}

export function useCreateAttribute<R extends AttributeResource>(resource: R) {
  const queryClient = useQueryClient();

  return useMutation<AttributeRow[R], ApiError, AttributeBody[R]>({
    mutationFn: (body) => createAttribute(resource, body),
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.resource(resource) });
      toast.success(`${row.name} added`);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateAttribute<R extends AttributeResource>(resource: R) {
  const queryClient = useQueryClient();

  return useMutation<AttributeRow[R], ApiError, { id: number; body: AttributeBody[R] }>({
    mutationFn: ({ id, body }) => updateAttribute(resource, id, body),
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.resource(resource) });
      toast.success(`${row.name} updated`);
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteAttribute(resource: AttributeResource) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: (id) => deleteAttribute(resource, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.resource(resource) });
      toast.success("Deleted");
    },
    onError: (error) => toast.error(error.message),
  });
}
