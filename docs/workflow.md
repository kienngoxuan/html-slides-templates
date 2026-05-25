# Lecta AI Development Workflow

## Overview
Lecta AI is a self-contained interactive slide builder. Source code is modular, and a Node.js build script assembles everything into standalone HTML files that can be opened directly in any browser without a server.

## Project Structure
```text
html-slides-templates/
|-- build.js                 # Builds presentation HTML from JSON data
|-- build-catalog.js         # Builds all-designs.html component catalog
|-- src/
|   |-- data/
|   |   `-- sample-slides.json   # Slide deck content (JSON)
|   |-- css/
|   |   |-- variables.css        # OKLCH theme tokens
|   |   |-- base.css             # Layout, navigation, shared structure
|   |   |-- blocks/
|   |   |   |-- core.css         # Accordion, tabs, cards, quiz, summary
|   |   |   |-- data.css         # Charts, tables, flow, split, mermaid
|   |   |   |-- overlays.css     # Advanced quiz modal, drawing, search palette
|   |   |   `-- presenter.css    # Presenter, notes, video-specific UI
|   |   |-- animations.css       # Keyframes and transitions
|   |   `-- sidebar.css          # Settings, sidebar, teaching tools
|   |-- js/
|   |   |-- engine.js            # Navigation, keyboard, touch, sync
|   |   |-- blocks-core.js       # Core interactive block logic
|   |   |-- blocks-data.js       # Data/media block logic
|   |   |-- lazy-loaders.js      # KaTeX, Mermaid, Prism lazy loading
|   |   |-- blocks.js            # Module orchestrator for block systems
|   |   |-- sidebar.js           # Theme, notes, timer, teaching panel
|   |   |-- themes.js            # Small compatibility stubs
|   |   `-- renderer.js          # JSON -> HTML converter
|   |-- build/
|   |   |-- assets.js            # Shared asset lists for build scripts
|   |   |-- themes.js            # Theme metadata for build scripts
|   |   `-- utils.js             # Shared helpers for build scripts
|   `-- catalog/
|       `-- catalog-css.css      # Catalog-only layout styles
|-- output/
|   `-- templates/
|       |-- sample1.html         # Generated presentation
|       `-- all-designs.html     # Generated component catalog
`-- docs/
    |-- workflow.md              # This file
    `-- spec.html                # Extended specification
```

## Build Commands
```bash
# Build a presentation from JSON data
node build.js [data-file] [output-file]
node build.js

# Build the component catalog
node build-catalog.js
```

## How to Create a New Slide Deck
1. Copy `src/data/sample-slides.json` and rename it.
2. Edit the JSON metadata and slide array.
3. Run `node build.js src/data/your-file.json output/templates/your-output.html`.
4. Open the generated HTML in a browser.

## Slide Types
| Type | JSON `type` | Description |
|------|-------------|-------------|
| Title | `title` | Hero slide with heading, subtitle, and badge |
| Bullets | `bullets` | Expandable bullet list |
| Accordion | `accordion` | Collapsible sections with optional code |
| Tabs | `tabs` | Tabbed content panels |
| Stepper | `stepper` | Step-by-step walkthrough |
| Cards | `cards` | Flip cards |
| Quiz | `quiz` | Multiple choice with instant feedback |
| Compare | `compare` | Side-by-side comparison |
| Timeline | `timeline` | Chronological events |
| Summary | `summary` | Takeaways, CTA, and resource links |

## Themes
The active theme system is driven by `data-theme` tokens in CSS and controlled by `src/js/sidebar.js`.

## Adding New CSS Styles
1. Edit the matching file under `src/css/blocks/` or one of the shared CSS files.
2. Rebuild with `node build.js` and/or `node build-catalog.js`.
3. Verify the generated HTML output, since all CSS is inlined at build time.

## Adding New Block Types
1. Add the HTML rendering logic in `src/js/renderer.js`.
2. Add styles in the matching file under `src/css/blocks/`.
3. Add behavior in the matching JS module such as `src/js/blocks-core.js` or `src/js/blocks-data.js`.
4. If a new block module is introduced, wire it from `src/js/blocks.js`.
5. Add a sample to `src/data/sample-slides.json`.
6. Add a preview card in `build-catalog.js`.
7. Rebuild both outputs.

## Navigation Controls
- Keyboard: Arrow keys, Space, Home, End
- Touch: Swipe left and right
- Buttons: Prev/Next navigation buttons
- Speaker notes: Toggle with the Notes button
