# ADR-0006 · How the system amends

- **Status:** Accepted
- **Date:** 2026-05-28
- **Supersedes:** —
- **Superseded by:** —

## Context

A design system rigid enough to be recognized for centuries (Hanafuda) is more valuable than one flexible enough to accommodate every future request. But "frozen" is not the goal — the system needs a *path for change* that doesn't drift into expansion-as-default.

By v0.2 we had explicitly stated the meta-rule ("lock the grammar, vary the sentences") and then immediately broke it by adding 16 more principles in v0.3. The lesson: the amendment rule needs teeth.

## Decision

**The grammar cap is 4 · 7 · 8 · 3.**

- 4 operative concepts (Ma · Iki · Notan · Mitate)
- 7 Zen disciplines (Hisamatsu's)
- 8 procedural rules
- 3 productive contradictions
- 12 broadside panels (matches the 12 months)

**The amendment protocol:**

1. A new principle arrives (from outside reading, member contribution, observed practice).
2. It is read against the existing grammar.
3. **If it sharpens an existing rule** → refine that rule in place; no count change.
4. **If it adds genuinely new content** → swap out a weaker rule. The count is the cap.
5. **If it concerns a chapter** (palette / motif / template / protocol) → amend that document in place.
6. **Never spawn a new top-level page** without supermajority collective approval AND a clear case that the structural cap is wrong (which would be a major-version event).

**Exception:** complete-rebuild directives (`v0.2` rebuild, `v0.3` rebuild) are allowed when the new material is foundational enough to warrant restructuring — but the rebuild **consolidates**, never just stacks.

## Consequences

- Future principle drops produce a focused, evidence-cited diff: which rule was refined, which was swapped out, why. Recorded as an ADR here.
- The system gets *better* over time without getting *bigger*. Mori's stencil practice deepened for forty years without expanding the grammar.
- Drift is countered by quarterly review (solstice + equinox).

## What we considered and rejected

- **"Always allow additions"** — rejected; that's how systems sprawl into uselessness.
- **"Freeze entirely after v1.0"** — rejected; a living school responds to new lineage and new context.
- **"Vote on every change"** — rejected; quarterly review is the cadence; emergency patches anytime; collective sign-off only for structural changes.

## Sources

- Hanafuda's 150-year fixed grammar
- Architecture Decision Records (ADR) practice · [adr.github.io](https://adr.github.io/)
- Keep a Changelog · [keepachangelog.com](https://keepachangelog.com/en/1.1.0/)
- The Stripe Press / Walker / MIT Media Lab precedent: constraint as identity
