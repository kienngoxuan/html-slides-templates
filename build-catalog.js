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
  <div class="comp-card"><div class="comp-card-header">Stat Cards <span class="card-type">stat</span></div>
    <div class="comp-card-body"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem">
      <div class="stat-card"><div class="stat-value">10</div><div class="stat-label">Slides</div></div>
      <div class="stat-card"><div class="stat-value">45m</div><div class="stat-label">Duration</div></div>
      <div class="stat-card"><div class="stat-value">3</div><div class="stat-label">Quizzes</div></div>
    </div></div></div>
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
