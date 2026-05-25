/**
 * LECTA AI — Interactive Block Orchestrator
 * Integrates modular JS units (blocks-core, blocks-data, presenter-overlay, spotlight-search, lazy-loaders)
 */

const InteractiveBlocks = (function () {

  function init() {
    if (window.InteractiveBlocksCore) {
      window.InteractiveBlocksCore.init();
    }
    if (window.InteractiveBlocksData) {
      window.InteractiveBlocksData.init();
    }
    if (window.PresenterOverlay) {
      window.PresenterOverlay.init();
    }
    if (window.SpotlightSearch) {
      window.SpotlightSearch.init();
    }
    if (window.LazyLoaders) {
      window.LazyLoaders.init();
    }
  }

  return { init };
})();

window.InteractiveBlocks = window.InteractiveBlocks || InteractiveBlocks;
