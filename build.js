#!/usr/bin/env node
/**
 * LECTA AI — Build Script
 * Assembles modular CSS/JS/data into a single self-contained HTML file.
 */

const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const { readFiles, loadFaviconDataURI, renderThemeDots, renderFontFaceCSS } = require('./src/build/utils');
const { getDeckCssFiles, getDeckJsFiles } = require('./src/build/assets');
const { LIGHT_THEMES, DARK_THEMES } = require('./src/build/themes');
const { FONT_FILES } = require('./src/build/fonts');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function loadTemplateLibrary(root) {
  try {
    const file = path.join(root, 'src/data/template-library.json');
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (err) {
    console.warn('Warning: Could not load template library:', err);
    return { categories: [] };
  }
}

function buildLessonContext(meta) {
  const ctx = meta.context || {};
  return {
    audience: ctx.audience || '',
    topic: ctx.topic || meta.title || '',
    lessonLength: ctx.lessonLength || meta.duration || 45,
    tone: ctx.tone || 'clear',
    pace: ctx.pace || 'standard',
    rhythmPreset: ctx.rhythmPreset || 'beginner-friendly',
    textDensity: ctx.textDensity || 'medium',
    exampleDensity: ctx.exampleDensity || 'high',
    primaryColor: ctx.primaryColor || '',
    stylePack: ctx.stylePack || 'editorial-clean',
  };
}

function renderTemplateLibraryHTML(library) {
  const categories = Array.isArray(library.categories) ? library.categories : [];
  if (categories.length === 0) {
    return '<div class="template-empty">No templates available.</div>';
  }

  return categories.map((category) => {
    const templates = Array.isArray(category.templates) ? category.templates : [];
    const categoryId = escapeAttr(category.id || '');
    const cardsHTML = templates.map((tmpl) => {
      const payload = escapeAttr(JSON.stringify(tmpl.slide || {}));
      const tagsHTML = Array.isArray(tmpl.tags)
        ? tmpl.tags.map((tag) => `<span class="template-tag">${escapeHtml(tag)}</span>`).join('')
        : '';
      return `
        <div class="template-card" data-template="${payload}">
          <div class="template-card-title">${escapeHtml(tmpl.title || 'Template')}</div>
          <div class="template-card-use">${escapeHtml(tmpl.useCase || '')}</div>
          <div class="template-card-tags">${tagsHTML}</div>
          <div class="template-card-actions">
            <button class="template-copy-btn" type="button">Copy JSON</button>
          </div>
        </div>`;
    }).join('');

    const categoryAttr = categoryId ? ` data-category-id="${categoryId}"` : '';
    return `
      <div class="template-category"${categoryAttr}>
        <div class="template-category-header">
          <div class="template-category-title">${escapeHtml(category.label || '')}</div>
          <div class="template-category-desc">${escapeHtml(category.description || '')}</div>
        </div>
        <div class="template-card-grid">${cardsHTML}</div>
      </div>`;
  }).join('');
}

// Validation function for robust slide structure verification
function validateSlideSchema(slideData, dataFile) {
  if (!slideData) {
    throw new Error(`Validation failed for ${dataFile}: JSON is null or undefined`);
  }
  if (!slideData.meta) {
    throw new Error(`Validation failed for ${dataFile}: missing required "meta" object`);
  }
  if (typeof slideData.meta.title !== 'string') {
    console.warn(`[Warning] ${dataFile}: "meta.title" is recommended to be a string`);
  }
  if (!Array.isArray(slideData.slides)) {
    throw new Error(`Validation failed for ${dataFile}: "slides" must be an array`);
  }

  slideData.slides.forEach((slide, idx) => {
    if (!slide.id) {
      slide.id = `slide-${idx + 1}`; // Safe fallback ID
    }
    if (!slide.type) {
      throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1}: missing required "type" field`);
    }
    if (!slide.data) {
      throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1}: missing required "data" object`);
    }

    if (slide.flow !== undefined) {
      if (!Array.isArray(slide.flow)) {
        throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1}: "flow" must be an array when provided`);
      }
      slide.flow.forEach((step, si) => {
        if (!step || typeof step !== 'object') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1}, flow step ${si + 1}: step must be an object`);
        }
        if (step.action && typeof step.action !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1}, flow step ${si + 1}: "action" must be a string`);
        }
        if (step.preset !== undefined && typeof step.preset !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1}, flow step ${si + 1}: "preset" must be a string`);
        }
        const targets = step.targets || step.target;
        if (targets !== undefined && !Array.isArray(targets) && typeof targets !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1}, flow step ${si + 1}: "targets" must be an array or string`);
        }
      });
    }

    const d = slide.data;
    switch (slide.type) {
      case 'bullets':
      case 'accordion':
      case 'summary':
        if (!Array.isArray(d.items)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("${slide.type}"): "items" must be an array`);
        }
        break;
      case 'cards':
        if (!Array.isArray(d.cards)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("cards"): "cards" must be an array`);
        }
        break;
      case 'tabs':
        if (!Array.isArray(d.tabs)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("tabs"): "tabs" must be an array`);
        }
        break;
      case 'quiz':
      case 'advanced-quiz':
        if (!Array.isArray(d.questions)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("${slide.type}"): "questions" must be an array`);
        }
        d.questions.forEach((q, qi) => {
          if (q.correct === undefined || isNaN(parseInt(q.correct, 10))) {
            throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("${slide.type}"), question ${qi + 1}: "correct" index must be defined as an integer`);
          }
          if (!Array.isArray(q.options)) {
            throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("${slide.type}"), question ${qi + 1}: "options" must be an array`);
          }
        });
        break;
      case 'chart':
        if (!d.chartType) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("chart"): missing required "chartType"`);
        }
        break;
      case 'bento':
        if (!Array.isArray(d.items)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("bento"): "items" must be an array`);
        }
        break;
      case 'stepper':
        if (!Array.isArray(d.steps)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("stepper"): "steps" must be an array`);
        }
        break;
      case 'timeline':
        if (!Array.isArray(d.events)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("timeline"): "events" must be an array`);
        }
        break;
      case 'flow':
        if (!Array.isArray(d.nodes)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("flow"): "nodes" must be an array`);
        }
        if (!Array.isArray(d.connections)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("flow"): "connections" must be an array`);
        }
        break;
      case 'image':
        if (!d.url || typeof d.url !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("image"): "url" must be a string`);
        }
        break;
      case 'table':
        if (!Array.isArray(d.columns)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("table"): "columns" must be an array`);
        }
        if (!Array.isArray(d.rows)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("table"): "rows" must be an array`);
        }
        d.columns.forEach((col, ci) => {
          if (!col.key || typeof col.key !== 'string') {
            throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("table"), column ${ci + 1}: "key" must be a non-empty string`);
          }
        });
        break;
      case 'compare':
        if (!d.left || !Array.isArray(d.left.items)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("compare"): "left.items" must be an array`);
        }
        if (!d.right || !Array.isArray(d.right.items)) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("compare"): "right.items" must be an array`);
        }
        break;
      case 'quote-card':
        if (!d.quote || typeof d.quote !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("quote-card"): "quote" must be a non-empty string`);
        }
        break;
      case 'definition-card':
        if (!d.term || typeof d.term !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("definition-card"): "term" must be a non-empty string`);
        }
        if (!d.definition || typeof d.definition !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("definition-card"): "definition" must be a non-empty string`);
        }
        break;
      case 'analogy':
        if (!d.technicalConcept || typeof d.technicalConcept !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("analogy"): "technicalConcept" must be a non-empty string`);
        }
        if (!d.analogy || typeof d.analogy !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("analogy"): "analogy" must be a non-empty string`);
        }
        break;
      case 'stats':
        if (!Array.isArray(d.stats) || d.stats.length === 0) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("stats"): "stats" must be a non-empty array`);
        }
        d.stats.forEach((s, si) => {
          if (!s.value || !s.label) {
            throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("stats"), item ${si + 1}: "value" and "label" are required`);
          }
        });
        break;
      case 'checklist':
        if (!Array.isArray(d.items) || d.items.length === 0) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("checklist"): "items" must be a non-empty array`);
        }
        d.items.forEach((item, ii) => {
          if (!item.text || typeof item.text !== 'string') {
            throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("checklist"), item ${ii + 1}: "text" must be a non-empty string`);
          }
        });
        break;
      case 'timeline-horizontal':
        if (!Array.isArray(d.events) || d.events.length === 0) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("timeline-horizontal"): "events" must be a non-empty array`);
        }
        d.events.forEach((e, ei) => {
          if (!e.title || !e.year) {
            throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("timeline-horizontal"), event ${ei + 1}: "title" and "year" are required`);
          }
        });
        break;
      case 'splash':
        if (!d.title || typeof d.title !== 'string') {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("splash"): "title" must be a non-empty string`);
        }
        break;
      case 'code-diff':
        if (!d.leftCode || !d.rightCode) {
          throw new Error(`Validation failed for ${dataFile} at slide ${idx + 1} ("code-diff"): "leftCode" and "rightCode" are required`);
        }
        break;
    }
  });
}

// Assembles a specific JSON file into a target HTML file
function buildSlideDeck(dataFile, outputFile) {
  const slideData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  
  // Validate schema before compiling to report mistakes instantly
  validateSlideSchema(slideData, dataFile);
  
  const meta = slideData.meta;
  const lessonContext = buildLessonContext(meta);
  const templateLibrary = loadTemplateLibrary(ROOT);
  const templateLibraryHTML = renderTemplateLibraryHTML(templateLibrary);

  // Load favicon if available
  const faviconDataURI = loadFaviconDataURI(ROOT);

  // CSS
  const fontFaceCSS = renderFontFaceCSS(ROOT, FONT_FILES);
  const allCSS = readFiles(ROOT, getDeckCssFiles());
  const allJS = readFiles(ROOT, getDeckJsFiles());

  // Slides HTML
  const { renderSlideHTML } = require('./src/js/renderer.js');
  const slidesHTML = slideData.slides.map(s => renderSlideHTML(s)).join('\n');

  // Build overview thumbnails for sidebar
  const TYPES = { title:'🎬', bullets:'📌', accordion:'📚', tabs:'🗂', stepper:'🚶', cards:'🃏', quiz:'❓', compare:'⚔️', timeline:'📅', summary:'🎓', image:'🖼️', chart:'📊', table:'🧮', bento:'🍱', flow:'🌿' };
  const thumbsHTML = slideData.slides.map((s, i) => `
    <div class="slide-thumb${i === 0 ? ' active' : ''}" data-slide="${i}">
      <span class="slide-thumb-num">${i + 1}</span>
      <div class="slide-thumb-info">
        <div class="slide-thumb-title">${s.data.heading || s.data.title || 'Slide ' + (i+1)}</div>
        <div class="slide-thumb-type">${TYPES[s.type] || '📄'} ${s.type}</div>
      </div>
    </div>`).join('');

  // Light themes for gear panel
  const lightThemeDotItems = renderThemeDots(LIGHT_THEMES, meta.theme);
  const darkThemeDotItems = renderThemeDots(DARK_THEMES);

  const studentAttr = meta.students ? ` data-students="${JSON.stringify(meta.students).replace(/"/g, '&quot;')}"` : '';
  const deckId = meta.id || meta.title || 'lecta-deck';
  const deckIdAttr = ` data-deck-id="${escapeAttr(deckId)}"`;
  const lessonContextJSON = escapeHtml(JSON.stringify(lessonContext));

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="${meta.theme || 'ocean'}">
<head>
  <meta charset="UTF-8">
  ${faviconDataURI ? `<link rel="icon" type="image/jpeg" href="${faviconDataURI}">` : ''}
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${meta.subtitle || 'Interactive slide deck built with Lecta AI'}">
  <title>${meta.title || 'Lecta AI Presentation'}</title>
  <style>${fontFaceCSS}
${allCSS}</style>
</head>
<body${studentAttr}${deckIdAttr}>
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
      <div class="settings-label">Viewport Mode</div>
      <div class="viewport-toggle">
        <button class="viewport-btn active" data-viewport="desktop">🖥️ Desktop</button>
        <button class="viewport-btn" data-viewport="mobile">📱 Mobile Preview</button>
      </div>
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

  <!-- Safe-zone Overlay -->
  <div class="safe-zone-overlay" aria-hidden="true">
    <div class="safe-zone-box safe-zone-camera">
      <span class="safe-zone-label">Camera Safe Zone</span>
    </div>
    <div class="safe-zone-box safe-zone-subtitle">
      <span class="safe-zone-label">Subtitle Safe Zone</span>
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
      <button class="sidebar-tab" data-tab="flow">🎬 Flow</button>
      <button class="sidebar-tab" data-tab="context">🧭 Context</button>
      <button class="sidebar-tab" data-tab="templates">🧩 Templates</button>
      <button class="sidebar-tab" data-tab="recording">REC</button>
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

      <!-- FLOW PANEL -->
      <div class="sidebar-panel" data-panel="flow">
        <div class="flow-panel">
          <div class="flow-header">
            <div>
              <div class="flow-title">Presentation Flow</div>
              <div class="flow-subtitle">Reveal steps for the current slide.</div>
            </div>
            <div class="flow-step-count">0/0</div>
          </div>
          <div class="flow-controls">
            <button class="flow-btn" type="button" data-flow="prev">← Prev Step</button>
            <button class="flow-btn primary" type="button" data-flow="next">Next Step →</button>
            <button class="flow-btn ghost" type="button" data-flow="reset">Reset</button>
          </div>
          <div class="flow-step-list"></div>
          <div class="flow-empty">No flow steps defined for this slide.</div>
        </div>
      </div>

      <!-- CONTEXT PANEL -->
      <div class="sidebar-panel" data-panel="context">
        <div class="context-panel">
          <div class="context-header">
            <div class="context-title">Shared Context</div>
            <div class="context-subtitle">Applied across every slide in this deck.</div>
          </div>
          <div class="context-form">
            <label class="context-label">Audience</label>
            <input class="context-input" data-field="audience" type="text" value="${escapeAttr(lessonContext.audience)}" placeholder="AI beginner" />

            <label class="context-label">Topic</label>
            <input class="context-input" data-field="topic" type="text" value="${escapeAttr(lessonContext.topic)}" placeholder="Lesson topic" />

            <label class="context-label">Lesson Length (mins)</label>
            <input class="context-input" data-field="lessonLength" type="number" min="5" max="180" value="${lessonContext.lessonLength}" />

            <div class="context-row">
              <div>
                <label class="context-label">Tone</label>
                <select class="context-select" data-field="tone">
                  <option value="clear">Clear</option>
                  <option value="warm">Warm</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
              <div>
                <label class="context-label">Pace</label>
                <select class="context-select" data-field="pace">
                  <option value="slow">Slow</option>
                  <option value="standard">Standard</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </div>

            <div>
              <label class="context-label">Rhythm Preset</label>
              <select class="context-select" data-field="rhythmPreset">
                <option value="beginner-friendly">Beginner Friendly</option>
                <option value="intermediate-deep-dive">Intermediate Deep Dive</option>
                <option value="fast-recap">Fast Recap</option>
                <option value="example-heavy">Example Heavy</option>
                <option value="code-heavy">Code Heavy</option>
              </select>
            </div>

            <div class="context-row">
              <div>
                <label class="context-label">Text Density</label>
                <select class="context-select" data-field="textDensity">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label class="context-label">Example Density</label>
                <select class="context-select" data-field="exampleDensity">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div class="context-row">
              <div>
                <label class="context-label">Primary Color</label>
                <input class="context-input" data-field="primaryColor" type="text" value="${escapeAttr(lessonContext.primaryColor)}" placeholder="#3b82f6" />
              </div>
              <div>
                <label class="context-label">Style Pack</label>
                <select class="context-select" data-field="stylePack">
                  <option value="editorial-clean">Editorial Clean</option>
                  <option value="soft-glass">Soft Glass</option>
                  <option value="dark-contrast">Dark Contrast</option>
                  <option value="minimal-lab">Minimal Lab</option>
                </select>
              </div>
            </div>
          </div>
          <div class="context-actions">
            <button class="context-save-btn" type="button">Save Context</button>
            <button class="context-reset-btn" type="button">Reset</button>
          </div>
          <div class="context-status">Context saved.</div>
        </div>
      </div>

      <!-- TEMPLATE LIBRARY PANEL -->
      <div class="sidebar-panel" data-panel="templates">
        <div class="template-panel">
          <div class="template-header">
            <div class="template-title">Use-case Templates</div>
            <div class="template-subtitle">Copy a slide JSON snippet and reuse it in new decks.</div>
          </div>
          ${templateLibraryHTML}
        </div>
      </div>

      <!-- RECORDING PANEL -->
      <div class="sidebar-panel" data-panel="recording">
        <div class="recording-panel">
          <div class="recording-header">
            <div>
              <div class="recording-title">Recording Assistant</div>
              <div class="recording-subtitle">Step guidance, timing, and safe zones.</div>
            </div>
            <div class="recording-status">Ready</div>
          </div>

          <div class="recording-card">
            <div class="recording-label">Current Step</div>
            <div class="recording-value" data-recording="current-step">Step 0/0</div>
            <div class="recording-next" data-recording="next-step">Next: -</div>
          </div>

          <div class="recording-card recording-metrics">
            <div>
              <div class="recording-label">Est. Slide Time</div>
              <div class="recording-value" data-recording="slide-time">0:00</div>
            </div>
            <div>
              <div class="recording-label">Steps</div>
              <div class="recording-value" data-recording="step-count">0</div>
            </div>
          </div>

          <div class="recording-card">
            <div class="recording-label">Slide Health</div>
            <ul class="recording-health-list"></ul>
            <div class="recording-health-empty">No issues detected.</div>
          </div>

          <div class="recording-card">
            <label class="recording-label" for="recording-checkpoint">Narration Checkpoint</label>
            <textarea id="recording-checkpoint" class="recording-checkpoint" placeholder="Key talking point for this slide..."></textarea>
            <button class="recording-save" type="button">Save checkpoint</button>
            <div class="recording-save-msg">Checkpoint saved.</div>
          </div>

          <div class="recording-card">
            <div class="recording-label">Camera Safe Zone</div>
            <div class="recording-toggle-group" data-recording-group="camera">
              <button class="recording-toggle" type="button" data-value="off">Off</button>
              <button class="recording-toggle" type="button" data-value="left">Left</button>
              <button class="recording-toggle" type="button" data-value="right">Right</button>
            </div>
            <div class="recording-label" style="margin-top:0.6rem;">Subtitle Safe Zone</div>
            <div class="recording-toggle-group" data-recording-group="subtitle">
              <button class="recording-toggle" type="button" data-value="off">Off</button>
              <button class="recording-toggle" type="button" data-value="on">On</button>
            </div>
          </div>

          <div class="recording-card">
            <label class="recording-label" for="recording-jump">Quick Jump</label>
            <select id="recording-jump" class="recording-jump"></select>
          </div>
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

  <!-- 🖌️ Global Drawing Canvas Annotation Overlay -->
  <canvas class="drawing-canvas-overlay" width="1920" height="1080"></canvas>

  <!-- 🖌️ Drawing Annotation Toolbar -->
  <div class="drawing-toolbar">
    <button class="draw-tool-btn active" data-tool="pen" title="Pen">✏️</button>
    <button class="draw-tool-btn" data-tool="highlighter" title="Highlighter">🖍️</button>
    <button class="draw-tool-btn" data-tool="eraser" title="Eraser">🧹</button>
    <div class="draw-divider"></div>
    <div class="draw-color-dot draw-color-red active" data-color="#ef4444" title="Red"></div>
    <div class="draw-color-dot draw-color-blue" data-color="#3b82f6" title="Blue"></div>
    <div class="draw-color-dot draw-color-yellow" data-color="#eab308" title="Yellow"></div>
    <div class="draw-color-dot draw-color-green" data-color="#10b981" title="Green"></div>
    <div class="draw-divider"></div>
    <span class="draw-brush-indicator">Size: 4px</span>
    <input type="range" class="draw-brush-size" min="2" max="20" value="4" style="width: 60px;" />
    <div class="draw-divider"></div>
    <button class="draw-tool-btn draw-clear" title="Clear Canvas">🗑️</button>
  </div>

  <!-- 🔍 Spotlight Command Search Palette -->
  <div class="search-palette-backdrop">
    <div class="search-palette">
      <div class="search-input-wrapper">
        <span>🔍</span>
        <input type="text" class="search-input" placeholder="Type slide title, content, or block name..." />
      </div>
      <div class="search-results-list">
        <!-- Results rendered dynamically via JS -->
      </div>
    </div>
  </div>

  <script type="application/json" id="lesson-context-data">${lessonContextJSON}</script>

  <script>
${allJS}

document.addEventListener('DOMContentLoaded', () => {
  SidebarModule.init();
  SlideEngine.init();
  InteractiveBlocks.init();
  SpeakerNotes.init();
  if (window.SlideHealth) {
    window.SlideHealth.init();
  }
  if (window.LessonStudio) {
    window.LessonStudio.init();
  }

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
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample3-slides.json'),
    path.join(ROOT, 'output/templates/sample3.html')
  );
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample4-slides.json'),
    path.join(ROOT, 'output/templates/sample4.html')
  );
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample5-slides.json'),
    path.join(ROOT, 'output/templates/sample5.html')
  );

  // Build catalog programmatic fallback
  try {
    require('./build-catalog.js');
  } catch (err) {
    console.error('⚠️ Could not run build-catalog.js fallback:', err);
  }
}
