const BASE_CSS = [
  'src/css/variables.css',
  'src/css/base.css',
  'src/css/blocks/core.css',
  'src/css/blocks/data.css',
  'src/css/blocks/overlays.css',
  'src/css/blocks/presenter.css',
  'src/css/animations.css',
  'src/css/sidebar.css',
];

const EMULATOR_CSS = [
  'src/emulator/emulator.css',
  'src/emulator/emulator-layouts.css',
];

const CORE_BLOCK_JS = [
  'src/js/blocks-core.js',
  'src/js/blocks-data.js',
  'src/js/presenter-overlay.js',
  'src/js/spotlight-search.js',
  'src/js/lazy-loaders.js',
  'src/js/blocks.js',
];

const CATALOG_BLOCK_JS = [
  'src/js/blocks-core.js',
  'src/js/blocks-data.js',
  'src/js/lazy-loaders.js',
  'src/js/blocks.js',
];

function getDeckCssFiles() {
  return [...BASE_CSS, ...EMULATOR_CSS];
}

function getCatalogCssFiles() {
  return [...BASE_CSS, 'src/catalog/catalog-css.css', ...EMULATOR_CSS];
}

function getDeckJsFiles() {
  return [
    'src/js/engine.js',
    ...CORE_BLOCK_JS,
    'src/js/themes.js',
    'src/js/sidebar.js',
    'src/emulator/emulator.js',
  ];
}

function getCatalogJsFiles() {
  return [
    ...CATALOG_BLOCK_JS,
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
