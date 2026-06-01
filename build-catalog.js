#!/usr/bin/env node
/**
 * LECTA AI — Catalog Builder
 * Generates all-designs.html component reference
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const { readFiles, loadFaviconDataURI, renderThemeDots, renderFontFaceCSS } = require('./src/build/utils');
const { getCatalogCssFiles, getCatalogJsFiles } = require('./src/build/assets');
const { LIGHT_THEMES, DARK_THEMES } = require('./src/build/themes');
const { FONT_FILES } = require('./src/build/fonts');

const fontFaceCSS = renderFontFaceCSS(ROOT, FONT_FILES);
const allCSS = readFiles(ROOT, getCatalogCssFiles());
const allJS = readFiles(ROOT, getCatalogJsFiles());

// Load favicon if available
const faviconDataURI = loadFaviconDataURI(ROOT);

// Create theme dot lists
const lightThemeDotItems = renderThemeDots(LIGHT_THEMES, 'ocean');
const darkThemeDotItems = renderThemeDots(DARK_THEMES);

const html = `<!DOCTYPE html>
<html lang="en" data-theme="ocean">
<head>
<meta charset="UTF-8">
${faviconDataURI ? `<link rel="icon" type="image/jpeg" href="${faviconDataURI}">` : ''}
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lecta AI — All Designs Catalog</title>
<style>
${fontFaceCSS}
${allCSS}
</style>
</head>
<body class="catalog">

<!-- ⚙️ GEAR BUTTON -->
<button class="gear-btn" style="position: fixed; top: 1rem; right: 1rem; z-index: 2000;">⚙️</button>

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
    <!-- OVERVIEW TAB -->
    <div class="sidebar-panel active" data-panel="overview">
      <div class="slide-thumbnails">
        <div class="slide-thumb active" data-slide="0">
          <span class="slide-thumb-num">1</span>
          <div class="slide-thumb-info">
            <div class="slide-thumb-title">Components Catalog</div>
            <div class="slide-thumb-type">🎨 Catalog Reference</div>
          </div>
        </div>
      </div>
    </div>

    <!-- FLOW TAB -->
    <div class="sidebar-panel" data-panel="flow">
      <div class="flow-panel">
        <div class="flow-header">
          <div>
            <div class="flow-title">Presentation Flow</div>
            <div class="flow-subtitle">Flow controls are available in slide decks.</div>
          </div>
          <div class="flow-step-count">0/0</div>
        </div>
        <div class="flow-empty">Catalog view does not include flow steps.</div>
      </div>
    </div>

    <!-- CONTEXT TAB -->
    <div class="sidebar-panel" data-panel="context">
      <div class="context-panel">
        <div class="context-header">
          <div class="context-title">Shared Context</div>
          <div class="context-subtitle">Available in slide decks, not in catalog view.</div>
        </div>
        <div class="template-empty">Open a deck to edit context.</div>
      </div>
    </div>

    <!-- TEMPLATE TAB -->
    <div class="sidebar-panel" data-panel="templates">
      <div class="template-panel">
        <div class="template-header">
          <div class="template-title">Use-case Templates</div>
          <div class="template-subtitle">Template library appears in deck builds.</div>
        </div>
        <div class="template-empty">Open a deck to browse templates.</div>
      </div>
    </div>

    <!-- RECORDING TAB -->
    <div class="sidebar-panel" data-panel="recording">
      <div class="recording-panel">
        <div class="recording-header">
          <div>
            <div class="recording-title">Recording Assistant</div>
            <div class="recording-subtitle">Available in deck builds.</div>
          </div>
        </div>
        <div class="template-empty">Open a deck to enable recording tools.</div>
      </div>
    </div>

    <!-- TIMER TAB -->
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
    </div>

    <!-- NOTES TAB -->
    <div class="sidebar-panel" data-panel="notes">
      <div class="notes-area">
        <label>Speaker Notes (Auto-saved)</label>
        <textarea class="notes-textarea" placeholder="Type presentation outline here..."></textarea>
      </div>
      <button class="notes-save-btn">💾 Save Notes</button>
      <div class="notes-saved-msg">Notes saved successfully!</div>
    </div>

    <!-- TOOLS TAB -->
    <div class="sidebar-panel" data-panel="tools">
      <div class="tool-grid">
        <div class="tool-card" data-tool="spotlight"><span class="tool-icon">🔦</span><span class="tool-name">Spotlight</span></div>
        <div class="tool-card" data-tool="pointer"><span class="tool-icon">🎯</span><span class="tool-name">Laser Pointer</span></div>
        <div class="tool-card" data-tool="freeze"><span class="tool-icon">🔒</span><span class="tool-name">Freeze Screen</span></div>
      </div>

      <div class="sidebar-divider">Random Picker</div>
      <div class="random-picker">
        <div class="random-name">---</div>
        <button class="random-btn">🎯 Spin Name</button>
      </div>

      <div class="sidebar-divider">Live Q&A</div>
      <div class="qa-box">
        <input type="text" class="qa-input" placeholder="Ask a question..." />
        <button class="qa-submit">Submit</button>
      </div>
    </div>
  </div>
</aside>

<!-- Spotlight Overlay -->
<div class="spotlight-overlay">
  <div class="spotlight-content">
    <p>Spotlight Active</p>
    <div class="spotlight-close-hint">Click anywhere to dismiss</div>
  </div>
</div>

<!-- CATALOG CONTENT VIEWPORT -->
<div class="catalog-viewport">
  <div class="catalog-header">
    <h1>Lecta AI — Component Catalog</h1>
    <p>All available design blocks, UI elements, and interactive patterns. Pick any component, modify it, and use it in your slides.</p>
  </div>

<!-- ===== 0. PREMIUM DECK SAMPLES GALLERY ===== -->
<h2 class="section-title"><span class="sec-icon">🌟</span> Premium Presentation Decks <span class="sec-id">SEC-00</span></h2>
<div class="component-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">

  <!-- Sample 1 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 1</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">💻 Core Web</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">Modern Web Development</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">A comprehensive, beginner-friendly introduction to modern HTML, CSS, and JS foundations.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">theme: ocean</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">style: soft-glass</span>
      </div>
      <a href="sample1.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

  <!-- Sample 2 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 2</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">🎨 Styling</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">CSS & Visual Aesthetics</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">Deep dive into wide-gamut OKLCH colors, fluid layout patterns, and modern web aesthetics.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">theme: sunset</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">style: pastel-pop</span>
      </div>
      <a href="sample2.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

  <!-- Sample 3 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 3</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">📊 Data Viz</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">Technical Dashboards</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">Native interactive SVG charts and data grids rendering microservices cluster health metrics.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">theme: midnight</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">style: dark-contrast</span>
      </div>
      <a href="sample3.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

  <!-- Sample 4 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 4</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">🚶 Choreography</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">Slide Choreography</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">Asymmetric wireframes, interactive timers, timeline progressions, and responsive quiz components.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">theme: volcano</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">style: editorial-clean</span>
      </div>
      <a href="sample4.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

  <!-- Sample 5 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 5</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">⚡ Next-Gen</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">Next-Gen Architecture</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">Unlocking P2P teaching panels, live drawing canvas, and real-time student interaction pipelines.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">theme: volcano</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt);">style: soft-glass</span>
      </div>
      <a href="sample5.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

  <!-- Sample 6 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 6</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">🎬 Cinematic</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">Cinematic Masterclass</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">Bold Brutalist aesthetic layout presenting video storytelling techniques and cinematic transitions.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">theme: brutalist</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">style: brutalist-bold</span>
      </div>
      <a href="sample6.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

  <!-- Sample 7 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 7</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">📈 FinTech</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">FinTech 2026</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">Technical blueprint aesthetic detailing next-gen micro-transactions and secure transaction nodes.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">theme: blueprint</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">style: tech-blueprint</span>
      </div>
      <a href="sample7.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

  <!-- Sample 8 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 8</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">🤖 Multi-Agent</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">Multi-Agent Systems</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">Retro terminal aesthetic visualizing high-performance inter-agent orchestrations and workloads.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">theme: terminal</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">style: retro-terminal</span>
      </div>
      <a href="sample8.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

  <!-- Sample 9 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 9</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">🥞 Web Stack</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">Web Stack 2026</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">Editorial poster layout outlining full-stack framework comparisons and runtime metrics.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">theme: editorial</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">style: editorial-poster</span>
      </div>
      <a href="sample9.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

  <!-- Sample 10 -->
  <div class="comp-card sample-deck-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--color-border-light); background: var(--color-surface); transition: all var(--transition-base); border-radius: var(--radius-lg); padding: var(--space-lg);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
        <span class="badge" style="background: color-mix(in oklch, var(--color-primary) 15%, transparent); color: var(--color-primary);">Sample 10</span>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">🗺️ Roadmap</span>
      </div>
      <h3 style="margin: 0 0 var(--space-xs); font-size: 1.15rem; font-weight: 700; color: var(--color-text);">Enterprise Expansion</h3>
      <p style="margin: 0 0 var(--space-md); font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.4;">Museum label parchment layout mapping out Q1-Q4 global SaaS infrastructure expansion.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
      <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; margin-bottom: var(--space-xs);">
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">theme: newspaper</span>
        <span class="badge" style="font-size: 0.75rem; background: var(--color-bg-alt); font-weight: 600;">style: museum-label</span>
      </div>
      <a href="sample10.html" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none; display: block; width: 100%; box-sizing: border-box;">Open Presentation Deck ↗</a>
    </div>
  </div>

</div>

<!-- ===== 1. BUTTONS ===== -->
<h2 class="section-title"><span class="sec-icon">🔘</span> Buttons <span class="sec-id">SEC-01</span></h2>
<div class="component-grid">
  <div class="comp-card"><div class="comp-card-header">Solid Variants <span class="card-type">button</span></div>
    <div class="comp-card-body"><div class="btn-row">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-accent">Accent</button>
      <button class="btn btn-success">Success</button>
      <button class="btn btn-warning">Warning</button>
      <button class="btn btn-error">Danger</button>
      <button class="btn">Default</button>
    </div></div></div>

  <div class="comp-card"><div class="comp-card-header">Outline & Ghost <span class="card-type">button</span></div>
    <div class="comp-card-body"><div class="btn-row">
      <button class="btn btn-outline">Outline</button>
      <button class="btn btn-ghost">Ghost</button>
      <button class="btn btn-outline btn-pill">Pill Outline</button>
      <button class="btn btn-primary btn-pill">Pill Solid</button>
    </div></div></div>

  <div class="comp-card"><div class="comp-card-header">Sizes <span class="card-type">button</span></div>
    <div class="comp-card-body"><div class="btn-row">
      <button class="btn btn-primary btn-sm">Small</button>
      <button class="btn btn-primary">Medium</button>
      <button class="btn btn-primary btn-lg">Large</button>
      <button class="btn btn-icon btn-primary">⚡</button>
    </div></div></div>

  <div class="comp-card"><div class="comp-card-header">Action Buttons (AI Slide Tools) <span class="card-type">button</span></div>
    <div class="comp-card-body"><div class="btn-row">
      <button class="btn btn-outline">✨ Simplify</button>
      <button class="btn btn-outline">📝 Add Examples</button>
      <button class="btn btn-outline">✂️ Shorten</button>
      <button class="btn btn-outline">🎨 More Visual</button>
      <button class="btn btn-outline">🔄 Regenerate</button>
      <button class="btn btn-outline">🔊 Add Speaker Notes</button>
      <button class="btn btn-outline">🧩 Make Interactive</button>
      <button class="btn btn-outline">🔒 Lock Slide</button>
      <button class="btn btn-primary">🤖 Fix This Slide</button>
    </div></div></div>
</div>

<!-- ===== 2. CALLOUTS ===== -->
<h2 class="section-title"><span class="sec-icon">💬</span> Callouts & Alerts <span class="sec-id">SEC-02</span></h2>
<div class="component-grid full-width">
  <div class="comp-card"><div class="comp-card-header">Callout Variants <span class="card-type">callout</span></div>
    <div class="comp-card-body">
      <div class="callout callout-info"><span class="callout-icon">ℹ️</span><div><strong>Info:</strong> This is an informational callout for general notes and context.</div></div>
      <div class="callout callout-success"><span class="callout-icon">✅</span><div><strong>Success:</strong> Great job! This action completed successfully.</div></div>
      <div class="callout callout-warning"><span class="callout-icon">⚠️</span><div><strong>Warning:</strong> Be careful with this approach — consider edge cases.</div></div>
      <div class="callout callout-error"><span class="callout-icon">🚫</span><div><strong>Error:</strong> This is a common mistake. Avoid using var without let/const.</div></div>
    </div></div>
</div>

<!-- ===== 3. TAGS & BADGES ===== -->
<h2 class="section-title"><span class="sec-icon">🏷️</span> Tags, Badges & Avatars <span class="sec-id">SEC-03</span></h2>
<div class="component-grid">
  <div class="comp-card"><div class="comp-card-header">Tags <span class="card-type">tag</span></div>
    <div class="comp-card-body"><div class="btn-row">
      <span class="tag tag-primary">React</span>
      <span class="tag tag-success">Completed</span>
      <span class="tag tag-warning">In Progress</span>
      <span class="tag tag-error">Blocked</span>
      <span class="badge">Workshop · 45min</span>
      <span class="badge">🔥 New</span>
    </div></div></div>
  <div class="comp-card"><div class="comp-card-header">Avatars <span class="card-type">avatar</span></div>
    <div class="comp-card-body"><div class="btn-row">
      <div class="avatar avatar-sm">S</div>
      <div class="avatar">M</div>
      <div class="avatar avatar-lg">L</div>
      <div class="avatar avatar-lg" style="background:var(--gradient-accent)">AI</div>
    </div></div></div>
</div>

<!-- ===== 4. FORM INPUTS ===== -->
<h2 class="section-title"><span class="sec-icon">📝</span> Form Inputs <span class="sec-id">SEC-04</span></h2>
<div class="component-grid">
  <div class="comp-card"><div class="comp-card-header">Text Input <span class="card-type">input</span></div>
    <div class="comp-card-body">
      <div class="input-group"><label class="input-label">Topic</label><input class="input-field" placeholder="Enter your lesson topic..."></div>
      <div class="input-group"><label class="input-label">Audience</label><input class="input-field" placeholder="e.g. Beginners, University students"></div>
    </div></div>
  <div class="comp-card"><div class="comp-card-header">Textarea & Toggle <span class="card-type">input</span></div>
    <div class="comp-card-body">
      <div class="input-group"><label class="input-label">Outline</label><textarea class="input-field" rows="3" placeholder="Slide 1: Title&#10;Slide 2: Objectives&#10;Slide 3: Key concepts"></textarea></div>
      <div style="display:flex;align-items:center;gap:0.75rem">
        <label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label>
        <span style="font-size:0.85rem;color:var(--color-text-secondary)">Enable AI auto-fill</span>
      </div>
    </div></div>
</div>

<!-- ===== 5. PROGRESS & STATS ===== -->
<h2 class="section-title"><span class="sec-icon">📊</span> Progress, Stats & Charts <span class="sec-id">SEC-05</span></h2>
<div class="component-grid">
  <div class="comp-card"><div class="comp-card-header">Progress Bars <span class="card-type">progress</span></div>
    <div class="comp-card-body">
      <div style="font-size:0.8rem;color:var(--color-text-muted);margin-bottom:0.3rem">Lesson progress — 65%</div>
      <div class="progress-bar"><div class="progress-fill" style="width:65%"></div></div>
      <div style="font-size:0.8rem;color:var(--color-text-muted);margin-bottom:0.3rem;margin-top:0.75rem">Quiz score — 80%</div>
      <div class="progress-bar"><div class="progress-fill" style="width:80%;background:var(--color-success)"></div></div>
    </div></div>
  <div class="comp-card"><div class="comp-card-header">Stat Cards & Interactive Dropdowns <span class="card-type">stat</span></div>
    <div class="comp-card-body">
      <div style="font-size:0.85rem;font-weight:600;color:var(--color-text-muted);margin-bottom:0.5rem">Standard Stat Cards</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1.5rem">
        <div class="stat-card"><div class="stat-value">10</div><div class="stat-label">Slides</div></div>
        <div class="stat-card"><div class="stat-value">45m</div><div class="stat-label">Duration</div></div>
        <div class="stat-card"><div class="stat-value">3</div><div class="stat-label">Quizzes</div></div>
      </div>
      
      <div style="font-size:0.85rem;font-weight:600;color:var(--color-text-muted);margin-bottom:0.5rem">Interactive Dropdown Stat Cards (Click cards to toggle details)</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem">
        <div class="stat-card expandable">
          <div class="stat-value">42</div>
          <div class="stat-label">Acquisition Rate</div>
          <div class="stat-toggle-btn trend-up" aria-label="Toggle Details">
            <span class="stat-toggle-icon">↑</span>
          </div>
          <div class="stat-dropdown">
            <div class="stat-dropdown-inner">
              <span class="stat-dropdown-text">+15% YoY Growth</span>
            </div>
          </div>
        </div>
        <div class="stat-card expandable">
          <div class="stat-value">1,800%</div>
          <div class="stat-label">Sign-up Volume</div>
          <div class="stat-toggle-btn trend-up" aria-label="Toggle Details">
            <span class="stat-toggle-icon">↑</span>
          </div>
          <div class="stat-dropdown">
            <div class="stat-dropdown-inner">
              <span class="stat-dropdown-text">Based on signed LOIs</span>
            </div>
          </div>
        </div>
        <div class="stat-card expandable">
          <div class="stat-value">50</div>
          <div class="stat-label">Active Deployments</div>
          <div class="stat-toggle-btn trend-down" aria-label="Toggle Details">
            <span class="stat-toggle-icon">↓</span>
          </div>
          <div class="stat-dropdown">
            <div class="stat-dropdown-inner">
              <span class="stat-dropdown-text">-4% under quota</span>
            </div>
          </div>
        </div>
      </div>
    </div></div>
</div>

<div class="component-grid two-col">
  <!-- Interactive Bar Chart -->
  <div class="comp-card"><div class="comp-card-header">Interactive Bar Chart <span class="card-type">chart</span></div>
    <div class="comp-card-body">
      <div class="chart-block-container" data-chart-type="bar" data-labels='["Jan","Feb","Mar","Apr","May"]' data-datasets='[{"label":"Revenue","data":[35,55,80,60,95],"color":"primary"},{"label":"Cost","data":[20,30,45,40,50],"color":"accent"}]'>
        <div class="chart-canvas-wrapper">
          <svg class="svg-chart" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet"></svg>
        </div>
        <div class="chart-legend"></div>
      </div>
    </div></div>

  <!-- Interactive Line Chart -->
  <div class="comp-card"><div class="comp-card-header">Interactive Line Chart <span class="card-type">chart</span></div>
    <div class="comp-card-body">
      <div class="chart-block-container" data-chart-type="line" data-labels='["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]' data-datasets='[{"label":"Active Users","data":[120,150,220,180,310,270,390],"color":"success"}]'>
        <div class="chart-canvas-wrapper">
          <svg class="svg-chart" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet"></svg>
        </div>
        <div class="chart-legend"></div>
      </div>
    </div></div>

  <!-- Interactive Donut Chart -->
  <div class="comp-card"><div class="comp-card-header">Interactive Donut Chart <span class="card-type">chart</span></div>
    <div class="comp-card-body">
      <div class="chart-block-container" data-chart-type="donut" data-labels='["React","Vue","Angular","Svelte"]' data-datasets='[{"label":"Market Share","data":[55,25,12,8],"color":"primary"}]'>
        <div class="chart-canvas-wrapper">
          <svg class="svg-chart" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet"></svg>
        </div>
        <div class="chart-legend"></div>
      </div>
    </div></div>

  <div class="comp-card"><div class="comp-card-header">Tooltip Demo <span class="card-type">tooltip</span></div>
    <div class="comp-card-body"><div class="btn-row" style="justify-content:center;padding:2rem 0">
      <span class="tooltip-trigger">Hover me<span class="tooltip-text">This is a tooltip!</span></span>
      <span class="tooltip-trigger">API<span class="tooltip-text">Application Programming Interface</span></span>
      <span class="tooltip-trigger">SSR<span class="tooltip-text">Server-Side Rendering</span></span>
    </div></div></div>
</div>

<!-- ===== 6. DATA TABLE ===== -->
<h2 class="section-title"><span class="sec-icon">📋</span> Tables <span class="sec-id">SEC-06</span></h2>
<div class="component-grid full-width">
  <div class="comp-card"><div class="comp-card-header">Interactive Data Table <span class="card-type">table</span></div>
    <div class="comp-card-body">
      <div class="table-block-container">
        <div class="table-actions">
          <input type="text" class="table-search-input" placeholder="Search rows..." />
        </div>
        <div class="table-responsive-wrapper">
          <table class="glass-table">
            <thead>
              <tr>
                <th data-col-key="tech" class="sortable-th">Technology <span class="sort-indicator">↕</span></th>
                <th data-col-key="type" class="sortable-th">Type <span class="sort-indicator">↕</span></th>
                <th data-col-key="year" class="sortable-th">Year <span class="sort-indicator">↕</span></th>
                <th data-col-key="status" class="sortable-th">Status <span class="sort-indicator">↕</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Technology">HTML5</td>
                <td data-label="Type">Markup</td>
                <td data-label="Year">2014</td>
                <td data-label="Status"><span class="badge-pill pill-success">Stable</span></td>
              </tr>
              <tr>
                <td data-label="Technology">CSS Grid</td>
                <td data-label="Type">Layout</td>
                <td data-label="Year">2017</td>
                <td data-label="Status"><span class="badge-pill pill-success">Stable</span></td>
              </tr>
              <tr>
                <td data-label="Technology">React 19</td>
                <td data-label="Type">Framework</td>
                <td data-label="Year">2024</td>
                <td data-label="Status"><span class="badge-pill pill-primary">Current</span></td>
              </tr>
              <tr>
                <td data-label="Technology">Container Queries</td>
                <td data-label="Type">CSS</td>
                <td data-label="Year">2023</td>
                <td data-label="Status"><span class="badge-pill pill-warning">Evolving</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div></div>
</div>

<!-- ===== 6b. FLOWCHART / MINDMAP ===== -->
<h2 class="section-title"><span class="sec-icon">🌿</span> Mindmaps & Flowcharts <span class="sec-id">SEC-06b</span></h2>
<div class="component-grid full-width">
  <div class="comp-card"><div class="comp-card-header">Interactive Flowchart / Mindmap <span class="card-type">flow</span></div>
    <div class="comp-card-body">
      <div class="flow-block-container" data-nodes='[{"id":"1","label":"1. Event Ingestion","x":50,"y":100,"details":"Ingest events with sub-millisecond latencies."},{"id":"2","label":"2. Stream Processing","x":230,"y":180,"details":"Cleanse, transform, and aggregate streaming data."},{"id":"3","label":"3. Analytical Warehouse","x":410,"y":100,"details":"Store historical analytical records optimized for speed."},{"id":"4","label":"4. Lecta Dashboard","x":590,"y":180,"details":"Visualize real-time business metrics."}]' data-connections='[{"from":"1","to":"2"},{"from":"2","to":"3"},{"from":"3","to":"4"}]'>
        <div class="flow-layout-wrapper">
          <svg class="flow-svg-canvas" viewBox="0 0 800 350"></svg>
        </div>
        <div class="flow-detail-panel glassmorphic-panel">
          <div class="flow-detail-default-msg">💡 Click on any step in the flowchart to view deep insights.</div>
          <div class="flow-detail-content" style="display: none;">
            <h4 class="flow-detail-title"></h4>
            <p class="flow-detail-desc"></p>
          </div>
        </div>
      </div>
    </div></div>
</div>

<!-- ===== 7. MODAL ===== -->
<h2 class="section-title"><span class="sec-icon">🪟</span> Modal / Dialog <span class="sec-id">SEC-07</span></h2>
<div class="component-grid full-width">
  <div class="comp-card"><div class="comp-card-header">Modal Preview <span class="card-type">modal</span></div>
    <div class="comp-card-body">
      <div class="modal-preview">
        <div class="modal-box">
          <h4>Export Presentation</h4>
          <p>Choose your export format. The interactive version preserves all animations and click behaviors.</p>
          <div class="btn-row"><button class="btn btn-primary">📄 HTML</button><button class="btn btn-outline">📑 PDF</button><button class="btn">Cancel</button></div>
        </div>
      </div>
    </div></div>
</div>

<!-- ===== 8. INTERACTIVE SLIDE BLOCKS ===== -->
<h2 class="section-title"><span class="sec-icon">🧩</span> Interactive Slide Blocks <span class="sec-id">SEC-08</span></h2>

<div class="component-grid full-width">
  <!-- Interactive Image URL Customizer -->
  <div class="comp-card"><div class="comp-card-header">Interactive Image Block <span class="card-type">image</span></div>
    <div class="comp-card-body">
      <div class="image-block-container" style="max-width: 100%;">
        <div class="image-box-wrapper" style="height: 240px;">
          <img class="interactive-image" src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80" alt="Sample Image" />
          <button class="edit-image-overlay-btn">✏️ Change Image URL</button>
        </div>
        <p class="image-caption">Interactive Image — Click the edit button to paste a custom URL dynamically!</p>
      </div>
    </div></div>

  <!-- Accordion -->
  <div class="comp-card"><div class="comp-card-header">Accordion Block <span class="card-type">accordion</span></div>
    <div class="comp-card-body">
      <div class="accordion">
        <div class="accordion-item open"><button class="accordion-header">What is HTML?<svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="accordion-body"><div class="accordion-content"><p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page semantically.</p></div></div></div>
        <div class="accordion-item"><button class="accordion-header">What is CSS?<svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="accordion-body"><div class="accordion-content"><p>CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of HTML documents.</p></div></div></div>
        <div class="accordion-item"><button class="accordion-header">What is JavaScript?<svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></button><div class="accordion-body"><div class="accordion-content"><p>JavaScript is a programming language that enables interactive web pages and is an essential part of web applications.</p></div></div></div>
      </div>
    </div></div>

  <!-- Tabs -->
  <div class="comp-card"><div class="comp-card-header">Tabs Block <span class="card-type">tabs</span></div>
    <div class="comp-card-body">
      <div class="tabs-container">
        <div class="tabs-header">
          <button class="tab-btn active">Overview</button>
          <button class="tab-btn">Features</button>
          <button class="tab-btn">Examples</button>
        </div>
        <div class="tab-panel active"><p>This is the overview panel. Use tabs to organize content by perspective or category.</p></div>
        <div class="tab-panel"><p>Feature list goes here. Each tab can contain any block type including code, images, and lists.</p><div class="tab-features"><span class="tab-feature-tag">Interactive</span><span class="tab-feature-tag">Responsive</span><span class="tab-feature-tag">Themeable</span></div></div>
        <div class="tab-panel"><p>Code examples, live demos, or case studies can go in this panel.</p></div>
      </div>
    </div></div>

  <!-- Stepper -->
  <div class="comp-card"><div class="comp-card-header">Stepper Block <span class="card-type">stepper</span></div>
    <div class="comp-card-body">
      <div class="stepper">
        <div class="stepper-progress">
          <div class="step-dot active">1</div><div class="step-line"></div>
          <div class="step-dot">2</div><div class="step-line"></div>
          <div class="step-dot">3</div>
        </div>
        <div class="step-content active"><h4>Step 1: Setup</h4><p>Initialize your project with the required dependencies and configuration files.</p><div class="step-tip">Use npx create-vite@latest for a quick start.</div></div>
        <div class="step-content"><h4>Step 2: Build</h4><p>Create your components and connect them to your data layer.</p></div>
        <div class="step-content"><h4>Step 3: Deploy</h4><p>Push to production with a single command.</p></div>
        <div class="stepper-nav"><button class="nav-btn step-prev" disabled>← Previous</button><button class="nav-btn step-next">Next →</button></div>
      </div>
    </div></div>

  <!-- Flip Cards -->
  <div class="comp-card"><div class="comp-card-header">Flip Cards Block <span class="card-type">cards</span></div>
    <div class="comp-card-body">
      <div class="cards-grid">
        <div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front">DOM</div><div class="flip-card-back">Document Object Model — the tree representation of your HTML.</div></div></div>
        <div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front">API</div><div class="flip-card-back">Application Programming Interface — a contract between software systems.</div></div></div>
        <div class="flip-card"><div class="flip-card-inner"><div class="flip-card-front">SPA</div><div class="flip-card-back">Single Page Application — loads once, updates dynamically.</div></div></div>
      </div>
      <p class="flip-hint">Click any card to flip it</p>
    </div></div>

  <!-- Quiz -->
  <div class="comp-card"><div class="comp-card-header">Quiz Block <span class="card-type">quiz</span></div>
    <div class="comp-card-body">
      <div class="quiz-container">
        <div class="quiz-question" data-correct="2">
          <h4>Which language defines web page structure?</h4>
          <div class="quiz-options">
            <button class="quiz-option"><span class="option-letter">A</span> CSS</button>
            <button class="quiz-option"><span class="option-letter">B</span> JavaScript</button>
            <button class="quiz-option"><span class="option-letter">C</span> HTML</button>
            <button class="quiz-option"><span class="option-letter">D</span> Python</button>
          </div>
          <div class="quiz-explanation">HTML defines the structure. CSS handles styling, JavaScript handles behavior.</div>
        </div>
      </div>
    </div></div>

  <!-- Advanced Quiz -->
  <div class="comp-card"><div class="comp-card-header">Advanced Quiz Block (Submit to Grade) <span class="card-type">advanced-quiz</span></div>
    <div class="comp-card-body">
      <div class="advanced-quiz-container" data-total-questions="2">
        <div class="adv-question" data-question-index="0" data-correct="2">
          <h4>1. Which layout model is 2-dimensional?</h4>
          <div class="adv-options">
            <button class="adv-option" data-option-index="0"><span class="option-letter">A</span> Flexbox</button>
            <button class="adv-option" data-option-index="1"><span class="option-letter">B</span> Block flow</button>
            <button class="adv-option" data-option-index="2"><span class="option-letter">C</span> Grid</button>
            <button class="adv-option" data-option-index="3"><span class="option-letter">D</span> Absolute positioning</button>
          </div>
        </div>
        <div class="adv-question" data-question-index="1" data-correct="1">
          <h4>2. What does OKLCH provide over standard HSL?</h4>
          <div class="adv-options">
            <button class="adv-option" data-option-index="0"><span class="option-letter">A</span> Smaller asset sizes</button>
            <button class="adv-option" data-option-index="1"><span class="option-letter">B</span> Perceptually uniform brightness</button>
            <button class="adv-option" data-option-index="2"><span class="option-letter">C</span> Complete backwards compatibility</button>
          </div>
        </div>
        <div class="adv-quiz-action-row">
          <button class="btn btn-primary adv-submit-btn">📥 Submit Assessment</button>
        </div>
        <!-- Modal Overlay Popup -->
        <div class="adv-quiz-modal-backdrop" style="display: none;">
          <div class="adv-quiz-modal glassmorphic-panel stagger-item">
            <button class="adv-quiz-modal-close" aria-label="Close modal">&times;</button>
            <div class="adv-result-score">Score: <span class="score-fraction">0/0</span></div>
            <div class="adv-result-feedback"></div>
            <button class="adv-retry-btn" style="margin-top: 1.5rem;">🔄 Try Again</button>
          </div>
        </div>
      </div>
    </div></div>

  <!-- Compare -->
  <div class="comp-card"><div class="comp-card-header">Compare Block <span class="card-type">compare</span></div>
    <div class="comp-card-body">
      <div class="compare-container">
        <div class="compare-side side-blue"><h3>Option A</h3><ul class="compare-list"><li>Fast performance</li><li>Large community</li><li>Steeper learning curve</li></ul></div>
        <div class="compare-side side-green"><h3>Option B</h3><ul class="compare-list"><li>Easy to learn</li><li>Great documentation</li><li>Smaller ecosystem</li></ul></div>
        <div class="compare-verdict">Both are excellent. Choose based on your team's experience.</div>
      </div>
    </div></div>

  <!-- Timeline -->
  <div class="comp-card"><div class="comp-card-header">Timeline Block <span class="card-type">timeline</span></div>
    <div class="comp-card-body">
      <div class="timeline">
        <div class="timeline-item active"><div class="timeline-dot"></div><div class="timeline-year">2020</div><div class="timeline-title">Project Started</div><div class="timeline-desc">Initial research and prototyping phase began.</div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">2022</div><div class="timeline-title">Beta Launch</div><div class="timeline-desc">First public beta with core features.</div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">2024</div><div class="timeline-title">V2 Release</div><div class="timeline-desc">Major redesign with AI integration.</div></div>
      </div>
    </div></div>

  <!-- Summary -->
  <div class="comp-card"><div class="comp-card-header">Summary / Takeaway Block <span class="card-type">summary</span></div>
    <div class="comp-card-body">
      <ul class="summary-items">
        <li>HTML provides structure</li>
        <li>CSS provides styling</li>
        <li>JavaScript provides interactivity</li>
      </ul>
      <div class="summary-cta"><p>Start building your first project today!</p></div>
      <div class="summary-resources">
        <a href="#" class="resource-link">🔗 MDN Docs</a>
        <a href="#" class="resource-link">🔗 freeCodeCamp</a>
      </div>
    </div></div>

  <!-- Bullets -->
  <div class="comp-card"><div class="comp-card-header">Expandable Bullet List <span class="card-type">bullets</span></div>
    <div class="comp-card-body">
      <ul class="bullet-list">
        <li class="bullet-item"><div class="bullet-text">Click to expand detail</div><div class="bullet-detail"><p>Hidden detail text revealed on click. Use for progressive disclosure.</p></div></li>
        <li class="bullet-item expanded"><div class="bullet-text">Already expanded item</div><div class="bullet-detail"><p>This item is expanded by default to show what it looks like.</p></div></li>
        <li class="bullet-item"><div class="bullet-text">Another collapsible point</div><div class="bullet-detail"><p>More detail content here. Supports any length of text.</p></div></li>
      </ul>
    </div></div>
</div>

<!-- ===== 11. NEXT-GEN ADVANCED BLOCKS ===== -->
<h2 class="section-title"><span class="sec-icon">🚀</span> Next-Gen Advanced Blocks <span class="sec-id">SEC-11</span></h2>
<div class="component-grid full-width">
  <!-- Math Display Equation -->
  <div class="comp-card"><div class="comp-card-header">Math display equation <span class="card-type">math</span></div>
    <div class="comp-card-body">
      <div class="math-display-equation" data-latex="\Psi(x, t) = A e^{i(kx - \omega t)}">
        $$\Psi(x, t) = A e^{i(kx - \omega t)}$$
      </div>
      <p style="text-align:center; font-size:0.9rem; color:var(--color-text-muted); margin-top:0.5rem;">Rendered dynamically using high-performance KaTeX equations engine.</p>
    </div></div>

  <!-- Mermaid.js Visual Diagram -->
  <div class="comp-card"><div class="comp-card-header">Mermaid flowchart diagram <span class="card-type">mermaid</span></div>
    <div class="comp-card-body">
      <pre class="mermaid" style="text-align:center; background:none; border:none; padding:0;">
flowchart TD
    A[Start Presentation] --> B{P2P Synchronizer}
    B -->|BroadcastChannel| C[Presenter View Window]
    B -->|Iframe preview| D[Audience Slide Track]
      </pre>
    </div></div>

  <!-- Responsive Media Video Block -->
  <div class="comp-card"><div class="comp-card-header">Responsive media player frame <span class="card-type">video</span></div>
    <div class="comp-card-body">
      <div style="max-width:600px; margin:0 auto;">
        <a href="https://www.youtube.com/watch?v=M7lc1UVf-VE" target="_blank" class="video-link-card" aria-label="Watch video on YouTube">
          <div class="video-preview-thumbnail" style="background-image: url('https://img.youtube.com/vi/M7lc1UVf-VE/hqdefault.jpg')">
            <div class="video-play-overlay">
              <div class="video-play-btn">▶</div>
              <span class="video-play-text">Watch on YouTube</span>
            </div>
          </div>
        </a>
      </div>
    </div></div>

  <!-- Asymmetric Split Column Layout -->
  <div class="comp-card"><div class="comp-card-header">Asymmetric split columns layout <span class="card-type">split</span></div>
    <div class="comp-card-body">
      <div class="split-layout-container split-50-50">
        <div class="split-column left-column">
          <div style="padding:1.5rem; background:var(--color-surface-hover); border-radius:var(--radius-md); height:100%; border:1px solid var(--color-border-light);">
            <h4>👈 Left Content Block</h4>
            <p>Perfect for structured lists, descriptive highlights, and introductory context cards.</p>
          </div>
        </div>
        <div class="split-column right-column">
          <div style="padding:1.5rem; background:var(--color-primary-alpha); border-radius:var(--radius-md); border:1px dashed var(--color-primary); height:100%;">
            <h4 style="color:var(--color-primary-dark);">👉 Right Content Block</h4>
            <p style="color:var(--color-text-secondary);">Configured side-by-side with identical perceptual weighting to optimize comparisons.</p>
          </div>
        </div>
      </div>
    </div></div>

  <!-- Bento Grid Layout -->
  <div class="comp-card"><div class="comp-card-header">Bento Box Grid <span class="card-type">bento</span></div>
    <div class="comp-card-body">
      <div class="bento-grid" style="grid-template-areas: 'large small1' 'large small2'; gap: 1rem;">
        <div class="bento-card bento-large" style="grid-area: large; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); color: white; padding: 1.5rem; border-radius: var(--radius-md);">
          <span class="badge" style="background: rgba(0,0,0,0.3); color: white; margin-bottom: 0.5rem; display: inline-block;">Primary Hub</span>
          <h3 style="margin: 0 0 0.5rem; color: white;">Central Focus Area</h3>
          <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">The main bento cell draws the user's eye and contains core metadata.</p>
        </div>
        <div class="bento-card bento-small" style="grid-area: small1; background: var(--color-surface-hover); padding: 1.5rem; border-radius: var(--radius-md);">
          <h4 style="margin: 0 0 0.25rem;"><span style="font-size: 1.25rem; margin-right: 0.5rem;">⚡</span> Quick Stat</h4>
          <p style="margin: 0; font-size: 0.85rem; color: var(--color-text-secondary);">Secondary peripheral data stream.</p>
        </div>
        <div class="bento-card bento-small" style="grid-area: small2; background: var(--color-surface-hover); padding: 1.5rem; border-radius: var(--radius-md);">
          <h4 style="margin: 0 0 0.25rem;"><span style="font-size: 1.25rem; margin-right: 0.5rem;">🌐</span> Global State</h4>
          <p style="margin: 0; font-size: 0.85rem; color: var(--color-text-secondary);">System status and alerts.</p>
        </div>
      </div>
    </div></div>

  <!-- Quote Card -->
  <div class="comp-card"><div class="comp-card-header">Quote Card <span class="card-type">quote-card</span></div>
    <div class="comp-card-body">
      <div class="quote-card-container stagger">
        <blockquote class="quote-text stagger-item">"Good design is like a good film score. You shouldn't notice it until it makes you feel something profound."</blockquote>
        <div class="quote-author-row stagger-item">
          <div class="avatar quote-avatar" style="background-image: url('https://i.pravatar.cc/150?u=a042581f4e29026704d');"></div>
          <div class="quote-author-meta">
            <div class="quote-author-name">Denis Villeneuve</div>
            <div class="quote-author-role">Cinematic Visionary</div>
          </div>
        </div>
      </div>
    </div></div>

  <!-- Definition Card -->
  <div class="comp-card"><div class="comp-card-header">Definition Card <span class="card-type">definition-card</span></div>
    <div class="comp-card-body">
      <div class="definition-card-container stagger">
        <div class="definition-header stagger-item">
          <h3 class="definition-term">Hydration</h3>
          <span class="badge badge-pill pill-accent">Noun, Computing</span>
          <span class="definition-pronunciation">/haɪˈdreɪ.ʃən/</span>
        </div>
        <div class="definition-body stagger-item">
          <p class="definition-desc">The process of attaching React event listeners to a pre-rendered static HTML document, converting it into a fully interactive dynamic SPA.</p>
          <blockquote class="definition-example">"Server Components dramatically reduce the amount of JavaScript needed for hydration."</blockquote>
        </div>
      </div>
    </div></div>

  <!-- Analogy -->
  <div class="comp-card"><div class="comp-card-header">Technical Analogy <span class="card-type">analogy</span></div>
    <div class="comp-card-body">
      <div class="analogy-container stagger">
        <div class="analogy-split" style="display: flex; gap: 1rem; align-items: center;">
          <div class="analogy-side side-technical stagger-item" style="flex: 1; padding: 1.5rem; background: var(--color-bg-alt); border-left: 4px solid var(--color-primary);">
            <span class="badge pill-primary" style="margin-bottom: 0.5rem;">⚙️ Technical Concept</span>
            <p style="margin: 0; font-size: 0.9rem;">Deploying stateless compute functions and static caching to 200+ PoPs at the network edge.</p>
          </div>
          <div class="analogy-bridge stagger-item" style="font-weight: bold; color: var(--color-accent); text-align: center;">
            Is Like...
          </div>
          <div class="analogy-side side-realworld stagger-item" style="flex: 1; padding: 1.5rem; background: var(--color-bg-alt); border-left: 4px solid var(--color-warning);">
            <span class="badge pill-warning" style="margin-bottom: 0.5rem;">🌾 Real-world Analogy</span>
            <p style="margin: 0; font-size: 0.9rem;">Building a global network of local distribution warehouses so products can be delivered same-day.</p>
          </div>
        </div>
      </div>
    </div></div>

  <!-- Splash Image Layout -->
  <div class="comp-card"><div class="comp-card-header">Splash Image Layout <span class="card-type">splash</span></div>
    <div class="comp-card-body">
      <div class="splash-layout-container" style="display: flex; gap: 1rem; align-items: center; background: var(--color-bg-alt); padding: 1.5rem; border-radius: var(--radius-md);">
        <div class="splash-image-col" style="flex: 1; border-radius: var(--radius-md); overflow: hidden; max-height: 200px;">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" alt="Splash">
        </div>
        <div class="splash-text-col" style="flex: 1;">
          <h4 style="margin: 0 0 0.5rem;">Visual Impact</h4>
          <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-secondary);">Combine striking imagery with bold text to create memorable introductions.</p>
        </div>
      </div>
    </div></div>

  <!-- Horizontal Timeline -->
  <div class="comp-card"><div class="comp-card-header">Horizontal Timeline <span class="card-type">timeline-horizontal</span></div>
    <div class="comp-card-body">
      <div class="timeline-horizontal" style="display: flex; gap: 1rem; align-items: flex-start; padding: 2rem 0;">
        <div class="hz-timeline-item" style="flex: 1; position: relative;">
          <div class="hz-dot" style="width: 16px; height: 16px; border-radius: 50%; background: var(--color-primary); margin-bottom: 1rem;"></div>
          <div class="hz-year" style="font-weight: bold; font-size: 0.85rem; color: var(--color-text-muted);">Q1</div>
          <div class="hz-title" style="font-weight: 600; margin: 0.25rem 0;">Planning</div>
          <div class="hz-desc" style="font-size: 0.85rem; color: var(--color-text-secondary);">Requirements gathering.</div>
        </div>
        <div class="hz-timeline-item" style="flex: 1; position: relative;">
          <div class="hz-dot" style="width: 16px; height: 16px; border-radius: 50%; background: var(--color-accent); margin-bottom: 1rem;"></div>
          <div class="hz-year" style="font-weight: bold; font-size: 0.85rem; color: var(--color-text-muted);">Q2</div>
          <div class="hz-title" style="font-weight: 600; margin: 0.25rem 0;">Development</div>
          <div class="hz-desc" style="font-size: 0.85rem; color: var(--color-text-secondary);">Sprint execution.</div>
        </div>
        <div class="hz-timeline-item" style="flex: 1; position: relative;">
          <div class="hz-dot" style="width: 16px; height: 16px; border-radius: 50%; background: var(--color-success); margin-bottom: 1rem;"></div>
          <div class="hz-year" style="font-weight: bold; font-size: 0.85rem; color: var(--color-text-muted);">Q3</div>
          <div class="hz-title" style="font-weight: 600; margin: 0.25rem 0;">Launch</div>
          <div class="hz-desc" style="font-size: 0.85rem; color: var(--color-text-secondary);">Go to market.</div>
        </div>
      </div>
    </div></div>
</div>

<!-- ===== 9. TYPOGRAPHY ===== -->
<h2 class="section-title"><span class="sec-icon">🔤</span> Typography <span class="sec-id">SEC-09</span></h2>
<div class="component-grid full-width">
  <div class="comp-card"><div class="comp-card-header">Headings & Body <span class="card-type">type</span></div>
    <div class="comp-card-body">
      <h1 style="margin-bottom:0.5rem">Heading 1 — Outfit Bold</h1>
      <h2 style="margin-bottom:0.5rem">Heading 2 — Section Title</h2>
      <h3 style="margin-bottom:0.5rem">Heading 3 — Sub-section</h3>
      <h4 style="margin-bottom:0.75rem">Heading 4 — Block Title</h4>
      <p>Body text (Inter) — The quick brown fox jumps over the lazy dog. This is how paragraph text appears in the current theme with proper line-height and max-width constraints for readability.</p>
      <pre style="margin-top:0.75rem"><code>const greeting = "Hello, World!";
console.log(greeting); // JetBrains Mono</code></pre>
    </div></div>
</div>

<!-- ===== 10. TITLE SLIDE ===== -->
<h2 class="section-title"><span class="sec-icon">🎬</span> Title Slide Block <span class="sec-id">SEC-10</span></h2>
<div class="component-grid full-width">
  <div class="comp-card"><div class="comp-card-header">Title Layout <span class="card-type">title-slide</span></div>
    <div class="comp-card-body">
      <div class="slide-title" style="min-height:auto;padding:3rem 1rem">
        <span class="badge">Workshop · 45 min</span>
        <h1>SAMPLE_TITLE</h1>
        <p class="subtitle">SAMPLE_SUBTITLE — Customize this for any presentation topic</p>
        <div class="btn-row" style="margin-top:1rem;justify-content:center">
          <button class="btn btn-primary btn-lg">▶ Start Presentation</button>
          <button class="btn btn-outline btn-lg">📥 Download</button>
        </div>
      </div>
    </div></div>
</div>

</div> <!-- Close .catalog-viewport -->

<div style="text-align:center;padding:3rem 1rem;color:var(--color-text-muted);font-size:0.85rem;border-top:1px solid var(--color-border-light);margin-top:3rem">
  <p style="margin: 0 auto; max-width: none;">Lecta AI Component Catalog · Built with vanilla HTML/CSS/JS · Switch themes with settings gear above →</p>
</div>

<script>
${allJS}
document.addEventListener('DOMContentLoaded', () => {
  SidebarModule.init();
  InteractiveBlocks.init();
});
</script>
</body>
</html>`;

const outPath = path.join(ROOT, 'output/templates/all-designs.html');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, 'utf-8');
const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log('✅ Built: ' + outPath);
console.log('   Size: ' + kb + ' KB');
