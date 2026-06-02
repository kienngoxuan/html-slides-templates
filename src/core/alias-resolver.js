/**
 * LECTA AI — Alias Resolver
 * Resolves $ref primitives and block type aliases to canonical forms.
 * Reuses the existing expandRefs logic but adds alias normalization.
 */

const fs = require('fs');
const path = require('path');



/**
 * Load primitives.json from disk
 */
function loadPrimitives(root) {
  try {
    const file = path.join(root, 'src/data/primitives.json');
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (err) {
    return {};
  }
}

/**
 * Deep-expand all $ref pointers in a data tree using primitives map.
 * Reused from build.js — single source of truth for ref expansion.
 */
function expandRefs(obj, primitives) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = expandRefs(obj[i], primitives);
    }
  } else if (obj && typeof obj === 'object') {
    if (obj.$ref) {
      const refId = obj.$ref;
      if (!primitives[refId]) {
        throw new Error(`Alias resolution failed: Missing primitive ref: ${refId}`);
      }
      const base = JSON.parse(JSON.stringify(primitives[refId]));
      for (const key in obj) {
        if (key === '$ref') continue;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && typeof base[key] === 'object' && !Array.isArray(base[key])) {
          base[key] = { ...base[key], ...obj[key] };
        } else {
          base[key] = obj[key];
        }
      }
      obj = base;
    }
    for (const key in obj) {
      obj[key] = expandRefs(obj[key], primitives);
    }
  }
  return obj;
}

/**
 * Full alias resolution pipeline: load primitives → expand $refs
 */
function resolveAliases(slideData, root) {
  const primitives = loadPrimitives(root);
  return expandRefs(JSON.parse(JSON.stringify(slideData)), primitives);
}

module.exports = { loadPrimitives, expandRefs, resolveAliases };
