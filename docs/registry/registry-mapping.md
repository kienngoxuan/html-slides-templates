# Registry Mapping — Phase 1 Complete Audit

> Full hierarchy map of the Lecta AI codebase. This document answers:
> "block nào thuộc loại gì?", "nó cần props nào?", "nó reuse với cái nào?", "nó có thể thay bằng variant nào?"

---

## 📦 Module Inventory

### CSS Modules (8 files)

| File | Role | Size | Category |
|---|---|---|---|
| `src/css/variables.css` | OKLCH theme tokens, typography, spacing, shadows, transitions | 25KB | foundation |
| `src/css/base.css` | Slide shell, viewport, nav-bar, print rules | — | foundation |
| `src/css/blocks/core.css` | Accordion, tabs, stepper, cards, quiz, compare, timeline, bullets, image | — | blocks |
| `src/css/blocks/data.css` | Charts, tables, bento, flow, split, video | — | blocks |
| `src/css/blocks/new-blocks.css` | Stats, code-diff, splash, quote-card, definition-card, analogy, checklist, timeline-horizontal | — | blocks |
| `src/css/blocks/overlays.css` | Advanced quiz modal, drawing canvas, search palette | — | overlays |
| `src/css/blocks/presenter.css` | Presenter dashboard, video tools | — | presenter |
| `src/css/animations.css` | All keyframes, stagger, transitions, flow presets, utilities | 8KB | animation |
| `src/css/sidebar.css` | Settings panel, sidebar tabs, picker | — | presenter |

### JS Modules (12 files)

| File | Role | Exports | Category |
|---|---|---|---|
| `engine.js` | Navigation, keyboard, touch, broadcast, presenter view, stat counter | `SlideEngine` | core |
| `renderer.js` | JSON→HTML conversion (26 block types + 6 sub-block types) | `renderSlideHTML` | core |
| `blocks-core.js` | Interactions: accordion, tabs, stepper, cards, quiz, adv-quiz, timeline, bullets, checklist, images | `InteractiveBlocksCore` | blocks |
| `blocks-data.js` | Charts (bar/line/donut), tables (sort/filter), bento, flow (SVG) | `InteractiveBlocksData` | blocks |
| `blocks.js` | Orchestrator — calls `InteractiveBlocksCore.init()` + `InteractiveBlocksData.init()` | — | orchestrator |
| `lazy-loaders.js` | On-demand CDN loading: KaTeX, Mermaid, Prism | `LazyLoaders` | utility |
| `sidebar.js` | Notes, timer, student picker, Q&A drawer | — | presenter |
| `lesson-studio.js` | Context configs, recording checkpoints | — | presenter |
| `slide-health.js` | Slide validation diagnostics | — | utility |
| `spotlight-search.js` | Ctrl+K search palette | — | utility |
| `presenter-overlay.js` | Drawing/annotation canvas | — | presenter |
| `themes.js` | Small compatibility stubs | — | utility |

### Data Files (12+)

| File | Purpose |
|---|---|
| `src/data/primitives.json` | 28 shared $ref primitives (slide presets + context presets + size tokens) |
| `src/data/sample-slides.json` → `sample10-slides.json` | 10 slide deck configurations |
| `src/data/template-library.json` | UI catalog configuration |

### Build Files (5)

| File | Purpose |
|---|---|
| `build.js` | Main compiler with $ref expansion, schema validation, CSR packaging |
| `build-catalog.js` | Reference catalog builder |
| `src/build/assets.js` | Asset file lists (CSS/JS bundles) |
| `src/build/fonts.js` | Font metadata |
| `src/build/themes.js` | Theme metadata for build |
| `src/build/utils.js` | Shared build helpers |

---

## 🏷️ Block Taxonomy Summary

### By Category

| Category | Blocks | Count |
|---|---|---|
| **content** | title, splash, bullets, timeline, timeline-horizontal, summary, image, video, quote-card, definition-card, analogy, code-diff, math | 13 |
| **interaction** | accordion, tabs, stepper, cards, quiz, advanced-quiz, checklist | 7 |
| **data** | chart, table, flow, mermaid, stats | 5 |
| **structure** | compare, bento, split | 3 |
| **Total** | | **28** (26 main + 6 sub-blocks inside split) |

### Sub-Block Types (used inside `split`)
`text`, `bullets`, `code`, `image`, `math`, `mermaid`

---

## 🔄 Reuse Analysis

### Blocks that share the same data shape
```
timeline ←→ timeline-horizontal    (events[].year/title/description)
quiz ←→ advanced-quiz              (questions[].question/options/correct)
compare ←→ split+bullets           (two-column content)
```

### Blocks that share the same CSS animation preset
```
stagger:        accordion, cards, quiz, advanced-quiz, timeline, summary,
                bento, checklist, quote-card, definition-card, analogy,
                code-diff, image, chart, table, flow, stats
stagger-spring: bullets, split
```

### Blocks that share JS interaction patterns
```
toggle-pattern:  accordion (open/close), checklist (checked/unchecked),
                 flip-cards (flipped), bullets (expanded)
select-pattern:  tabs (active tab), stepper (active step),
                 timeline (active item), quiz (selected option)
```

---

## 🎨 Theme Inventory (19 themes)

### Light Themes (12)
`ocean`, `forest`, `berry`, `slate`, `paper`, `nordic`, `sunset`, `editorial`, `newspaper`, `brutalist`, `pastel`, `monochrome`

### Dark Themes (7)
`neon`, `midnight`, `evergreen`, `volcano`, `terminal`, `blueprint`, `blackboard`

### Token Contract (all themes share)
`--color-primary`, `--color-primary-light`, `--color-primary-dark`, `--color-primary-alpha`, `--color-secondary`, `--color-accent`, `--color-accent-light`, `--color-bg`, `--color-bg-alt`, `--color-surface`, `--color-surface-hover`, `--color-text`, `--color-text-secondary`, `--color-text-muted`, `--color-border`, `--color-border-light`, `--color-success`, `--color-warning`, `--color-error`, `--gradient-primary`, `--gradient-accent`, `--gradient-bg`

Some themes also override: `--font-heading`, `--font-body`, `--radius-*`, `--shadow-*`

---

## 🎬 Transition Presets (4)

| Preset | Keyframe | Duration | Used By Default |
|---|---|---|---|
| `fade` | `transitionFade` | 0.6s | flow, code-diff, table, chart, quote-card, definition-card, analogy, math, mermaid, video |
| `wipe-right` | `transitionWipeRight` | 0.65s | title, bullets, compare, timeline-horizontal, summary, split, cards, checklist, stepper, accordion, tabs |
| `zoom-in` | `transitionZoomIn` | 0.55s | quiz, advanced-quiz, bento, stats, image, splash |
| `flip-y` | `transitionFlipY` | 0.6s | (no default, used in sample6 neon deck) |

---

## 📊 Primitive $ref Registry (28 entries)

### Slide Presets (26)
Each maps `type` + `transitionPreset`:
`slide-title`, `slide-bullets`, `slide-accordion`, `slide-tabs`, `slide-stepper`, `slide-cards`, `slide-quiz`, `slide-advanced-quiz`, `slide-compare`, `slide-bento`, `slide-flow`, `slide-table`, `slide-chart`, `slide-stats`, `slide-summary`, `slide-split`, `slide-code-diff`, `slide-code` *(duplicate)*, `slide-timeline`, `slide-timeline-horizontal` *(duplicate of slide-timeline)*, `slide-image`, `slide-quote-card`, `slide-definition-card`, `slide-analogy`, `slide-checklist`, `slide-splash`

### Size Tokens (2)
`bento-small` → `{ size: "small" }`, `bento-large` → `{ size: "large" }`

### Trend Tokens (2)
`trend-up` → `{ trendUp: true }`, `trend-down` → `{ trendUp: false }`

### Context Presets (2)
`context-executive` → audience/pace/tone settings, `context-beginner` → audience/pace/tone settings

---

## 🧊 Frozen Contracts

Components that MUST NOT be modified without careful migration:

1. **Slide shell DOM** — `section.slide > div.slide-inner` (engine.js depends on this)
2. **Navigation system** — `SlideEngine.updateSlide()` + `slideChanged` CustomEvent
3. **Render function signature** — `renderSlideHTML(slide)` called by build.js
4. **$ref expansion** — build.js reads `primitives.json` and merges into slide objects
5. **CSS token contract** — All 22 color tokens must exist on every `[data-theme]`
6. **Asset bundle lists** — `src/build/assets.js` controls which files are bundled
7. **Stagger class contract** — `.stagger > *` and `.stagger-spring > *` used by 15+ blocks
8. **Lazy loader CDN contract** — KaTeX/Mermaid/Prism version pinning in `lazy-loaders.js`

---

## 📁 Full File Tree

```
src/
├── css/
│   ├── variables.css          ← 19 themes, spacing, radii, shadows, transitions
│   ├── base.css               ← slide shell, viewport, nav-bar, print
│   ├── blocks/
│   │   ├── core.css           ← accordion, tabs, stepper, cards, quiz, compare, timeline, bullets, image
│   │   ├── data.css           ← charts, tables, bento, flow, split, video
│   │   ├── new-blocks.css     ← stats, code-diff, splash, quote/definition/analogy, checklist, timeline-h
│   │   ├── overlays.css       ← adv-quiz modal, drawing, search palette
│   │   └── presenter.css      ← presenter dashboard
│   ├── animations.css         ← 18 keyframes, stagger, transitions, flow presets, utilities
│   └── sidebar.css            ← settings, sidebar tabs, picker
├── js/
│   ├── engine.js              ← navigation, keyboard, touch, broadcast, presenter, stat counter
│   ├── renderer.js            ← 26 block types → HTML
│   ├── blocks-core.js         ← 10 interaction handlers
│   ├── blocks-data.js         ← charts, tables, bento, flow
│   ├── blocks.js              ← orchestrator
│   ├── lazy-loaders.js        ← KaTeX, Mermaid, Prism CDN
│   ├── sidebar.js             ← notes, timer, picker, Q&A
│   ├── lesson-studio.js       ← context, recording
│   ├── slide-health.js        ← validation
│   ├── spotlight-search.js    ← Ctrl+K search
│   ├── presenter-overlay.js   ← drawing canvas
│   └── themes.js              ← stubs
├── data/
│   ├── primitives.json        ← 28 shared $ref primitives
│   ├── sample-slides.json     ← deck 1
│   ├── sample2-slides.json    ← deck 2
│   ├── ...                    ← decks 3-9
│   ├── sample10-slides.json   ← deck 10
│   └── template-library.json  ← catalog config
├── build/
│   ├── assets.js              ← bundle file lists
│   ├── fonts.js               ← font metadata
│   ├── themes.js              ← theme metadata
│   └── utils.js               ← build helpers
├── emulator/                  ← device simulation
├── fonts/                     ← local font assets
└── favicon.JPG                ← base64-encoded favicon
```
