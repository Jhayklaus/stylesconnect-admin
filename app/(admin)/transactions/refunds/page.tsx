import { StubPage } from "@/components/stubs/StubPage";

export default function Page() {
  return (
    <StubPage
      title="Refunds"
      breadcrumb={[{ label: "Transactions" }, { label: "Refunds" }]}
    />
  );
}
