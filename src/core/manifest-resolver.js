/**
 * LECTA AI — Manifest Resolver
 * Orchestrates the full resolution pipeline:
 *   1. Load raw JSON slide data
 *   2. Resolve aliases ($ref expansion + block type normalization)
 *   3. Validate against registry schema
 *   4. Resolve dependencies
 *   5. Return fully resolved manifest
 *
 * This is the single entry point for the build pipeline.
 * build.js calls this instead of doing each step manually.
 */

const fs = require('fs');
const path = require('path');
const { resolveAliases } = require('./alias-resolver');
const { validateSlideSchema, getBlockDef, listBlockTypes, loadBlocksRegistry } = require('./schema-validator');
const { resolveDependencies, getDependencyReport } = require('./dependency-resolver');

/**
 * Load, resolve, validate, and analyze a slide deck JSON file.
 * @param {string} dataFile - Absolute path to slide JSON file
 * @param {string} root - Project root directory
 * @returns {{ slideData: object, dependencies: object, report: object }}
 */
function resolveManifest(dataFile, root) {
  // 1. Load raw JSON
  const raw = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

  // 2. Resolve aliases ($ref + type normalization)
  const slideData = resolveAliases(raw, root);

  // 3. Validate against registry
  validateSlideSchema(slideData, dataFile, root);

  // 4. Resolve dependencies
  const dependencies = resolveDependencies(slideData, root);
  const report = getDependencyReport(slideData, root);

  return { slideData, dependencies, report };
}

/**
 * Quick lookup: get block info from registry.
 */
function lookupBlock(blockType, root) {
  return getBlockDef(blockType, root);
}

/**
 * Quick lookup: list all available block types.
 */
function availableBlocks(root) {
  return listBlockTypes(root);
}

/**
 * Get the full blocks registry object.
 */
function getRegistry(root) {
  return loadBlocksRegistry(root);
}

module.exports = {
  resolveManifest,
  lookupBlock,
  availableBlocks,
  getRegistry,
};
