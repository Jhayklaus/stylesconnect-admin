import { StubPage } from "@/components/stubs/StubPage";

export default function Page() {
  return (
    <StubPage
      title="Verification"
      breadcrumb={[{ label: "Customers" }, { label: "Verification" }]}
    />
  );
}
