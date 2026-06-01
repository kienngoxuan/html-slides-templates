/**
 * LECTA AI — Build Asset Manager
 * Manages CSS and JS assets required for compiled presentation slide decks.
 * Optimized with dynamic dependency filtering (Phase 5) to minimize HTML output sizes.
 */

const BASE_CSS = [
  'src/css/variables.css',
  'src/css/base.css',
  'src/css/blocks/presenter.css',
  'src/css/animations.css',
  'src/css/sidebar.css',
];

const BLOCK_CSS_MAPPING = {
  'core': 'src/css/blocks/core.css',
  'data': 'src/css/blocks/data.css',
  'overlays': 'src/css/blocks/overlays.css',
  'new-blocks': 'src/css/blocks/new-blocks.css',
};

const EMULATOR_CSS = [
  'src/emulator/emulator.css',
  'src/emulator/emulator-layouts.css',
];

const BASE_JS = [
  'src/primitives/atoms.js',
  'src/primitives/composites.js',
  'src/recipes/blocks.recipes.js',
  'src/js/renderer.js',
  'src/js/presenter-overlay.js',
  'src/js/spotlight-search.js',
  'src/js/lazy-loaders.js',
  'src/js/blocks.js',
];

const BLOCK_JS_MAPPING = {
  'blocks-core': 'src/js/blocks-core.js',
  'blocks-data': 'src/js/blocks-data.js',
};

const SYSTEM_JS = [
  'src/js/engine.js',
  'src/js/slide-health.js',
  'src/js/lesson-studio.js',
  'src/js/themes.js',
  'src/js/sidebar.js',
  'src/emulator/emulator.js',
];

/**
 * Resolves the CSS files needed for a deck, with optional dynamic filtering.
 */
function getDeckCssFiles(dependencies) {
  const cssList = [...BASE_CSS];
  
  if (dependencies && dependencies.cssModules) {
    // Only include css modules that are in the active dependencies set
    dependencies.cssModules.forEach(mod => {
      if (BLOCK_CSS_MAPPING[mod]) {
        cssList.push(BLOCK_CSS_MAPPING[mod]);
      }
    });
  } else {
    // Fallback: include all css blocks if no dependencies provided
    Object.values(BLOCK_CSS_MAPPING).forEach(file => cssList.push(file));
  }
  
  return [...cssList, ...EMULATOR_CSS];
}

/**
 * Resolves the JS files needed for a deck, with optional dynamic filtering.
 */
function getDeckJsFiles(dependencies) {
  const jsList = [];
  
  // Base core block JS
  BASE_JS.forEach(file => jsList.push(file));

  if (dependencies && dependencies.jsModules) {
    // Only include js modules that are in active dependencies set
    dependencies.jsModules.forEach(mod => {
      if (BLOCK_JS_MAPPING[mod]) {
        jsList.push(BLOCK_JS_MAPPING[mod]);
      }
    });
  } else {
    // Fallback: include all block modules if no dependencies provided
    Object.values(BLOCK_JS_MAPPING).forEach(file => jsList.push(file));
  }

  return [
    'src/js/engine.js',
    ...jsList,
    'src/js/slide-health.js',
    'src/js/lesson-studio.js',
    'src/js/themes.js',
    'src/js/sidebar.js',
    'src/emulator/emulator.js',
  ];
}

function getCatalogCssFiles() {
  const allCss = [...BASE_CSS];
  Object.values(BLOCK_CSS_MAPPING).forEach(file => allCss.push(file));
  return [...allCss, 'src/catalog/catalog-css.css', ...EMULATOR_CSS];
}

function getCatalogJsFiles() {
  const jsList = [
    'src/primitives/atoms.js',
    'src/primitives/composites.js',
    'src/recipes/blocks.recipes.js',
    'src/js/blocks-core.js',
    'src/js/blocks-data.js',
    'src/js/lazy-loaders.js',
    'src/js/blocks.js',
  ];
  return [
    ...jsList,
    'src/js/sidebar.js',
    'src/emulator/emulator.js',
  ];
}

module.exports = {
  getDeckCssFiles,
  getCatalogCssFiles,
  getDeckJsFiles,
  getCatalogJsFiles,
};
