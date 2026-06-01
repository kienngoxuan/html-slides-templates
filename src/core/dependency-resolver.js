/**
 * LECTA AI — Dependency Resolver
 * Resolves block dependencies: determines which CSS/JS modules and lazy deps
 * are needed for a given slide deck based on the blocks registry.
 */

const path = require('path');
const { loadBlocksRegistry } = require('./schema-validator');

/**
 * Analyze a slide deck and return the set of dependencies needed.
 * @param {object} slideData - Expanded slide data with resolved types
 * @param {string} root - Project root path
 * @returns {{ cssModules: Set<string>, jsModules: Set<string>, lazyDeps: Set<string>, blockTypes: Set<string> }}
 */
function resolveDependencies(slideData, root) {
  const registry = loadBlocksRegistry(root);
  const cssModules = new Set();
  const jsModules = new Set();
  const lazyDeps = new Set();
  const blockTypes = new Set();

  if (!slideData || !Array.isArray(slideData.slides)) {
    return { cssModules, jsModules, lazyDeps, blockTypes };
  }

  function addBlockDependencies(type, data) {
    if (!type) return;
    blockTypes.add(type);

    const def = registry[type];
    if (def) {
      if (def.cssFile) cssModules.add(def.cssFile);
      if (def.jsModule) jsModules.add(def.jsModule);
      if (def.lazyDeps) {
        def.lazyDeps.forEach(dep => lazyDeps.add(dep));
      }
    }

    // Check nested blocks in split layout
    if (type === 'split' && data) {
      ['left', 'right'].forEach(side => {
        const sub = data[side];
        if (sub && sub.type) {
          addBlockDependencies(sub.type, sub.data);
          // Legacy check for split sub-blocks
          if (sub.type === 'math') lazyDeps.add('katex');
          if (sub.type === 'mermaid') lazyDeps.add('mermaid');
          if (sub.type === 'code') lazyDeps.add('prism');
        }
      });
    }
  }

  slideData.slides.forEach(slide => {
    addBlockDependencies(slide.type, slide.data);
  });

  return { cssModules, jsModules, lazyDeps, blockTypes };
}

/**
 * Get a dependency report as a plain object (for logging/debugging).
 */
function getDependencyReport(slideData, root) {
  const deps = resolveDependencies(slideData, root);
  return {
    blockTypes: Array.from(deps.blockTypes).sort(),
    cssModules: Array.from(deps.cssModules).sort(),
    jsModules: Array.from(deps.jsModules).sort(),
    lazyDeps: Array.from(deps.lazyDeps).sort(),
    totalBlocks: slideData.slides ? slideData.slides.length : 0,
    uniqueBlockTypes: deps.blockTypes.size,
  };
}

module.exports = { resolveDependencies, getDependencyReport };
