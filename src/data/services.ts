/** Homepage "Services" tabs. Edit here; the copy is not in Contentful yet. */
export interface Service {
  id: string;
  label: string;
  items: { title: string; body: string }[];
  outcomes: string[];
  tags: string[];
}

export const SERVICES: Service[] = [
  {
    id: "leadership",
    label: "Technical leadership",
    items: [
      {
        title: "Engineering strategy",
        body: "Roadmaps, architecture decisions and delivery plans that line up with what the business needs next.",
      },
      {
        title: "Hands-on team leadership",
        body: "I lead from the codebase: pairing, reviews and standards that lift the whole team.",
      },
    ],
    outcomes: [
      "A delivery plan your stakeholders can trust",
      "Architecture decision records for every big call",
      "A healthier, faster review and release process",
      "Mentoring that leaves the team stronger",
    ],
    tags: ["Principal engineer", "Tech lead", "Interim head of engineering"],
  },
  {
    id: "frontend",
    label: "Frontend architecture",
    items: [
      {
        title: "Modern React and TypeScript",
        body: "Scalable component architecture, design systems and performance budgets that hold up at scale.",
      },
      {
        title: "Checkout and conversion",
        body: "Rebuilding high-traffic journeys with A/B testing so every change is measured.",
      },
    ],
    outcomes: [
      "A component library shared by design and code",
      "Core Web Vitals in the green",
      "Typed APIs from CMS to UI",
      "Accessible by default (WCAG 2.2 AA)",
    ],
    tags: ["React", "Next.js", "Astro", "shadcn/ui"],
  },
  {
    id: "ai",
    label: "AI-enabled delivery",
    items: [
      {
        title: "Agentic engineering workflows",
        body: "Issue-to-PR pipelines where AI agents do the groundwork and engineers review and decide.",
      },
      {
        title: "Safe adoption",
        body: "Guardrails, review rules and measurement so AI speeds teams up without adding risk.",
      },
    ],
    outcomes: [
      "A working agent workflow in your repo",
      "Clear rules for what agents may change",
      "Metrics on cycle time before and after",
      "A team that knows how to use it",
    ],
    tags: ["Claude Code", "GitHub", "CI/CD", "AWS"],
  },
];
