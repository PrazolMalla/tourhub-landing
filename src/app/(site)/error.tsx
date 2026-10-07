"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap" style={{ paddingBlock: "clamp(80px,12vw,160px)" }}>
      <ErrorState
        title="Something went wrong"
        description="We hit an unexpected snag loading this page. Please try again — or contact our team if it persists."
        onRetry={reset}
      />
    </div>
  );
}
