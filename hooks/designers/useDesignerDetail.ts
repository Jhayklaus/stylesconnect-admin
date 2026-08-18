import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  designerKeys,
  fetchDesigner,
  fetchDesignerListings,
  fetchDesignerReviews,
  fetchDesignerTransactions,
  type DesignerDetail,
  type DesignerReviewItem,
  type DesignerSubListParams,
  type DesignerTransaction,
} from "@/services/designers";
import type { Listing } from "@/services/listings";
import type { ApiError, Paginated } from "@/services/types";

export function useDesigner(id: string) {
  return useQuery<DesignerDetail, ApiError>({
    queryKey: designerKeys.detail(id),
    queryFn: () => fetchDesigner(id),
  });
}

export function useDesignerListings(id: string, params: DesignerSubListParams) {
  return useQuery<Paginated<Listing>, ApiError>({
    queryKey: designerKeys.listings(id, params),
    queryFn: () => fetchDesignerListings(id, params),
    placeholderData: keepPreviousData,
  });
}

export function useDesignerTransactions(id: string, params: DesignerSubListParams) {
  return useQuery<Paginated<DesignerTransaction>, ApiError>({
    queryKey: designerKeys.transactions(id, params),
    queryFn: () => fetchDesignerTransactions(id, params),
    placeholderData: keepPreviousData,
  });
}

export function useDesignerReviews(id: string, params: DesignerSubListParams) {
  return useQuery<Paginated<DesignerReviewItem>, ApiError>({
    queryKey: designerKeys.reviews(id, params),
    queryFn: () => fetchDesignerReviews(id, params),
    placeholderData: keepPreviousData,
  });
}
