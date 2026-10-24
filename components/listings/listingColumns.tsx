import { Star } from "lucide-react";
import { StatusBadge, type Column } from "@/components/ui";
import { formatCount, formatDateShort, formatNaira } from "@/lib/format";
import type { Listing } from "@/services/listings";

export const listingColumns: Column<Listing>[] = [
  {
    id: "title",
    header: "Product name",
    width: "w-[300px]",
    cell: (row) => (
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={row.image_url}
          alt=""
          aria-hidden
          className="h-11 w-11 shrink-0 rounded-lg object-cover"
        />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-text-900">{row.title}</span>
            {row.is_featured && (
              <Star
                className="h-3.5 w-3.5 shrink-0 fill-primary-base text-primary-base"
                aria-label="Featured on home"
              />
            )}
          </span>
          <span className="block truncate text-xs leading-4 text-text-500">{row.category}</span>
        </span>
      </div>
    ),
  },
  { id: "product_id", header: "Product ID", cell: (row) => row.product_id },
  {
    id: "stock",
    header: "Stock",
    cell: (row) => (row.in_stock ? "In stock" : "Out of stock"),
  },
  { id: "total_sold", header: "Total sold", cell: (row) => formatCount(row.total_sold) },
  { id: "unit_price", header: "Unit price", cell: (row) => formatNaira(row.unit_price) },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} domain="listing" />,
  },
  { id: "created_at", header: "Created on", cell: (row) => formatDateShort(row.created_at) },
];
