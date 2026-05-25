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

## 📂 Codebase Architecture

```plaintext
html-slides-templates/
├── src/
│   ├── css/
│   │   ├── variables.css      # Core OKLCH color systems, typography, & tokens
│   │   ├── base.css           # Structural layout, slide trackers, viewport, print rules
│   │   ├── blocks.css         # Styling for all 14 interactive slide blocks
│   │   ├── animations.css     # Transitions, slide-enters, fade-ups, spotlights
│   │   └── sidebar.css        # Settings gear panel, sidebar tab grids, & picker styling
│   ├── js/
│   │   ├── engine.js          # Swipe guestures, keyboard keys, slide trackers, elements cache
│   │   ├── blocks.js          # High-performance event delegation, SVG charts, retryable quiz
│   │   ├── sidebar.js         # Notes mapped by Slide ID, timer, student picker, OS theme detection
│   │   ├── renderer.js        # Server-side HTML templating engine for JSON blocks (XSS protected)
│   │   └── themes.js          # Config delegators for color property overrides
│   ├── data/
│   │   ├── sample-slides.json # Interactive Introduction to Web Development data
│   │   ├── sample2-slides.json# Visual Aesthetics & OKLCH color lesson data
│   │   ├── sample3-slides.json# Advanced System Performance & Caching data
│   │   └── sample4-slides.json# Comprehensive Interactive Block showcase data
│   ├── favicon.JPG            # Local JPEG logo compiled as base64 asset
│   └── emulator/              # Device simulations, layout containers, responsive overlays
├── output/
│   └── templates/
│       ├── sample1.html       # Standalone output slide deck 1
│       ├── sample2.html       # Standalone output slide deck 2
│       ├── sample3.html       # Standalone output slide deck 3
│       ├── sample4.html       # Standalone output slide deck 4
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
    "students": ["An", "Bình", "Châu", "Dương", "Giang", "Hương"]
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
- `Right Arrow` or `Space` or `Page Down` ➔ **Next Slide**
- `Left Arrow` or `Page Up` ➔ **Previous Slide**
- `T` ➔ Toggle the **Teaching Sidebar Panel**
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