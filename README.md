# 🧑‍🏫 Lecta AI — Interactive Presentation Engine & Component Library

> A next-generation, local-first web presentation engine designed for teachers, workshop speakers, and tech trainers. Create gorgeous, dynamic, highly interactive presentations completely from modular JSON files leveraging a Primitive-Based Architecture, rendered dynamically via Client-Side Rendering (CSR) into single self-contained HTML files with embedded favicons, and control them with an integrated suite of presenter tools.

---

## 🌟 Key Pillars & Features

### 1. Dynamic Client-Side Rendering (CSR) & Modular Architecture
Instead of static build-time HTML generation, Lecta AI employs dynamic Client-Side Rendering (CSR) to construct the DOM upon page load. This significantly reduces the size of generated HTML files by eliminating redundant UI component markup.
- **Primitive-Based Architecture:** Uses `$ref` pointers in JSON configurations to share common patterns, reducing JSON file size by 30-50% while maintaining a highly modular, reusable component system.
- **Embedded Base64 Favicon:** The build script automatically reads the local `src/favicon.JPG` asset and encodes it directly as an inline data-URI link inside the compiled HTML `<head>`.
- **Zero Dependencies:** No heavy frameworks, and **zero runtime dependencies**. The build system bundles modular CSS and JS components directly into highly optimized, fully standalone single-file HTML decks.

### 2. Premium Interactive Blocks
Lecta AI packs interactive learning blocks mapped through clean JSON templates:
- 🎬 **Title Block:** Gorgeous landing headers with custom timing badges.
- 📌 **Expandable Bullets:** Progressive disclosure cards that open details on click.
- 📚 **Accordion Block:** Clean collapsible layouts for structured Q&A.
- 🗂 **Tabs Block:** Organize perspectives, code snippets, or features with smooth transition fades.
- 🚶 **Stepper Block:** Linear workflows with active tracking progress and smart tips.
- 🃏 **Flip Cards:** Interactive flashcards perfect for visual glossary lookups.
- ❓ **Retryable Quiz Block:** Self-correcting interactive choices with visual color highlights and instant explanations. 
- ⚔️ **Comparison Block:** Side-by-side blue and green color-coded contrast grids.
- 📅 **Timeline Block:** Smooth progressive year-by-year historical trails.
- 🎓 **Summary & CTA:** Wrap-up grids with clickable action buttons and external resource badges.
- 🖼️ **Interactive Image Block:** Elegant content images featuring an inline customization overlay.
- 📊 **Interactive SVGs & Charts:** Dynamic SVG Bar, Line, and Donut charts.
- 🧮 **Filterable & Sortable Tables:** Premium responsive data tables with dynamic live search filtering.
- 🌿 **Interactive Flowcharts/Mindmaps:** Render custom nodes and connections dynamically with bezier link paths (now featuring a cleaner aesthetic with removed arrow markers).
- 🧩 **Additional Blocks:** Splash, Checklist, Analogy, Definition Card, Quote Card, Code Diff, Stats, and Horizontal Timeline (`new-blocks.css`).

### 3. Integrated Presenter Sidebar (Teaching Panel)
Activate a dedicated sidebar designed specifically for live presentation control:
- 📋 **Visual Overview:** Real-time thumbnail navigations for quick section jumps.
- ⏱️ **Presentation Timer:** Stopwatch tracking with built-in pacing calculators based on slide ratios.
- 📝 **Live Speaker Notes:** Auto-saved markdown textareas mapped to the unique **Slide ID**.
- 🔦 **Spotlight Visualizer & Laser Pointer:** Mouse-tracking glowing particle halo to draw eyes to key elements and dim backgrounds.
- 🔒 **Blank Screen Freezer:** Lock slides to pitch-black or surface-colored screens instantly to pull focus back to the speaker.
- 🎲 **Snappy Student Picker:** High-speed visual randomizer to select students from custom JSON datasets.
- 💬 **Q&A Drawer:** Integrated collection inputs to hold interactive questions from students.
- 🎬 **Lesson Studio & Slide Health:** (`lesson-studio.js`, `slide-health.js`) Track slide narration checkpoints, context saving, step guidance, and slide health diagnostics.
- 🔍 **Spotlight Search (Ctrl+K):** (`spotlight-search.js`) Full-text command palette to quickly jump to specific slides or blocks.

### 4. Advanced OKLCH Styling & Curated Themes
Lecta AI leverages modern CSS-based relative color interpolation (`color-mix` inside `oklch`) to deliver uniform contrast ratios across light and dark spectrums. 

#### ☀️ Light Themes (Responsive Glassmorphism)
Ocean, Forest, Berry, Slate, Paper, Nordic, Sunset.

#### 🌙 Dark Themes (Sleek Contrast & Neon Highlights)
Neon, Midnight Tech, Evergreen Nature, Volcano Ignite.

### 5. High-Fidelity Print & PDF Styles
Export clean offline handouts of your presentations effortlessly! Standard CSS print media queries are preconfigured to structure exactly **one slide per page** while stripping out UI clutter.

---

## 📂 Codebase Architecture

```plaintext
html-slides-templates/
├── src/
│   ├── css/
│   │   ├── variables.css      # Core OKLCH color systems, typography, & tokens
│   │   ├── base.css           # Structural layout, slide trackers, viewport, print rules
│   │   ├── blocks/
│   │   │   ├── core.css       # Core interactive blocks: accordion, tabs, cards, quiz
│   │   │   ├── data.css       # Data/media blocks: charts, tables, flow, split
│   │   │   ├── new-blocks.css # Newer extended blocks (stats, code-diff, analogy, etc.)
│   │   │   ├── overlays.css   # Overlay UI: advanced quiz modal, drawing, search palette
│   │   │   └── presenter.css  # Presenter notes, dashboard, video/presenter-specific UI
│   │   ├── animations.css     # Transitions, slide-enters, fade-ups, spotlights
│   │   └── sidebar.css        # Settings gear panel, sidebar tab grids, & picker styling
│   ├── js/
│   │   ├── engine.js          # Swipe guestures, keyboard keys, slide trackers, elements cache
│   │   ├── blocks-core.js     # Core interactive block behaviors
│   │   ├── blocks-data.js     # Charts, tables, bento, flow interactions
│   │   ├── renderer.js        # Client-Side HTML templating engine for JSON blocks
│   │   ├── lesson-studio.js   # Context configurations, recording checkpoints
│   │   ├── slide-health.js    # Slide validation and pacing diagnostics
│   │   ├── spotlight-search.js# Ctrl+K global search palette
│   │   ├── presenter-overlay.js# Drawing overlays and specific presentation aids
│   │   ├── lazy-loaders.js    # On-demand KaTeX, Mermaid, Prism bootstrapping
│   │   ├── blocks.js          # Orchestrator wiring modular block systems together
│   │   ├── sidebar.js         # Notes mapped by Slide ID, timer, student picker
│   │   └── themes.js          # Small compatibility stubs for notes/theme-related UI
│   ├── build/
│   │   ├── assets.js          # Shared asset lists for build scripts
│   │   ├── fonts.js           # Font metadata and utilities
│   │   ├── themes.js          # Theme metadata for build scripts
│   │   └── utils.js           # Shared helpers for build scripts
│   ├── data/
│   │   ├── primitives.json    # Shared reusable JSON objects ($ref expansions)
│   │   ├── template-library.json # UI catalog configuration for drag-and-drop/reuse
│   │   ├── sample-slides.json # -> sample10-slides.json: Slide deck configurations
│   ├── fonts/                 # Local font assets
│   ├── favicon.JPG            # Local JPEG logo compiled as base64 asset
│   └── emulator/              # Device simulations, layout containers, responsive overlays
├── output/
│   └── templates/
│       ├── sample1.html       # Standalone output slide deck 1
│       ├── ...                # Samples 2 through 9
│       ├── sample10.html      # Standalone output slide deck 10
│       └── all-designs.html   # Complete UI Catalog containing all interactive blocks
├── build.js                   # Programmatic compiler with schema validation and CSR packaging
├── build-catalog.js           # Reference catalog builder
├── LICENSE                    # open source licensing agreement
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine (version 16 or newer recommended).

### 🛠️ Step 1: Run the Complete Build Suite
Compile both slide presentations and the full UI Catalog in one single, high-speed command:
```bash
node build.js
```
This generates production-ready files inside `output/templates/`, compiling all `sample[1-10].html` files along with `all-designs.html`.

### ⚙️ Step 2: Compile a Custom Slide Deck
Want to build your own custom deck? Simply run `build.js` with your custom data JSON path and target output HTML path:
```bash
node build.js path/to/your-slides.json output/templates/your-deck.html
```

---

## 📝 Creating Custom Slides (JSON Format)

Every presentation consists of a `meta` configuration block and a list of `slides`. Here is a quick template demonstrating the modular data structure leveraging `$ref` pointers:

```json
{
  "meta": {
    "title": "Your Lesson Title",
    "theme": "sunset",
    "duration": 45
  },
  "slides": [
    {
      "id": "slide-intro",
      "type": "title",
      "data": {
        "heading": "Welcome to the Lesson",
        "subtitle": "Discover interactive slides styled completely in OKLCH",
        "badge": "Intro · 5 min"
      }
    },
    {
      "id": "slide-quiz",
      "$ref": "primitive-quiz-block",
      "data": {
        "heading": "Knowledge Check",
        "questions": [
          {
            "question": "Which CSS color space ensures uniform perceptual brightness?",
            "options": ["RGB", "HEX", "HSL", "OKLCH"],
            "correct": 3
          }
        ]
      }
    }
  ]
}
```
*Note: Make sure to define base primitive structures in `primitives.json` to leverage `$ref` expansion and reduce redundancy.*

---

## ⌨️ Presentation Keyboard Shortcuts

While presenting, use these built-in hotkeys to navigate effortlessly:
- `Right Arrow` or `Space` ➔ **Next Slide**
- `Left Arrow` ➔ **Previous Slide**
- `D` ➔ Toggle **Scribble Drawing Annotation Overlay**
- `Ctrl+K` ➔ Toggle **Spotlight Search Command Palette**
- `T` ➔ Toggle the **Teaching Sidebar Panel** (Inside sidebar mode)
- `N` ➔ Toggle **Live Speaker Notes Popup**
- `F` ➔ Toggle **Fullscreen Mode**

---

*Built with passion for next-generation interactive web training. Lecta AI · 2026.*
