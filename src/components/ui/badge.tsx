import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** shadcn/ui Badge. In `.astro` files, use `badgeVariants()` on a `<span>`. */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-medium",
  {
    variants: {
      variant: {
        default: "bg-accent px-2.5 py-1 text-xs text-accent-foreground",
        secondary: "bg-secondary px-2.5 py-1 text-xs text-muted-foreground",
        outline:
          "border border-border-strong px-3.5 py-1.5 text-xs tracking-[0.08em] text-muted-foreground uppercase",
        glass:
          "border border-brand-ink-700 bg-brand-ink-900/75 py-2 pr-4 pl-3 text-[13px] text-brand-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
