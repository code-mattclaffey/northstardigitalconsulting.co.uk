import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Service } from "@/data/services";

interface Props {
  services: Service[];
  contactHref: string;
}

/** Services tab island (Radix Tabs: arrow keys move between tabs). */
export default function ServicesTabs({ services, contactHref }: Props) {
  const [first] = services;
  if (!first) return null;

  return (
    <Tabs defaultValue={first.id} className="mt-10 items-center">
      <TabsList aria-label="Services">
        {services.map((service) => (
          <TabsTrigger key={service.id} value={service.id}>
            {service.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {services.map((service) => (
        <TabsContent
          key={service.id}
          value={service.id}
          className="mt-12 grid w-full grid-cols-1 items-stretch gap-6 text-left md:grid-cols-2"
        >
          <div className="flex flex-col gap-4">
            {service.items.map((item) => (
              <div
                key={item.title}
                className="rounded-[20px] border border-border bg-background p-6"
              >
                <h3 className="m-0 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2.5 mb-0 text-[15px] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
            <a
              href={contactHref}
              className={buttonVariants({
                size: "sm",
                className: "h-11 self-start px-5",
              })}
            >
              Discuss your project
            </a>
          </div>

          <div className="dark flex flex-col gap-5 rounded-[20px] border border-border bg-brand-ink bg-[radial-gradient(80%_80%_at_100%_0%,rgb(91_134_229/0.3),rgb(18_24_40/0)_60%)] p-7">
            <div className="flex items-center justify-between gap-3">
              <h3 className="m-0 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                What you get
              </h3>
              <Badge>{service.label}</Badge>
            </div>
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3">
                  <span className="flex size-6 flex-none items-center justify-center rounded-full bg-secondary">
                    <Check
                      className="size-3.5 text-primary"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-[15px] leading-normal text-brand-slate-200">
                    {outcome}
                  </span>
                </li>
              ))}
            </ul>
            <ul
              className="m-0 mt-auto flex list-none flex-wrap gap-2 border-t border-secondary p-0 pt-4"
              aria-label="Typical roles and tools"
            >
              {service.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1.5 text-[13px] text-brand-slate-300"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
