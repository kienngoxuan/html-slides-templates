# Lecta AI — Development Workflow

## Overview
Lecta AI is a self-contained interactive slide builder. Source code is modular; a Node.js build script assembles everything into standalone HTML files that can be opened directly in any browser — no server required.

## Project Structure
```
html-slides-templates/
├── build.js                 # Builds presentation HTML from JSON data
├── build-catalog.js         # Builds all-designs.html component catalog
├── src/
│   ├── data/
│   │   └── sample-slides.json   # Slide deck content (JSON)
│   ├── css/
│   │   ├── variables.css        # OKLCH theme tokens (8 themes)
│   │   ├── base.css             # Reset, layout, navigation
│   │   ├── blocks.css           # Interactive block styles
│   │   └── animations.css       # Keyframes & transitions
│   ├── js/
│   │   ├── engine.js            # Slide navigation (keyboard/touch/buttons)
│   │   ├── blocks.js            # Interactive block logic
│   │   ├── themes.js            # Theme switcher + speaker notes
│   │   └── renderer.js          # JSON → HTML converter (Node.js)
│   └── catalog/
│       └── catalog-css.css      # Catalog-specific layout styles
├── output/
│   └── templates/
│       ├── sample1.html         # Generated presentation
│       └── all-designs.html     # Component design catalog
└── docs/
    ├── workflow.md              # This file
    └── spec.html                # Extended specification
```

## Build Commands
```bash
# Build a presentation from JSON data
node build.js [data-file] [output-file]
node build.js   # defaults: src/data/sample-slides.json → output/templates/sample1.html

# Build the component catalog
node build-catalog.js   # → output/templates/all-designs.html
```

## How to Create a New Slide Deck
1. Copy `src/data/sample-slides.json` and rename it
2. Edit the JSON — change meta (title, theme, duration) and slides array
3. Run `node build.js src/data/your-file.json output/templates/your-output.html`
4. Open the output HTML directly in browser

## Slide Types (Block Types)
| Type       | JSON `type` | Description                                |
|------------|-------------|--------------------------------------------|
| Title      | `title`     | Hero slide with heading + subtitle + badge |
| Bullets    | `bullets`   | Expandable bullet list (click to reveal)   |
| Accordion  | `accordion` | Collapsible sections with code examples    |
| Tabs       | `tabs`      | Tabbed content with features + code        |
| Stepper    | `stepper`   | Step-by-step walkthrough with tips         |
| Cards      | `cards`     | 3D flip cards (front/back)                 |
| Quiz       | `quiz`      | Multiple choice with instant feedback      |
| Compare    | `compare`   | Side-by-side A vs B comparison             |
| Timeline   | `timeline`  | Click-to-expand chronological events       |
| Summary    | `summary`   | Key takeaways + CTA + resource links       |

## Themes (8 OKLCH Color Systems)
| Theme   | Style                          | Best For            |
|---------|--------------------------------|---------------------|
| ocean   | Navy + cyan + warm accent      | Academic lectures   |
| forest  | Green + olive + brick          | Workshops           |
| berry   | Berry red + pink + gold        | Sales pitches       |
| slate   | Dark gray + amber              | Corporate           |
| neon    | Electric purple + teal (dark)  | Creative / agency   |
| paper   | Warm brown + cream             | Traditional edu     |
| nordic  | Cool blue-gray + sage          | Minimal / modern    |
| sunset  | Terracotta + orange + blue     | Training / internal |

## Adding New CSS Styles
1. Edit the appropriate file in `src/css/`
2. Rebuild with `node build.js` and/or `node build-catalog.js`
3. All CSS is inlined in the output — no external dependencies

## Adding New Block Types
1. Add the HTML rendering logic in `src/js/renderer.js` (new case in switch)
2. Add styles in `src/css/blocks.css`
3. Add JS interaction logic in `src/js/blocks.js`
4. Add a sample in `src/data/sample-slides.json`
5. Add a preview card in `build-catalog.js`
6. Rebuild both outputs

## Navigation Controls
- **Keyboard**: Arrow keys, Space, Home, End
- **Touch**: Swipe left/right
- **Buttons**: Prev/Next in nav bar
- **Speaker Notes**: Toggle with 📝 Notes button
