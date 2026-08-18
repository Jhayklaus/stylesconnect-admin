import type { ReactNode } from "react";

export interface Column<T> {
  id: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  /** Tailwind width class, e.g. "w-[220px]". Omit for auto. */
  width?: string;
  align?: "left" | "center" | "right";
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableSelection {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string;
  isLoading?: boolean;
  error?: Error | null;
  /** Skeleton row count while loading. */
  skeletonRows?: number;
  /** Rendered when there are no rows and nothing is loading. */
  empty?: ReactNode;
  /** Presence of this prop adds the leading checkbox column. */
  selection?: DataTableSelection;
  onRowClick?: (row: T) => void;
  /** Slot below the table — normally <TableFooter />. */
  footer?: ReactNode;
  className?: string;
}
