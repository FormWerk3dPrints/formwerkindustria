import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  size?: "section" | "display";
  className?: string;
}

/** Cabeçalho de seção do design system FormWerk: sobrelinha técnica, título e descrição. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  size = "section",
  className = "",
}: Props) {
  const Tag = size === "display" ? "h1" : "h2";
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} ${size === "display" ? "max-w-5xl" : "max-w-2xl"} ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag
        className={
          size === "display"
            ? "text-4xl md:text-6xl font-extrabold leading-[1.07] tracking-[-0.025em] text-ink"
            : "text-3xl leading-9 font-bold tracking-[-0.015em] text-ink"
        }
      >
        {title}
      </Tag>
      {description && (
        <p
          className={`mt-4 text-ink-muted ${
            size === "display" ? "text-base md:text-lg leading-relaxed" : "text-base leading-[26px]"
          } ${center ? "mx-auto max-w-2xl" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
