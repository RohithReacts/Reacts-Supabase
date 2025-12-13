"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const toastMessage = searchParams.get("toast");
    const errorMessage = searchParams.get("error");

    if (toastMessage) {
      toast.success(toastMessage);
      // Remove the param from URL without refreshing
      const params = new URLSearchParams(searchParams.toString());
      params.delete("toast");
      router.replace(`${pathname}?${params.toString()}`);
    }

    if (errorMessage) {
      toast.error(errorMessage);
      // Remove the param from URL without refreshing
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname]);

  return null;
}
