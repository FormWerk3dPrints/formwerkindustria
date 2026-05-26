"use client";

import { useSmoothScroller } from "./ScrollContext";
import type { ReactNode } from "react";

interface Props {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function SmoothAnchor({ href, className, children }: Props) {
  const lenisRef = useSmoothScroller();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const lenis = lenisRef?.current;
    if (!lenis || !href.startsWith("#")) return;
    e.preventDefault();
    lenis.scrollTo(href, { duration: 1.2 });
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
