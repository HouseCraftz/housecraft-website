"use client";

import { useState } from "react";
import { HammerNailCheck } from "./HammerNailCheck";

type Props = {
  label: string;
  detail: string;
  href: string;
  complete: boolean;
  onComplete: () => void;
};

export function TaskRow({ label, detail, href, complete, onComplete }: Props) {
  const [opened, setOpened] = useState(false);
  const [animating, setAnimating] = useState(false);
  const usableHref = href !== "PLACEHOLDER" ? href : "https://x.com";

  function markComplete() {
    if (complete || !opened) return;
    setAnimating(true);
    window.setTimeout(() => {
      onComplete();
      setAnimating(false);
    }, 760);
  }

  return (
    <div className={`task-row ${complete ? "task-row--done" : ""}`}>
      <HammerNailCheck complete={complete} animating={animating} />
      <div className="task-copy">
        <strong>{label}</strong>
        <span>{complete ? "DONE" : detail}</span>
      </div>
      {!complete && (
        <div className="task-actions">
          <a href={usableHref} target="_blank" rel="noreferrer" onClick={() => setOpened(true)}>
            OPEN ↗
          </a>
          <button type="button" disabled={!opened || animating} onClick={markComplete}>
            {animating ? "BUILDING" : "MARK DONE"}
          </button>
        </div>
      )}
    </div>
  );
}
