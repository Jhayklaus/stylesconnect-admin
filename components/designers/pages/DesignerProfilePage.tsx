"use client";

import { useRouter } from "next/navigation";
import { AdminTopBar, type Crumb } from "@/components/shell";
import { CustomerProfileHeader, InfoChip, ProfileInfoPanel } from "@/components/customers";
import { ComingSoon, EmptyState, UnderlineTabs } from "@/components/ui";
import { useDesigner } from "@/hooks/designers/useDesignerDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatCount, formatDateLong, formatTime } from "@/lib/format";
import { toast } from "@/lib/toast";
import { DesignerListingsTab } from "../tabs/DesignerListingsTab";
import { DesignerReviewsTab } from "../tabs/DesignerReviewsTab";
import { DesignerTransactionsTab } from "../tabs/DesignerTransactionsTab";

const CRUMBS: Crumb[] = [
  { label: "Dashboard", href: "/overview" },
  { label: "Designer", href: "/customers/designers" },
  { label: "Profile" },
];

// The profile frame labels the third tab "Documents" twice; the Transactions
// and Reviews frames both show "Refunds" in that slot, so this is the real set.
const TABS = [
  { value: "listing", label: "Listing" },
  { value: "transactions", label: "Transactions" },
  { value: "refunds", label: "Refunds" },
  { value: "activity", label: "Activity" },
  { value: "documents", label: "Documents" },
  { value: "reviews", label: "Reviews" },
];

const MANAGE_OPTIONS = [
  { value: "deactivate", label: "Deactivate account" },
  { value: "reset", label: "Send password reset" },
  { value: "export", label: "Export profile" },
];

function dateTime(iso: string | null | undefined): string {
  return iso ? `${formatDateLong(iso)} ${formatTime(iso)}` : "—";
}

export function DesignerProfilePage({ designerId }: { designerId: string }) {
  const router = useRouter();
  const params = useListParams({ tab: "listing" });
  const { data, isLoading, error } = useDesigner(designerId);

  if (error) {
    return (
      <>
        <AdminTopBar breadcrumb={CRUMBS} />
        <div className="flex-1 px-8 py-6">
          <EmptyState title="Couldn't load this designer" description={error.message} />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar breadcrumb={CRUMBS} />

      <CustomerProfileHeader
        name={data?.name}
        avatarUrl={data?.avatar_url}
        customerId={data?.customer_id}
        lastLoginAt={data?.last_login_at}
        isLoading={isLoading}
        hasPrev={Boolean(data?.prev_id)}
        hasNext={Boolean(data?.next_id)}
        onPrev={() => data?.prev_id && router.push(`/customers/designers/${data.prev_id}`)}
        onNext={() => data?.next_id && router.push(`/customers/designers/${data.next_id}`)}
        manageOptions={MANAGE_OPTIONS}
        onManage={(value) => {
          const option = MANAGE_OPTIONS.find((o) => o.value === value);
          toast.success(`${option?.label ?? value} isn't wired up yet`);
        }}
      />

      <div className="flex flex-1 flex-col gap-8 border-t border-stroke-soft px-8 py-6 lg:flex-row lg:gap-10">
        <ProfileInfoPanel
          isLoading={isLoading}
          className="w-full shrink-0 lg:w-[330px] lg:border-r lg:border-stroke-soft lg:pr-8"
          sections={[
            {
              title: "Personal information",
              rows: [
                { label: "Country", value: data?.country ?? "—" },
                { label: "Joined", value: dateTime(data?.joined_at) },
                { label: "Date of birth", value: dateTime(data?.date_of_birth) },
                { label: "Gender", value: data?.gender ?? "—" },
              ],
            },
            {
              title: "Contact details",
              rows: [
                {
                  label: "Email",
                  value: data && <InfoChip href={`mailto:${data.email}`}>{data.email}</InfoChip>,
                },
                {
                  label: "Phone",
                  value: data && <InfoChip href={`tel:${data.phone}`}>{data.phone}</InfoChip>,
                },
                { label: "Address", value: data?.address ?? "—" },
              ],
            },
            {
              // The design repeats the Personal information rows here — a
              // copy-paste in the frame. A review summary is the evident intent.
              title: "Reviews",
              rows: [
                { label: "Rating", value: data ? `${data.rating.average} / 5` : "—" },
                { label: "Reviews", value: data ? formatCount(data.rating.total) : "—" },
              ],
            },
          ]}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <UnderlineTabs tabs={TABS} value={params.tab} onChange={params.setTab} />

          {params.tab === "listing" && (
            <DesignerListingsTab designerId={designerId} detail={data} isLoading={isLoading} />
          )}
          {params.tab === "transactions" && <DesignerTransactionsTab designerId={designerId} />}
          {params.tab === "reviews" && (
            <DesignerReviewsTab designerId={designerId} detail={data} isLoading={isLoading} />
          )}
          {["refunds", "activity", "documents"].includes(params.tab) && (
            <ComingSoon
              title={TABS.find((t) => t.value === params.tab)?.label ?? "Coming soon"}
              description="This tab has no design yet — Listing, Transactions and Reviews are the only ones specified."
            />
          )}
        </div>
      </div>
    </>
  );
}
