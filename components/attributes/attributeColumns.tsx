import { Pencil, Trash2 } from "lucide-react";
import { ActionMenu, type Column } from "@/components/ui";
import { formatDateShort } from "@/lib/format";
import type { AttributeResource } from "@/services/attributes";
import type { AnyAttribute } from "./attributeConfig";

export type AttributeAction = "edit" | "delete";

export function attributeColumns(
  resource: AttributeResource,
  onAction: (action: AttributeAction, row: AnyAttribute) => void
): Column<AnyAttribute>[] {
  const columns: Column<AnyAttribute>[] = [
    {
      id: "name",
      header: "Name",
      width: "w-[280px]",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.hex_code && (
            <span
              aria-hidden
              className="h-6 w-6 shrink-0 rounded-md border border-stroke-soft"
              style={{ backgroundColor: row.hex_code }}
            />
          )}
          <span className="truncate text-text-900">{row.name}</span>
        </div>
      ),
    },
    { id: "slug", header: "Slug", cell: (row) => <span className="text-text-500">{row.slug}</span> },
  ];

  if (resource === "types") {
    columns.push({ id: "category", header: "Category", cell: (row) => row.category?.name ?? "—" });
  }
  if (resource === "colors") {
    columns.push({
      id: "hex_code",
      header: "Hex",
      cell: (row) => <span className="font-mono text-xs uppercase">{row.hex_code}</span>,
    });
  }

  columns.push(
    { id: "updated_at", header: "Last updated", cell: (row) => formatDateShort(row.updated_at) },
    {
      id: "actions",
      header: "",
      width: "w-[64px]",
      align: "right",
      cell: (row) => (
        <ActionMenu
          label={`Actions for ${row.name}`}
          onSelect={(value) => onAction(value as AttributeAction, row)}
          items={[
            { value: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" aria-hidden /> },
            {
              value: "delete",
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" aria-hidden />,
              danger: true,
            },
          ]}
        />
      ),
    }
  );

  return columns;
}
