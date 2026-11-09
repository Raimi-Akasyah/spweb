import type { AnchorHTMLAttributes, ReactNode } from "react";
import { waLink } from "@/lib/whatsapp";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  message: string;
  variant?: "dark" | "outline" | "gold" | "text";
  children: ReactNode;
};

export function WhatsAppButton({
  message,
  variant = "dark",
  children,
  className = "",
  ...props
}: Props) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noreferrer"
      className={`button button--${variant} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
