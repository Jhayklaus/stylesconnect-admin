/**
 * GET /api/maps/static?address=… — a Google Static Maps image of one address.
 *
 * Fetched server-side so GOOGLE_PLACES_API_KEY never reaches the browser. The
 * image is fixed (size, zoom, pin) and only the address is taken from the
 * caller, so the route can't be used to request arbitrary Maps API calls.
 */

/** primary.base, in the 0xRRGGBB form the Static Maps API expects. */
const PIN_COLOR = "0x63322c";

export async function GET(request: Request) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return new Response("Maps not configured", { status: 404 });

  // An <img> on our own pages sends same-origin; anything else is someone
  // spending our Maps quota from their own site.
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return new Response("Forbidden", { status: 403 });

  const address = new URL(request.url).searchParams.get("address")?.trim();
  if (!address || address.length > 300) {
    return new Response("Missing or invalid address", { status: 400 });
  }

  const params = new URLSearchParams({
    center: address,
    zoom: "15",
    // Max logical size is 640x640; scale=2 doubles the pixels for retina.
    size: "640x320",
    scale: "2",
    markers: `color:${PIN_COLOR}|${address}`,
    key,
  });

  const upstream = await fetch(`https://maps.googleapis.com/maps/api/staticmap?${params}`);
  if (!upstream.ok || !upstream.body) {
    return new Response("Map unavailable", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/png",
      // Addresses don't move; let the browser reuse the image for a day.
      "Cache-Control": "private, max-age=86400",
    },
  });
}
