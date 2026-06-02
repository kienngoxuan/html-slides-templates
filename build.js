#!/usr/bin/env node
/**
 * LECTA AI — Build Script
 * Assembles modular CSS/JS/data into a single self-contained HTML file.
 * Uses registry-first pipeline (Phase 2) for alias resolution, validation, and dependency analysis.
 */

const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const { readFiles, loadFaviconDataURI, renderThemeDots, renderFontFaceCSS } = require('./src/build/utils');
const { getDeckCssFiles, getDeckJsFiles } = require('./src/build/assets');
const { LIGHT_THEMES, DARK_THEMES } = require('./src/build/themes');
const { FONT_FILES } = require('./src/build/fonts');
// Phase 2: Registry-first pipeline
const { resolveManifest } = require('./src/core/manifest-resolver');

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

function loadPrimitives(root) {
  try {
    const file = path.join(root, 'src/data/primitives.json');
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (err) {
    return {};
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

// Template Library rendering moved to client-side



// Assembles a specific JSON file into a target HTML file
function buildSlideDeck(dataFile, outputFile) {
  // Phase 2: Registry-first pipeline — resolve aliases, validate, analyze dependencies
  const { slideData, dependencies, report } = resolveManifest(dataFile, ROOT);
  
  const meta = slideData.meta;
  const lessonContext = buildLessonContext(meta);
  const templateLibrary = loadTemplateLibrary(ROOT);
  const templateLibraryJSON = JSON.stringify(templateLibrary).replace(/<\/script/gi, '<\\/script');
  const templateLibraryHTML = '<div id="template-library-container"></div>'; // Hydrated client-side

  // Load favicon if available
  const faviconDataURI = loadFaviconDataURI(ROOT);

  // CSS
  const fontFaceCSS = renderFontFaceCSS(ROOT, FONT_FILES);
  const allCSS = readFiles(ROOT, getDeckCssFiles(dependencies));
  const allJS = readFiles(ROOT, getDeckJsFiles(dependencies));

  // Slides HTML & Thumbnails will now be rendered client-side
  const slideDataJSON = JSON.stringify(slideData).replace(/<\/script/gi, '<\\/script');
  const slidesHTML = ''; // Hydrated client-side
  const thumbsHTML = ''; // Hydrated client-side

  // Light themes for gear panel
  const lightThemeDotItems = renderThemeDots(LIGHT_THEMES, meta.theme);
  const darkThemeDotItems = renderThemeDots(DARK_THEMES);

  const studentAttr = meta.students ? ` data-students="${JSON.stringify(meta.students).replace(/"/g, '&quot;')}"` : '';
  const deckId = meta.id || meta.title || 'lecta-deck';
  const deckIdAttr = ` data-deck-id="${escapeAttr(deckId)}"`;
  const lessonContextJSON = JSON.stringify(lessonContext).replace(/<\/script/gi, '<\\/script');

  
  const templateHtml = fs.readFileSync(path.join(ROOT, 'src/build/deck.html'), 'utf-8');
  const faviconTag = faviconDataURI ? `<link rel="icon" type="image/png" href="${faviconDataURI}">` : '';
  const progressWidth = Math.round(100 / slideData.slides.length);
  const lessonDuration = meta.duration || 45;
  const lessonAvg = (lessonDuration / slideData.slides.length).toFixed(1);

  // Expose global window config for sidebar themes
  const configJS = `
  window.LECTA_CONFIG = {
    LIGHT_THEMES: ${JSON.stringify(LIGHT_THEMES)},
    DARK_THEMES: ${JSON.stringify(DARK_THEMES)}
  };
  `;

  let html = templateHtml
    .replace('{{THEME}}', escapeHtml(meta.theme || 'ocean'))
    .replace('{{FAVICON_LINK}}', faviconTag)
    .replace('{{DESCRIPTION}}', escapeHtml(meta.subtitle || 'Interactive slide deck built with Lecta AI'))
    .replace('{{TITLE}}', escapeHtml(meta.title || 'Lecta AI Presentation'))
    .replace('{{FONT_FACE_CSS}}', fontFaceCSS)
    .replace('{{ALL_CSS}}', allCSS)
    .replace('{{STUDENT_ATTR}}', studentAttr)
    .replace('{{DECK_ID_ATTR}}', deckIdAttr)
    .replace('{{PROGRESS_WIDTH}}', progressWidth)
    .replace('{{LIGHT_THEME_DOTS}}', lightThemeDotItems)
    .replace('{{DARK_THEME_DOTS}}', darkThemeDotItems)
    .replace('{{SLIDES_HTML}}', slidesHTML)
    .replace('{{THUMBS_HTML}}', thumbsHTML)
    .replace('{{SLIDE_COUNT}}', slideData.slides.length)
    .replace('{{TEMPLATE_LIBRARY_HTML}}', templateLibraryHTML)
    .replace('{{CTX_AUDIENCE}}', escapeAttr(lessonContext.audience))
    .replace('{{CTX_TOPIC}}', escapeAttr(lessonContext.topic))
    .replace('{{CTX_LESSON_LENGTH}}', lessonContext.lessonLength)
    .replace('{{CTX_PRIMARY_COLOR}}', escapeAttr(lessonContext.primaryColor))
    .replace('{{LESSON_DURATION}}', lessonDuration)
    .replace('{{LESSON_AVG}}', lessonAvg)
    .replace('{{LESSON_CONTEXT_JSON}}', lessonContextJSON)
    .replace('{{SLIDE_DATA_JSON}}', slideDataJSON)
    .replace('{{TEMPLATE_LIBRARY_JSON}}', templateLibraryJSON)
    .replace('{{ALL_JS}}', configJS + '\n' + allJS);

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
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample6-slides.json'),
    path.join(ROOT, 'output/templates/sample6.html')
  );
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample7-slides.json'),
    path.join(ROOT, 'output/templates/sample7.html')
  );
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample8-slides.json'),
    path.join(ROOT, 'output/templates/sample8.html')
  );
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample9-slides.json'),
    path.join(ROOT, 'output/templates/sample9.html')
  );
  buildSlideDeck(
    path.join(ROOT, 'src/data/sample10-slides.json'),
    path.join(ROOT, 'output/templates/sample10.html')
  );

  // Build catalog programmatic fallback
  try {
    require('./build-catalog.js');
  } catch (err) {
    console.error('⚠️ Could not run build-catalog.js fallback:', err);
  }
}
