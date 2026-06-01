# Deprecation List — Phase 1 Audit

Items identified during Phase 1 audit that are candidates for consolidation, removal, or refactoring.

---

## 🔴 Duplicate Primitives (in `primitives.json`)

| Primitive Key | Maps To | Duplicate Of | Action |
|---|---|---|---|
| `slide-code` | `type: code-diff` | `slide-code-diff` | **Remove** `slide-code`. Keep `slide-code-diff` as canonical |
| `slide-timeline` | `type: timeline-horizontal` | `slide-timeline-horizontal` | **Remove** `slide-timeline`. Keep `slide-timeline-horizontal` |

---

## 🟡 Redundant Patterns (same idea, different implementations)

| Pattern | Location | Similar To | Notes |
|---|---|---|---|
| `timeline` (vertical) | renderer.js, core.css | `timeline-horizontal` | Share same data shape (`events[].year/title/desc`), different layouts. Could become **one block with `variant: vertical | horizontal`** |
| `compare` block | renderer.js, core.css | `split` block with two bullet sub-blocks | Overlap in use-case. `compare` is specialized with color-coded sides. Keep both but document when to use which |
| `quiz` vs `advanced-quiz` | renderer.js, blocks-core.js | Each other | Different interaction models (instant vs submit). Keep both, but share options rendering logic |

---

## 🟡 Hardcoded Logic (candidates for tokenization)

| Location | What | Recommendation |
|---|---|---|
| `blocks-data.js:188-291` | Bar chart dimensions `W=600, H=320, padding=50` | Extract to chart config tokens |
| `blocks-data.js:293-438` | Line chart same hardcoded dimensions | Same — share with bar chart |
| `blocks-data.js:441-578` | Donut chart `r=70, strokeW=20` | Extract to donut config tokens |
| `blocks-data.js:666-670` | Flow node `nodeWidth=160, nodeHeight=50` | Extract to flow config tokens |
| `engine.js:432` | Counter animation duration `1200ms` | Make configurable via data attribute or CSS variable |
| `renderer.js` line-by-line | Split sub-block inline styles (e.g. `style="list-style-type: disc; padding-left: 1.5rem;..."`) | Move to CSS class `.sub-bullets` |

---

## 🟡 Inline Styles in Renderer (should be CSS classes)

| Block | Line | Inline Style | Recommendation |
|---|---|---|---|
| `split > bullets` sub-block | renderer.js:596 | `style="list-style-type: disc; padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;"` | Create `.sub-bullets` CSS class |
| `split > image` sub-block | renderer.js:600 | `style="border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);"` | Create `.sub-image` CSS class |
| Presenter dashboard | engine.js:82-127 | Multiple inline styles in template literal | Move to `.presenter-*` CSS classes (partially in presenter.css already) |

---

## 🟢 Frozen Contracts (do NOT modify)

These components are stable and should remain untouched:

| Component | Files | Reason |
|---|---|---|
| **Slide shell** | `base.css` (`.slide`, `.slide-inner`, `.slides-track`, `.slides-viewport`) | Core navigation depends on this structure |
| **Navigation engine** | `engine.js` (`updateSlide`, `bindKeyboard`, `bindTouch`) | All interactions depend on `slideChanged` event |
| **Render pipeline** | `renderer.js` (`renderSlideHTML` switch + `esc()` utility) | Build system calls this directly |
| **Primitive $ref expansion** | `build.js` ref resolver + `primitives.json` | All sample decks depend on this |
| **Theme token contract** | `variables.css` `:root` + `[data-theme="*"]` | All 19 themes follow same token shape |
| **Build asset lists** | `src/build/assets.js` | Controls what gets bundled |
| **CSS stagger system** | `animations.css` `.stagger > *` and `.stagger-spring > *` | 15+ blocks depend on these classes |
| **Lazy loader contract** | `lazy-loaders.js` CDN loading pattern | KaTeX/Mermaid/Prism blocks depend on this |

---

## 🟢 Items That Can Become Tokens/Presets

| Current | Candidate Token/Preset |
|---|---|
| Chart colors `['primary', 'success', 'accent', 'error', 'warning']` | `--chart-palette` token array |
| Counter `duration: 1200` in engine.js | `data-count-duration` attribute |
| Flow connection `stroke-dashoffset` timing `1.2s` | `--flow-draw-duration` token |
| Bento card sizes `small` / `large` | Already tokenized via `bento-size-*` classes ✓ |
| Stagger max children `10` | Consider extending to `15` for larger decks |
