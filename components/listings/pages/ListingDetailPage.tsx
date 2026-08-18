"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AdminTopBar, DetailHeader, type Crumb } from "@/components/shell";
import { InfoChip, ProfileInfoPanel } from "@/components/customers";
import { ComingSoon, EmptyState, RatingSummary, Skeleton, StatusBadge, UnderlineTabs } from "@/components/ui";
import { useListing } from "@/hooks/listings/useListingDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatDateLong, formatTime } from "@/lib/format";
import { toast } from "@/lib/toast";
import { ListingDetailsTab } from "../tabs/ListingDetailsTab";
import { ListingOrdersTab } from "../tabs/ListingOrdersTab";

const TABS = [
  { value: "details", label: "Details" },
  { value: "orders", label: "Orders" },
  { value: "activity", label: "Activity" },
  { value: "reviews", label: "Reviews" },
];

const MANAGE_OPTIONS = [
  { value: "unlist", label: "Unlist product" },
  { value: "feature", label: "Feature on home" },
  { value: "export", label: "Export details" },
];

export function ListingDetailPage({ listingId }: { listingId: string }) {
  const router = useRouter();
  const params = useListParams({ tab: "details" });
  const { data, isLoading, error } = useListing(listingId);

  const crumbs: Crumb[] = [
    { label: "Listings", href: "/listings" },
    { label: data?.product_id ?? listingId },
  ];

  if (error) {
    return (
      <>
        <AdminTopBar breadcrumb={crumbs} />
        <div className="flex-1 px-8 py-6">
          <EmptyState title="Couldn't load this product" description={error.message} />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar breadcrumb={crumbs} />

      <DetailHeader
        isLoading={isLoading}
        media={
          data && (
            <Image
              src={data.image_url}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-xl object-cover"
            />
          )
        }
        title={
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate font-inter font-medium text-xl leading-7 text-text-900">
              {data?.title}
            </h1>
            {data && <StatusBadge status={data.status} domain="listing" />}
          </div>
        }
        subtitle={
          <p className="mt-1 font-jost text-sm leading-5 text-text-500">
            ID: {data?.product_id}
            {data && (
              <>
                {" • "}
                Created on: {formatDateLong(data.created_at)} {formatTime(data.created_at)}
              </>
            )}
          </p>
        }
        hasPrev={Boolean(data?.prev_id)}
        hasNext={Boolean(data?.next_id)}
        onPrev={() => data?.prev_id && router.push(`/listings/${data.prev_id}`)}
        onNext={() => data?.next_id && router.push(`/listings/${data.next_id}`)}
        manageOptions={MANAGE_OPTIONS}
        onManage={(value) => {
          const option = MANAGE_OPTIONS.find((o) => o.value === value);
          toast.success(`${option?.label ?? value} isn't wired up yet`);
        }}
      />

      <div className="flex flex-1 flex-col gap-8 border-t border-stroke-soft px-8 py-6 lg:flex-row lg:gap-10">
        <div className="w-full shrink-0 lg:w-[330px] lg:border-r lg:border-stroke-soft lg:pr-8">
          <ProfileInfoPanel
            isLoading={isLoading}
            sections={[
              {
                title: "Store information",
                rows: [
                  { label: "Name", value: data?.store.name ?? "—" },
                  {
                    label: "Phone",
                    value: data && <InfoChip href={`tel:${data.store.phone}`}>{data.store.phone}</InfoChip>,
                  },
                  {
                    label: "Email",
                    value: data && (
                      <InfoChip href={`mailto:${data.store.email}`}>{data.store.email}</InfoChip>
                    ),
                  },
                  { label: "Address", value: data?.store.address ?? "—" },
                ],
              },
            ]}
          />

          <div className="mt-8">
            {isLoading || !data ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <RatingSummary rating={data.rating} title="Ratings" layout="stacked" />
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <UnderlineTabs tabs={TABS} value={params.tab} onChange={params.setTab} />

          {params.tab === "details" && <ListingDetailsTab detail={data} isLoading={isLoading} />}
          {params.tab === "orders" && <ListingOrdersTab listingId={listingId} />}
          {["activity", "reviews"].includes(params.tab) && (
            <ComingSoon
              title={TABS.find((t) => t.value === params.tab)?.label ?? "Coming soon"}
              description="This tab has no design yet — Details and Orders are the only ones specified."
            />
          )}
        </div>
      </div>
    </>
  );
}
