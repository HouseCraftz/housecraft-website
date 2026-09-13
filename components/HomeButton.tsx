"use client";

import { useRouter } from "next/navigation";
import { ACCESS_PROGRESS_KEY, COMPLETED_HOME_KEY } from "@/lib/session";

export function HomeButton() {
  const router = useRouter();

  function goHome() {
    try {
      const progress = JSON.parse(window.sessionStorage.getItem(ACCESS_PROGRESS_KEY) ?? "{}") as { step?: number };
      if (progress.step === 4) window.sessionStorage.setItem(COMPLETED_HOME_KEY, "true");
      else window.sessionStorage.removeItem(COMPLETED_HOME_KEY);
    } catch {
      window.sessionStorage.removeItem(COMPLETED_HOME_KEY);
    }
    router.push("/");
  }

  return (
    <button className="home-button" type="button" onClick={goHome}>
      HOME
    </button>
  );
}
