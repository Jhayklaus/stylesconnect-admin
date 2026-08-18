import Link from "next/link";

/** Circular deep-brown monogram + wordmark, as in every design frame. */
export function BrandMark() {
  return (
    <Link href="/overview" className="flex items-center gap-3 px-3.5 py-1">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-base">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/StyleConnect_Monogram_Symbol_White.svg"
          alt=""
          aria-hidden
          className="h-5 w-auto"
        />
      </span>
      <span className="font-inter font-medium text-lg leading-7 text-text-900">
        StyleConnect
      </span>
    </Link>
  );
}
