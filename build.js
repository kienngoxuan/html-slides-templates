#!/usr/bin/env node
/**
 * LECTA AI — Build Script
 * Assembles modular CSS/JS/data into a single self-contained HTML file.
 *
 * Usage: node build.js [data-file] [output-file]
 * Default: node build.js src/data/sample-slides.json output/templates/sample1.html
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Parse args
const dataFile = process.argv[2] || path.join(ROOT, 'src/data/sample-slides.json');
const outputFile = process.argv[3] || path.join(ROOT, 'output/templates/sample1.html');

// Read all source files
function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf-8');
}

// Read data
const slideData = JSON.parse(read(dataFile.replace(ROOT + '/', '').replace(ROOT, '') || dataFile));
const meta = slideData.meta;

// Read CSS
const cssVariables = read('src/css/variables.css');
const cssBase = read('src/css/base.css');
const cssBlocks = read('src/css/blocks.css');
const cssAnimations = read('src/css/animations.css');
const allCSS = [cssVariables, cssBase, cssBlocks, cssAnimations].join('\n\n');

// Read JS
const jsEngine = read('src/js/engine.js');
const jsBlocks = read('src/js/blocks.js');
const jsThemes = read('src/js/themes.js');

// Import renderer
const { renderSlideHTML } = require('./src/js/renderer.js');

// Render all slides
const slidesHTML = slideData.slides.map(s => renderSlideHTML(s)).join('\n');

// Theme dots
const themes = ['ocean', 'forest', 'berry', 'slate', 'neon', 'paper', 'nordic', 'sunset'];
const themeDots = themes.map(t =>
  `<div class="theme-dot${t === (meta.theme || 'ocean') ? ' active' : ''}" data-theme="${t}" title="${t}"></div>`
).join('\n        ');

// Assemble final HTML
const html = `<!DOCTYPE html>
<html lang="en" data-theme="${meta.theme || 'ocean'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${meta.subtitle || 'Interactive slide deck built with Lecta AI'}">
  <title>${meta.title || 'Lecta AI Presentation'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
${allCSS}
  </style>
</head>
<body>
  <!-- Progress Bar -->
  <div class="nav-progress" style="width: 10%"></div>

  <!-- Theme Switcher -->
  <div class="theme-switcher">
    ${themeDots}
  </div>

  <!-- Presenter Toggle -->
  <div class="presenter-toggle">
    <button class="toggle-btn toggle-notes">📝 Notes</button>
  </div>

  <!-- Slides Viewport -->
  <div class="slides-viewport">
    <div class="slides-track">
${slidesHTML}
    </div>
  </div>

  <!-- Speaker Notes Panel -->
  <div class="speaker-notes-panel">
    <h4>Speaker Notes</h4>
    <p></p>
  </div>

  <!-- Navigation Bar -->
  <nav class="nav-bar">
    <button class="nav-btn prev" disabled>← Prev</button>
    <div class="nav-center">
      <span class="nav-counter">1 / ${slideData.slides.length}</span>
    </div>
    <button class="nav-btn next">Next →</button>
  </nav>

  <script>
${jsEngine}

${jsBlocks}

${jsThemes}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  ThemeSwitcher.init();
  SlideEngine.init();
  InteractiveBlocks.init();
  SpeakerNotes.init();
});
  </script>
</body>
</html>`;

// Ensure output directory exists
const outDir = path.dirname(outputFile);
fs.mkdirSync(outDir, { recursive: true });

// Write output
fs.writeFileSync(outputFile, html, 'utf-8');
const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
console.log(`✅ Built successfully: ${outputFile}`);
console.log(`   Slides: ${slideData.slides.length}`);
console.log(`   Theme: ${meta.theme}`);
console.log(`   Size: ${sizeKB} KB`);
