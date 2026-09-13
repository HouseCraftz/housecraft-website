import type { InputHTMLAttributes } from "react";

export function PixelInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="pixel-input" {...props} />;
}
