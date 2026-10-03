import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Card de solução do design system FormWerk. */
export default function FeatureCard({ icon: Icon, title, description }: Props) {
  return (
    <div className="group rounded-xl border border-border bg-surface-100 p-8 shadow-sm transition-[box-shadow,border-color] duration-200 hover:border-border-strong hover:shadow-md">
      <Icon
        className="mb-4 h-8 w-8 text-steel transition-colors duration-200 group-hover:text-accent"
        aria-hidden="true"
      />
      <h3 className="mb-2 text-lg font-semibold leading-7 text-ink">{title}</h3>
      <p className="text-sm leading-[22px] text-ink-muted">{description}</p>
    </div>
  );
}
