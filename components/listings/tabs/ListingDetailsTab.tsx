import Image from "next/image";
import { Skeleton, SpecChip, SpecTable } from "@/components/ui";
import { formatCount, formatNaira } from "@/lib/format";
import type { ListingDetail } from "@/services/listings";

export function ListingDetailsTab({
  detail,
  isLoading,
}: {
  detail: ListingDetail | undefined;
  isLoading?: boolean;
}) {
  if (isLoading || !detail) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className="font-inter font-medium text-base leading-6 text-text-900">Photos</h2>
        <ul className="flex flex-wrap gap-4">
          {detail.photos.map((src, i) => (
            <li key={`${detail.id}-photo-${i}`}>
              <Image
                src={src}
                alt={`${detail.title} photo ${i + 1}`}
                width={104}
                height={104}
                className="h-26 w-26 rounded-xl border border-stroke-soft object-cover"
              />
            </li>
          ))}
        </ul>
      </section>

      <SpecTable
        title="Title and description"
        rows={[
          { label: "Title", value: detail.title },
          // The frame labels this row with the fabric name; "Description" is
          // the evident intent given the cell holds the description copy.
          { label: "Description", value: detail.description },
        ]}
      />

      <SpecTable
        title="Inventory"
        rows={[
          { label: "Price", value: formatNaira(detail.unit_price) },
          {
            label: "Stock quantity",
            value:
              detail.stock_quantity === null ? (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-stroke-soft px-2.5 py-1 font-jost text-xs leading-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-warning-fg" aria-hidden />
                  Always available
                </span>
              ) : (
                formatCount(detail.stock_quantity)
              ),
          },
          { label: "Timeline", value: detail.timeline },
        ]}
      />

      <SpecTable
        title="Features"
        rows={[
          {
            label: "Colors",
            value: (
              <div className="flex flex-wrap gap-2">
                {detail.colors.map((color) => (
                  <SpecChip key={color}>{color}</SpecChip>
                ))}
              </div>
            ),
          },
          { label: "Category", value: detail.category },
          { label: "Type", value: detail.product_type },
          { label: "Audience", value: detail.audience },
          ...(detail.sleeve_type ? [{ label: "Sleeve", value: detail.sleeve_type }] : []),
          {
            label: "Sizes",
            value: (
              <div className="flex flex-col gap-3">
                {(
                  [
                    ["Adult", detail.sizes.adult],
                    ["Kids", detail.sizes.kids],
                  ] as const
                ).map(([group, sizes]) => (
                  <div key={group} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
                    <span className="w-16 shrink-0 text-text-500">{group}</span>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <SpecChip key={`${group}-${size}`}>{size}</SpecChip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
