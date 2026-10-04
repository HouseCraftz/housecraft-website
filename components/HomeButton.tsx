"use client";

import { useRouter } from "next/navigation";
import { ACCESS_PROGRESS_KEY, COMPLETED_HOME_KEY, progressStorage } from "@/lib/session";

export function HomeButton() {
  const router = useRouter();

  function goHome() {
    try {
      const progress = JSON.parse(progressStorage.getItem(ACCESS_PROGRESS_KEY) ?? "{}") as { step?: number };
      if (progress.step === 4) progressStorage.setItem(COMPLETED_HOME_KEY, "true");
      else progressStorage.removeItem(COMPLETED_HOME_KEY);
    } catch {
      progressStorage.removeItem(COMPLETED_HOME_KEY);
    }
    router.push("/");
  }

  return (
    <button className="home-button" type="button" onClick={goHome}>
      HOME
    </button>
  );
}
