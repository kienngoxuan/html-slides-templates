# Lecta AI Slide Engine — Agent Playbook

This guide is designed for **AI Agents** interacting with, mutating, or generating presentations within this repository. By adhering to the principles outlined below, agents can produce stunning, responsive, and completely valid presentation slide decks with zero structural bugs.

---

## 1. Registry-First Architecture
All blocks, layouts, behaviors, and themes are governed by central JSON registries in `src/registry/`.
- **Source of Truth**: Never hardcode layouts, styles, or classes. Refer to the registry schemas.
- **Dependency Map**: The engine automatically detects which block families you are using and only bundles the required files, saving up to 60+ KB per deck.

---

## 2. Recipe DSL
Instead of generating verbose HTML nodes, agents should formulate declarative, high-level JSON recipes that map directly to the engine's built-in block templates.

### Example DSL Snippet
```json
{
  "title": "Agent-Designed Masterclass",
  "theme": "editorial",
  "slides": [
    {
      "id": "intro",
      "type": "hero",
      "props": {
        "title": "AI Agent Orchestration",
        "subtitle": "Unifying registry-first engines",
        "badge": "Lecta 1.0"
      }
    },
    {
      "id": "key-bullets",
      "type": "bullets",
      "props": {
        "title": "Core Architectural Advantages",
        "icon": "🚀",
        "items": [
          "9.4% smaller bundle footprint through dynamic asset pruning",
          "Automated visual density audits with constraint engines",
          "Automatic item truncations back up safely to speaker notes"
        ]
      }
    }
  ]
}
```

---

## 3. Safe Mutation Zones
To prevent corrupting DOM templates or system-level presentation logic, agents are restricted to mutating specific **Safe Zones**.

| Target Zone | Allowed Operations | Forbidden Operations |
|---|---|---|
| **Slide Metadata** | Modify `theme`, `transitionPreset`, `aspectRatio` | Modify `id` or structural slide keys |
| **Block Data** | Mutate properties like `heading`, `text`, `items`, `stats`, `code`, `latex` | Inject raw CSS style rules or raw HTML elements |
| **DOM / Engine** | *None* (Fully Immutable) | Edit `renderer.js`, component templates, or global layout selectors |

Use the helper API `src/agent/safe-mutation.js` to execute your mutations safely!

---

## 4. Constraint Engine & Auto-Repair
The engine automatically runs a structural audit to keep slides visual-friendly and prevent "AI text bloating".

### Crucial Constraints
- **Bullets**: Maximum **7** items per slide. Individual items must be under **120** characters.
- **Workflow Steppers**: Maximum **6** steps per workflow.
- **Stat Cards**: Maximum **4** cards to maintain symmetry.
- **Flip Cards**: Maximum **6** cards.

### Auto-Repair / Fallback Rules
If you accidentally exceed these limits, the engine will automatically:
1. Truncate the excessive items to fit.
2. Dump all removed items safely into the slide's `speakerNotes` so they aren't lost.
3. Truncate long header titles to 97 characters with a neat trailing ellipsis `...`.

---

## 5. Design Strategies
- **Aesthetics First**: Use one of the 19 semantic themes (e.g. `brutalist`, `editorial`, `midnight`) instead of custom color overrides.
- **Reduced Motion**: Limit your slide flow triggers to under 12 steps per slide to protect performance and avoid overwhelming the audience.
