import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

export function PixelButton({ children, className = "", ...props }: Props) {
  return (
    <button className={`pixel-button ${className}`} {...props}>
      {children}
    </button>
  );
}
