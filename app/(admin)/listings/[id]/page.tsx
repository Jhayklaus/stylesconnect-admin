import { Suspense } from "react";
import { ListingDetailPage } from "@/components/listings/pages/ListingDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense>
      <ListingDetailPage listingId={id} />
    </Suspense>
  );
}
