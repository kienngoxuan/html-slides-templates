# 🧑‍🏫 Lecta AI — Interactive Presentation Engine & Component Library

> A next-generation, local-first web presentation engine designed for teachers, workshop speakers, and tech trainers. Create gorgeous, dynamic, highly interactive presentations completely from simple JSON files, compile into single self-contained HTML files with embedded favicons, and control them with an integrated suite of presenter tools.

---

## 🌟 Key Pillars & Features

### 1. Zero Dependencies & Local-First Compilation
No bundlers, no heavy frameworks, and **zero runtime dependencies**. The build system bundles modular CSS and JS components directly into highly optimized, fully standalone, and offline-capable single-file HTML decks. 

- **Embedded Base64 Favicon:** The build script automatically reads the local `src/favicon.JPG` asset and encodes it directly as an inline data-URI link inside the compiled HTML `<head>`. This ensures the slide deck remains 100% self-contained with no external folder paths or image references to worry about.
- **Lightweight JSON Schema Validation:** Built-in validator checks your JSON configuration before compilation, instantly reporting syntax errors, missing fields, or incorrect structural properties (e.g., mismatched correct answers, array mismatches) directly to the console.

### 2. 14 Premium Interactive Blocks
Instead of static text bullet points, Lecta AI packs interactive learning blocks:
- 🎬 **Title Block:** Gorgeous landing headers with custom timing badges.
- 📌 **Expandable Bullets:** Progressive disclosure cards that open details on click.
- 📚 **Accordion Block:** Clean collapsible layouts for structured Q&A.
- 🗂 **Tabs Block:** Organize perspectives, code snippets, or features with smooth transition fades.
- 🚶 **Stepper Block:** Linear workflows with active tracking progress and smart tips.
- 🃏 **Flip Cards:** Interactive flashcards perfect for visual glossary lookups.
- ❓ **Retryable Quiz Block:** Self-correcting interactive choices with visual color highlights and instant explanations. Selecting a wrong option gives immediate feedback but does **not** lock the question, enabling students to learn through trial-and-error until they select the correct answer (which locks the question).
- ⚔️ **Comparison Block:** Side-by-side blue and green color-coded contrast grids.
- 📅 **Timeline Block:** Smooth progressive year-by-year historical trails.
- 🎓 **Summary & CTA:** Wrap-up grids with clickable action buttons and external resource badges.
- 🖼️ **Interactive Image Block:** Elegant content images featuring an inline customization overlay—letting you paste any Unsplash/web URL and persist changes automatically across session reloads.
- 📊 **Interactive SVGs & Charts:** Dynamic SVG Bar, Line, and Donut charts complete with entry animations, interactive legends to toggle dataset visibilities, and hover-triggered Canva-style data tooltips.
- 🧮 **Filterable & Sortable Tables:** Premium responsive data tables with column-based ascending/descending sorting and dynamic live search filtering.
- 🌿 **Interactive Flowcharts/Mindmaps:** Render custom nodes and connections dynamically with bezier link paths and auto-fitting text sizes. Clicking any node updates a glassmorphic sidebar panel with deep details.

### 3. Integrated Presenter Sidebar (Teaching Panel)
Activate a dedicated sidebar designed specifically for live presentation control:
- 📋 **Visual Overview:** Real-time thumbnail navigations for quick section jumps.
- ⏱️ **Presentation Timer:** Stopwatch tracking with built-in pacing calculators based on slide ratios.
- 📝 **Live Speaker Notes:** Auto-saved markdown textareas mapped to the unique **Slide ID** (preserving your notes across layout changes instead of relative list indexes).
- 🔦 **Spotlight Visualizer:** Dim out background slides to spotlight a key heading or statement.
- 🎯 **Laser Pointer:** Mouse-tracking glowing particle halo to draw eyes to key elements.
- 🔒 **Blank Screen Freezer:** Lock slides to pitch-black or surface-colored screens instantly to pull focus back to the speaker.
- 🎲 **Snappy Student Picker:** High-speed visual randomizer to select students from custom JSON datasets dynamically serialized from `meta.students`.
- 💬 **Q&A Drawer:** Integrated collection inputs to hold interactive questions from students.

### 4. Advanced OKLCH Styling & 11 Curated Themes
Lecta AI leverages modern CSS-based relative color interpolation and color mix calculations (`color-mix` inside `oklch`) to deliver uniform contrast ratios across light and dark spectrums. It automatically respects light/dark OS preferences (`prefers-color-scheme`) as a default behavior while still honoring saved selections.

#### ☀️ Light Themes (Responsive Glassmorphism)
- **Ocean:** Deep blues and teal highlights.
- **Forest:** Moss and emerald greens.
- **Berry:** Luxurious purples and vibrant pink accents.
- **Slate:** Minimalist technical steel grays.
- **Paper:** Organic, high-contrast newsprint texture.
- **Nordic:** Cold frosted-glass grays and winter sky blues.
- **Sunset:** Radiant warm corals and evening oranges.

#### 🌙 Dark Themes (Sleek Contrast & Neon Highlights)
- **Neon:** Default deep cybernetic purple and electric indigo.
- **Midnight Tech:** Deep oceanic blue-black and luminous cyan.
- **Evergreen Nature:** Charcoal base and fresh mint-emerald accents.
- **Volcano Ignite:** Dark volcanic ash grays and high-temperature fire corals.

### 5. High-Fidelity Print & PDF Styles
Export clean offline handouts of your presentations effortlessly! Standard CSS print media queries are preconfigured to structure exactly **one slide per page** while stripping out UI clutter (such as presentation trackers, settings gears, tool overlays, and navigation sidebars) for clean offline PDF exports.

---

## 🔮 Future Roadmap (Features that can be added)

### 🎯 Classroom Presenter Features
| Feature | Description | Complexity |
| :--- | :--- | :--- |
| **Drawing/Annotation Overlay** | Canvas drawing layer to draw with pens, highlighters, and erasers directly onto slides (like PowerPoint). | Medium |
| **Presenter View on 2nd Screen** | Opens a separate dual-monitor panel: one window displays the presentation, and the other shows speaker notes + timer + next slide. | High |
| **QR Code for Live Q&A** | Generates a QR code in the sidebar so audience members can submit questions from their phones (serverless, using polling or WebRTC). | Medium |
| **Advanced Laser Pointer** | Enhanced cursor trailing particles, color switching, and spotlight follow effect. | Low |
| **Auto-play / Rehearse Timer** | Set slide duration in JSON, automatically advancing or flashing warning indicators when overtime. | Medium |
| **Full-text Slide Search (Ctrl+K)** | Search through the text content of the entire presentation and jump directly to slides. | Low |

### 🎨 New Content Block Features
| Feature | Description |
| :--- | :--- |
| **MathJax / KaTeX Block** | Renders mathematical equations from JSON format. |
| **Mermaid Diagram Block** | Embeds Mermaid.js diagrams (flowcharts, sequence flows, Gantt charts) via markdown text. |
| **Video Embed Block** | Native support for YouTube, Vimeo, and local MP4 players with custom posters. |
| **Syntax Highlighting** | Integrated code colorization libraries (Prism.js / Shiki). |
| **Two-Column Layout Block** | Split-screen structures dividing slides into two parallel content columns (text + media/code). |

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
│   │   │   ├── data.css       # Data/media blocks: charts, tables, flow, split, mermaid
│   │   │   ├── overlays.css   # Overlay UI: advanced quiz modal, drawing, search palette
│   │   │   └── presenter.css  # Presenter notes, dashboard, video/presenter-specific UI
│   │   ├── animations.css     # Transitions, slide-enters, fade-ups, spotlights
│   │   └── sidebar.css        # Settings gear panel, sidebar tab grids, & picker styling
│   ├── js/
│   │   ├── engine.js          # Swipe guestures, keyboard keys, slide trackers, elements cache
│   │   ├── blocks-core.js     # Core interactive block behaviors
│   │   ├── blocks-data.js     # Charts, tables, bento, flow interactions
│   │   ├── lazy-loaders.js    # On-demand KaTeX, Mermaid, Prism bootstrapping
│   │   ├── blocks.js          # Orchestrator wiring modular block systems together
│   │   ├── sidebar.js         # Notes mapped by Slide ID, timer, student picker, OS theme detection
│   │   ├── renderer.js        # Server-side HTML templating engine for JSON blocks (XSS protected)
│   │   └── themes.js          # Small compatibility stubs for notes/theme-related UI
│   ├── build/
│   │   ├── assets.js           # Shared asset lists for build scripts
│   │   ├── themes.js           # Theme metadata for build scripts
│   │   └── utils.js            # Shared helpers for build scripts
│   ├── data/
│   │   ├── sample-slides.json # Interactive Introduction to Web Development data
│   │   ├── sample2-slides.json# Visual Aesthetics & OKLCH color lesson data
│   │   ├── sample3-slides.json# Advanced System Performance & Caching data
│   │   ├── sample4-slides.json# Comprehensive Interactive Block showcase data
│   │   └── sample5-slides.json# Next-Gen Advanced Block & P2P Presentation keynote data
│   ├── favicon.JPG            # Local JPEG logo compiled as base64 asset
│   └── emulator/              # Device simulations, layout containers, responsive overlays
├── output/
│   └── templates/
│       ├── sample1.html       # Standalone output slide deck 1
│       ├── sample2.html       # Standalone output slide deck 2
│       ├── sample3.html       # Standalone output slide deck 3
│       ├── sample4.html       # Standalone output slide deck 4
│       ├── sample5.html       # Standalone output slide deck 5 (Next-Gen Keynote)
│       └── all-designs.html   # Complete UI Catalog containing all interactive blocks
├── build.js                   # Programmatic compiler with schema validation
├── build-catalog.js           # Reference catalog builder
├── LICENSE                    # open source licensing agreement
└── README.md                  # This file (Updated)
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
This generates the following production-ready files inside `output/templates/`:
- **`sample1.html`:** The comprehensive introductory presentation.
- **`sample2.html`:** The visual design masterclass with the custom interactive Sunset theme and Image Paste blocks.
- **`sample3.html`:** The performance and system caching deck.
- **`sample4.html`:** The interactive block showcase presentation.
- **`sample5.html`:** The next-gen keynote showcase featuring math equations, Mermaid.js flowcharts, YouTube media embedding, split layouts, and offline presenter view channels.
- **`all-designs.html`:** The master component catalog containing interactive previews of all buttons, forms, tables, badging, and blocks in a fully reactive grid.

### ⚙️ Step 2: Compile a Custom Slide Deck
Want to build your own custom deck? Simply run `build.js` with your custom data JSON path and target output HTML path:
```bash
node build.js path/to/your-slides.json output/templates/your-deck.html
```

---

## 📝 Creating Custom Slides (JSON Format)

Every presentation consists of a `meta` configuration block and a list of `slides`. Here is a quick template demonstrating the lightweight data structure:

```json
{
  "meta": {
    "title": "Your Lesson Title",
    "subtitle": "Accessible Visual Aesthetics",
    "theme": "sunset",
    "duration": 45,
    "students": ["Alex", "Ben", "Charlie", "Diana", "Emily", "Frank"]
  },
  "slides": [
    {
      "id": "slide-intro",
      "type": "title",
      "data": {
        "heading": "Welcome to the Lesson",
        "subtitle": "Discover interactive slides styled completely in OKLCH",
        "badge": "Intro · 5 min",
        "speakerNotes": "Keep your introduction punchy. Explain the core goals."
      }
    },
    {
      "id": "slide-quiz-1",
      "type": "quiz",
      "data": {
        "heading": "Knowledge Check",
        "icon": "❓",
        "questions": [
          {
            "question": "Which CSS color space ensures uniform perceptual brightness?",
            "options": ["RGB", "HEX", "HSL", "OKLCH"],
            "correct": 3,
            "explanation": "OKLCH aligns colors to how the human eye perceives brightness!"
          }
        ]
      }
    }
  ]
}
```

---

## ⌨️ Presentation Keyboard Shortcuts

While presenting, use these built-in hotkeys to navigate effortlessly:
- `Right Arrow` or `Space` ➔ **Next Slide**
- `Left Arrow` ➔ **Previous Slide**
- `D` ➔ Toggle **Scribble Drawing Annotation Overlay**
- `Ctrl+K` ➔ Toggle **Spotlight Search Command Palette**
- `P` ➔ Launch **Dual-Monitor Offline Presenter Console Window**
- `T` ➔ Toggle the **Teaching Sidebar Panel** (Inside sidebar mode)
- `N` ➔ Toggle **Live Speaker Notes Popup**
- `F` ➔ Toggle **Fullscreen Mode**

---

## 🎨 Under the Hood: OKLCH & Cross-Browser Color Mixes
Lecta AI utilizes cross-browser `color-mix` functions to scale opacity levels safely, avoiding absolute color transparency clipping on legacy platforms:
```css
/* Generates safe visual overlays on accordion, quiz alerts, and hover highlights */
background: color-mix(in oklch, var(--color-success) 12%, var(--color-bg));
border-color: color-mix(in oklch, var(--color-primary) 30%, var(--color-bg));
```
All interactive components automatically adapt color schemes seamlessly when you choose any of the 11 light or dark modes in the Appearance settings drawer.

---
*Built with passion for next-generation interactive web training. Lecta AI · 2026.*
