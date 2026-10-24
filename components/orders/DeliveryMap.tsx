"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

/** primary.base, in the 0xRRGGBB form the Static Maps API expects. */
const PIN_COLOR = "0x63322c";

function staticMapUrl(address: string, key: string): string {
  const params = new URLSearchParams({
    center: address,
    zoom: "15",
    // Max logical size is 640x640; scale=2 doubles the pixels for retina.
    size: "640x320",
    scale: "2",
    markers: `color:${PIN_COLOR}|${address}`,
    key,
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
}

/**
 * Static preview of the delivery address. Google geocodes the address itself,
 * so no lat/lng is needed. Falls back to a placeholder when there's no key or
 * address, or when Google refuses the request (key restriction, API disabled).
 */
export function DeliveryMap({ address }: { address: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!MAPS_KEY || !address || failed) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-stroke-soft bg-bg-soft px-4 py-6">
        <MapPin className="h-5 w-5 shrink-0 text-primary-base" aria-hidden />
        <span className="font-jost text-xs leading-4 text-text-500">Map preview unavailable</span>
      </div>
    );
  }

  return (
    // A plain <img>: next/image would proxy the URL — key included — through
    // the optimizer, and a static map gains nothing from resizing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={staticMapUrl(address, MAPS_KEY)}
      alt={`Map of ${address}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="aspect-[2/1] w-full rounded-xl border border-stroke-soft bg-bg-soft object-cover"
    />
  );
}
