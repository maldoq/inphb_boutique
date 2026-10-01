import type { ButtonHTMLAttributes, ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonOptions = {
  variant?: "primary" | "secondary" | "accent";
  size?: "default" | "small";
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonOptions;
type ButtonLinkProps = ComponentProps<typeof Link> & ButtonOptions;

export function buttonStyles({
  variant = "primary",
  size = "default",
  className,
}: ButtonOptions & { className?: string }) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink font-grotesk font-bold",
    "shadow-[4px_4px_0_var(--ink)] transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--ink)]",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ember/60 disabled:pointer-events-none disabled:opacity-50",
    size === "default" ? "min-h-12 px-6 text-base" : "min-h-10 px-4 text-sm",
    variant === "primary" && "bg-brand text-white",
    variant === "accent" && "bg-ember text-[#0A0A0A]",
    variant === "secondary" && "bg-bg text-ink",
    className,
  );
}

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />;
}
