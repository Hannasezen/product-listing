import type { ReactNode } from "react";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4";
  children: ReactNode;
  className?: string;
};

const classes = {
  h1: "text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl",
  h2: "text-2xl font-semibold tracking-tight text-slate-900",
  h3: "text-xl font-semibold tracking-tight text-slate-900",
  h4: "text-lg font-semibold tracking-tight text-slate-900",
};

export function Heading({
  as: Component = "h2",
  children,
  className = "",
}: HeadingProps) {
  return (
    <Component className={`${classes[Component]} ${className}`}>
      {children}
    </Component>
  );
}
