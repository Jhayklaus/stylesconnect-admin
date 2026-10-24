import { Suspense } from "react";
import { ReviewModerationPage } from "@/components/reviews/pages/ReviewModerationPage";

export default function Page() {
  return (
    <Suspense>
      <ReviewModerationPage queue="product" />
    </Suspense>
  );
}
