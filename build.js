#!/usr/bin/env node
/**
 * LECTA AI — Build Script
 * Assembles modular CSS/JS/data into a single self-contained HTML file.
 */

const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf-8'); }

// Assembles a specific JSON file into a target HTML file
function buildSlideDeck(dataFile, outputFile) {
  const slideData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  const meta = slideData.meta;

  // CSS
  const allCSS = [
    read('src/css/variables.css'),
    read('src/css/base.css'),
    read('src/css/blocks.css'),
    read('src/css/animations.css'),
    read('src/css/sidebar.css'),
  ].join('\n\n');

  // JS
  const jsEngine  = read('src/js/engine.js');
  const jsBlocks  = read('src/js/blocks.js');
  const jsThemes  = read('src/js/themes.js');
  const jsSidebar = read('src/js/sidebar.js');

  // Slides HTML
  const { renderSlideHTML } = require('./src/js/renderer.js');
  const slidesHTML = slideData.slides.map(s => renderSlideHTML(s)).join('\n');

  // Build overview thumbnails for sidebar
  const TYPES = { title:'🎬', bullets:'📌', accordion:'📚', tabs:'🗂', stepper:'🚶', cards:'🃏', quiz:'❓', compare:'⚔️', timeline:'📅', summary:'🎓', image:'🖼️' };
  const thumbsHTML = slideData.slides.map((s, i) => `
    <div class="slide-thumb${i === 0 ? ' active' : ''}" data-slide="${i}">
      <span class="slide-thumb-num">${i + 1}</span>
      <div class="slide-thumb-info">
        <div class="slide-thumb-title">${s.data.heading || s.data.title || 'Slide ' + (i+1)}</div>
        <div class="slide-thumb-type">${TYPES[s.type] || '📄'} ${s.type}</div>
      </div>
    </div>`).join('');

  // Light themes for gear panel
  const LIGHT_THEMES = [
    { id:'ocean', label:'Ocean' },
    { id:'forest', label:'Forest' },
    { id:'berry', label:'Berry' },
    { id:'slate', label:'Slate' },
    { id:'paper', label:'Paper' },
    { id:'nordic', label:'Nordic' },
    { id:'sunset', label:'Sunset' },
  ];
  const lightThemeDotItems = LIGHT_THEMES.map(t =>
    `<div class="theme-dot-item${meta.theme === t.id ? ' active' : ''}" data-theme="${t.id}">
      <div class="dot" data-theme="${t.id}"></div>
      <span>${t.label}</span>
    </div>`).join('');

  // Dark themes for gear panel
  const DARK_THEMES = [
    { id:'neon', label:'Neon' },
    { id:'midnight', label:'Midnight' },
    { id:'evergreen', label:'Evergreen' },
    { id:'volcano', label:'Volcano' },
  ];
  const darkThemeDotItems = DARK_THEMES.map(t =>
    `<div class="theme-dot-item" data-theme="${t.id}">
      <div class="dot" data-theme="${t.id}"></div>
      <span>${t.label}</span>
    </div>`).join('');

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
  <style>${allCSS}</style>
</head>
<body>
  <!-- Progress Bar -->
  <div class="nav-progress" style="width:${Math.round(100/slideData.slides.length)}%"></div>

  <!-- ⚙️ GEAR BUTTON -->
  <button class="gear-btn" aria-label="Settings">⚙️</button>

  <!-- SETTINGS PANEL -->
  <div class="settings-panel">
    <div class="settings-section">
      <div class="settings-label">Appearance</div>
      <div class="mode-toggle">
        <button class="mode-btn active" data-mode="light">☀️ Light</button>
        <button class="mode-btn" data-mode="dark">🌙 Dark</button>
      </div>
    </div>
    <div class="settings-section light-theme-dots">
      <div class="settings-label">Light Theme</div>
      <div class="theme-dots-grid">${lightThemeDotItems}</div>
    </div>
    <div class="settings-section dark-theme-dots" style="display: none;">
      <div class="settings-label">Dark Theme</div>
      <div class="theme-dots-grid">${darkThemeDotItems}</div>
    </div>
    <div class="settings-section">
      <div class="settings-label">View</div>
      <button class="fullscreen-btn">⛶ Fullscreen</button>
    </div>
    <div class="settings-section">
      <div class="settings-label">Teaching Panel</div>
      <button class="sidebar-toggle-btn">▶ Teaching Panel</button>
    </div>
  </div>

  <!-- Notes Toggle (top-left) -->
  <div class="presenter-toggle">
    <button class="toggle-btn toggle-notes">📝 Notes</button>
  </div>

  <!-- SPEAKER NOTES (POPUP) -->
  <div class="speaker-notes-panel">
    <h4>📝 Presenter Notes</h4>
    <p>No speaker notes for this slide.</p>
  </div>

  <!-- PRESENTATION CONTAINER -->
  <div class="slides-viewport">
    <div class="slides-track">
      ${slidesHTML}
    </div>
  </div>

  <!-- SLIDES NAVIGATION -->
  <div class="nav-bar">
    <button class="nav-btn prev" aria-label="Previous slide" disabled>←</button>
    <span class="nav-counter">1 / ${slideData.slides.length}</span>
    <button class="nav-btn next" aria-label="Next slide">→</button>
  </div>

  <!-- RIGHT SIDEBAR (TEACHING PANEL) -->
  <aside class="right-sidebar">
    <div class="sidebar-header">
      <button class="sidebar-close">◀ Back</button>
      <h3>🧑‍🏫 Teaching Panel</h3>
    </div>
    
    <nav class="sidebar-tabs">
      <button class="sidebar-tab active" data-tab="overview">📋 Overview</button>
      <button class="sidebar-tab" data-tab="timer">⏱️ Timer</button>
      <button class="sidebar-tab" data-tab="notes">📝 Notes</button>
      <button class="sidebar-tab" data-tab="tools">🛠️ Tools</button>
    </nav>

    <div class="sidebar-content">
      <!-- OVERVIEW PANEL -->
      <div class="sidebar-panel active" data-panel="overview">
        <div class="sidebar-divider">SLIDE SECTIONS</div>
        <div class="slide-thumbnails">
          ${thumbsHTML}
        </div>
      </div>

      <!-- TIMER PANEL -->
      <div class="sidebar-panel" data-panel="timer">
        <div class="timer-display">
          <div class="timer-clock">00:00</div>
          <div class="timer-status">Ready to start</div>
          <div class="timer-controls">
            <button class="timer-btn" data-timer="start">Start</button>
            <button class="timer-btn" data-timer="pause">Pause</button>
            <button class="timer-btn danger" data-timer="reset">Reset</button>
          </div>
        </div>
        <div class="per-slide-timing">
          <h4>💡 Recommended Pacing</h4>
          <div class="timing-row"><span>Total Duration</span><span>${meta.duration || 45} mins</span></div>
          <div class="timing-row"><span>Per Slide Avg</span><span>${( (meta.duration || 45) / slideData.slides.length ).toFixed(1)} mins</span></div>
        </div>
      </div>

      <!-- NOTES PANEL -->
      <div class="sidebar-panel" data-panel="notes">
        <div class="notes-area">
          <label>Speaker Notes (Auto-saved)</label>
          <textarea class="notes-textarea" placeholder="Type your speaker outline..."></textarea>
        </div>
        <button class="notes-save-btn">💾 Save Notes</button>
        <div class="notes-saved-msg">Notes saved successfully!</div>
      </div>

      <!-- TEACHING TOOLS PANEL -->
      <div class="sidebar-panel" data-panel="tools">
        <div class="tool-grid">
          <div class="tool-card" data-tool="spotlight">
            <span class="tool-icon">🔦</span>
            <span class="tool-name">Spotlight</span>
          </div>
          <div class="tool-card" data-tool="pointer">
            <span class="tool-icon">🎯</span>
            <span class="tool-name">Laser Pointer</span>
          </div>
          <div class="tool-card" data-tool="freeze">
            <span class="tool-icon">🔒</span>
            <span class="tool-name">Freeze Screen</span>
          </div>
        </div>

        <div class="sidebar-divider">RANDOM STUDENT PICKER</div>
        <div class="random-picker">
          <div class="random-name">---</div>
          <button class="random-btn">🎯 Spin Name</button>
        </div>

        <div class="sidebar-divider">LIVE Q&A</div>
        <div class="qa-box">
          <input type="text" class="qa-input" placeholder="Submit a classroom question..." />
          <button class="qa-submit">Submit</button>
        </div>

        <div class="sidebar-divider">PRESENTATION METRICS</div>
        <div class="progress-overview">
          <div class="prog-row" data-progress="slides">
            <span class="prog-label">Progress</span>
            <div class="prog-bar"><div class="prog-fill" style="width:0%"></div></div>
            <span class="prog-val">0%</span>
          </div>
        </div>
      </div>

    </div>
  </aside>

  <!-- Spotlight Overlay -->
  <div class="spotlight-overlay">
    <div class="spotlight-content">
      <p>SAMPLE SPOTLIGHT TEXT</p>
      <div class="spotlight-close-hint">Click anywhere to close</div>
    </div>
  </div>

  <script>
${jsEngine}
${jsBlocks}
${jsThemes}
${jsSidebar}

document.addEventListener('DOMContentLoaded', () => {
  SidebarModule.init();
  SlideEngine.init();
  InteractiveBlocks.init();
  SpeakerNotes.init();

  // Sync speaker notes to sidebar panel on slide change
  document.addEventListener('slideChanged', (e) => {
    const slides = document.querySelectorAll('.slide');
    const slide = slides[e.detail.index];
    const notes = slide ? slide.dataset.speakerNotes : '';
    const el = document.getElementById('sidebar-speaker-notes');
    if (el) el.textContent = notes || 'No speaker notes for this slide.';
  });
});
  </script>
</body>
</html>`;

  const outDir = path.dirname(outputFile);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outputFile, html, 'utf-8');
  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
  console.log(`✅ Built: ${outputFile}  (${slideData.slides.length} slides, ${sizeKB} KB)`);
}

// MAIN INVOCATION
if (process.argv[2] && process.argv[3]) {
  buildSlideDeck(process.argv[2], process.argv[3]);
} else {
  console.log('🚀 Running Full Lecta AI Presentation Build Suite...');
  
  // Build slide decks
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample-slides.json'),
    path.join(ROOT, 'output/templates/sample1.html')
  );
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample2-slides.json'),
    path.join(ROOT, 'output/templates/sample2.html')
  );

  // Build catalog programmatic fallback
  try {
    require('./build-catalog.js');
  } catch (err) {
    console.error('⚠️ Could not run build-catalog.js fallback:', err);
  }
}
