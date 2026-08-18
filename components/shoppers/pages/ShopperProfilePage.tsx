"use client";

import { useRouter } from "next/navigation";
import { AdminTopBar, type Crumb } from "@/components/shell";
import { CustomerProfileHeader, InfoChip, ProfileInfoPanel } from "@/components/customers";
import { ComingSoon, EmptyState, UnderlineTabs } from "@/components/ui";
import { useShopper } from "@/hooks/shoppers/useShopperDetail";
import { useListParams } from "@/hooks/useListParams";
import { formatDateLong, formatTime } from "@/lib/format";
import { toast } from "@/lib/toast";
import { ShopperActivityTab } from "../tabs/ShopperActivityTab";
import { ShopperOrdersTab } from "../tabs/ShopperOrdersTab";

const CRUMBS: Crumb[] = [
  { label: "Dashboard", href: "/overview" },
  { label: "Shoppers", href: "/customers/shoppers" },
  { label: "Profile" },
];

const TABS = [
  { value: "orders", label: "Orders" },
  { value: "activity", label: "Activity" },
  { value: "documents", label: "Documents" },
  { value: "tickets", label: "Tickets" },
];

const MANAGE_OPTIONS = [
  { value: "deactivate", label: "Deactivate account" },
  { value: "reset", label: "Send password reset" },
  { value: "export", label: "Export profile" },
];

function dateTime(iso: string | undefined): string {
  return iso ? `${formatDateLong(iso)} ${formatTime(iso)}` : "—";
}

export function ShopperProfilePage({ shopperId }: { shopperId: string }) {
  const router = useRouter();
  const params = useListParams({ tab: "orders" });
  const { data, isLoading, error } = useShopper(shopperId);

  if (error) {
    return (
      <>
        <AdminTopBar breadcrumb={CRUMBS} />
        <div className="flex-1 px-8 py-6">
          <EmptyState title="Couldn't load this shopper" description={error.message} />
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
        onPrev={() => data?.prev_id && router.push(`/customers/shoppers/${data.prev_id}`)}
        onNext={() => data?.next_id && router.push(`/customers/shoppers/${data.next_id}`)}
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
                { label: "Joined", value: dateTime(data?.last_order_at) },
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
          ]}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <UnderlineTabs tabs={TABS} value={params.tab} onChange={params.setTab} />

          {params.tab === "orders" && (
            <ShopperOrdersTab shopperId={shopperId} detail={data} isLoading={isLoading} />
          )}
          {params.tab === "activity" && <ShopperActivityTab shopperId={shopperId} />}
          {["documents", "tickets"].includes(params.tab) && (
            <ComingSoon
              title={TABS.find((t) => t.value === params.tab)?.label ?? "Coming soon"}
              description="This tab has no design yet — Orders and Activity are the only ones specified."
            />
          )}
        </div>
      </div>
    </>
  );
}
