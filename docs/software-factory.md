# Software factory workflow

How a piece of work moves from idea to production on this site.

```
GitHub issue ──(label: agent-ready)──▶ Claude agent ──▶ branch + PR ──▶ Netlify deploy preview ──▶ human review ──▶ merge ──▶ production
                                              ▲                                       ▲
                                    CLAUDE.md + .claude/agents/*           Contentful publish ──▶ Netlify build hook
```

1. **Write the issue.** Describe the outcome, and add a "What does complete look like?" section. That section is the agent's definition of done.
2. **Label it `agent-ready`** once it is scoped. Without the label agents ignore it (see the rule in `CLAUDE.md`).
3. **An agent picks it up.** A scheduled Claude session checks for open `agent-ready` issues that have no linked PR, and works them using the matching specialist agent in `.claude/agents/`.
4. **The agent opens a PR** titled `feat(#N): ...` with `Closes #N`. If it is blocked it comments on the issue instead.
5. **Netlify builds a deploy preview** for the PR. Contentful publishes trigger a rebuild through a build hook, so content and code can be reviewed together.
6. **A human reviews and merges.** Agents never approve or merge.

## Adding a new specialist agent

Create `.claude/agents/<name>.md` with frontmatter (`name`, `description`, `model`, `tools`) and a body that states the scope, the files it owns, and its done criteria. Link it from the "Specialist agents" list in `CLAUDE.md`.
