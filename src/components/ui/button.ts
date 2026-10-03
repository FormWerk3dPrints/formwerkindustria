/**
 * Classes do Button do design system FormWerk.
 * Use em <button>, <a>, <Link> ou <SmoothAnchor>.
 *
 * primary   = preto (ação principal)
 * accent    = laranja, no máximo um por tela, texto sempre preto
 * secondary = contorno
 * ghost     = texto
 */
export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold " +
  "transition-[transform,background-color,border-color] duration-200 " +
  "hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-black text-on-black shadow-sm",
  accent: "bg-accent text-on-accent shadow-sm",
  secondary: "border border-border-strong text-ink hover:border-ink",
  ghost: "text-ink hover:bg-surface-100",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-6 py-3",
  lg: "px-7 py-3.5",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra = ""
) {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(" ");
}
