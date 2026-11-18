import * as React from "react";

import { cn } from "@/lib/utils";

/** shadcn/ui Card. In `.astro` files, use `cardVariants` classes directly. */
const cardClass =
  "flex flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card" className={cn(cardClass, className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-1 flex-col gap-3 p-6", className)}
      {...props}
    />
  );
}

export { Card, CardContent, cardClass };
