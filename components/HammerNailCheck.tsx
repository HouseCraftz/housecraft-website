"use client";

import { useState } from "react";

type Props = { complete: boolean; animating: boolean };

export function HammerNailCheck({ complete, animating }: Props) {
  const [hasSprite, setHasSprite] = useState(false);

  return (
    <span className={`hammer-check ${complete ? "is-complete" : ""} ${animating ? "is-hitting" : ""}`} aria-hidden="true">
      <span className="nail"><i /></span>
      <span className={`hammer-sprite ${hasSprite ? "has-image" : ""}`}>
        <img src="/assets/hammer.png" alt="" onLoad={() => setHasSprite(true)} onError={() => setHasSprite(false)} />
      </span>
      <span className="particles"><i /><i /><i /></span>
    </span>
  );
}
