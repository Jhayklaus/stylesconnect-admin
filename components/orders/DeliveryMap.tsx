"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Static preview of the delivery address, served by /api/maps/static so the
 * Google key stays on the server. Falls back to a placeholder when there's no
 * address or the route can't produce an image (no key configured, Google
 * refused the request).
 */
export function DeliveryMap({ address }: { address: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!address || failed) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-stroke-soft bg-bg-soft px-4 py-6">
        <MapPin className="h-5 w-5 shrink-0 text-primary-base" aria-hidden />
        <span className="font-jost text-xs leading-4 text-text-500">Map preview unavailable</span>
      </div>
    );
  }

  return (
    // A plain <img>: the route already returns a sized image, and next/image
    // would only add a second hop through the optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/maps/static?${new URLSearchParams({ address })}`}
      alt={`Map of ${address}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="aspect-[2/1] w-full rounded-xl border border-stroke-soft bg-bg-soft object-cover"
    />
  );
}
