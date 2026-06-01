/**
 * LECTA AI — Schema Validator
 * Validates slide data against the blocks registry.
 * Registry-driven: reads blocks.registry.json to know what's valid.
 */

const fs = require('fs');
const path = require('path');

let _blocksRegistry = null;

function loadBlocksRegistry(root) {
  if (_blocksRegistry) return _blocksRegistry;
  try {
    const file = path.join(root, 'src/registry/blocks.registry.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    // Strip _meta key
    const registry = {};
    for (const key in data) {
      if (key !== '_meta') registry[key] = data[key];
    }
    _blocksRegistry = registry;
    return registry;
  } catch (err) {
    console.warn('Warning: Could not load blocks registry:', err.message);
    return {};
  }
}

/**
 * Validate a single slide against registry schema.
 * Returns array of error strings (empty = valid).
 */
function validateSlide(slide, index, dataFile, registry) {
  const errors = [];
  const prefix = `${dataFile} slide ${index + 1}`;

  if (!slide.id) {
    slide.id = `slide-${index + 1}`;
  }
  if (!slide.type) {
    errors.push(`${prefix}: missing required "type" field`);
    return errors;
  }
  if (!slide.data) {
    errors.push(`${prefix}: missing required "data" object`);
    return errors;
  }

  const blockDef = registry[slide.type];
  if (!blockDef) {
    errors.push(`${prefix}: unknown block type "${slide.type}"`);
    return errors;
  }

  // Check required props
  const d = slide.data;
  for (const prop of blockDef.requiredProps || []) {
    // For nested props like "left", "right" — check top-level data keys
    if (d[prop] === undefined || d[prop] === null) {
      // Special case: "heading" is optional for some blocks (title uses it, but url is required for image)
      // Only error if truly required
      errors.push(`${prefix} ("${slide.type}"): missing required prop "${prop}"`);
    }
  }

  // Check array prop if defined
  if (blockDef.arrayProp) {
    const arr = d[blockDef.arrayProp];
    if (!Array.isArray(arr)) {
      errors.push(`${prefix} ("${slide.type}"): "${blockDef.arrayProp}" must be an array`);
    } else if (arr.length === 0 && ['stats', 'checklist', 'timeline-horizontal'].includes(slide.type)) {
      errors.push(`${prefix} ("${slide.type}"): "${blockDef.arrayProp}" must be non-empty`);
    }
  }

  // Type-specific deep validation (quiz correct index, table columns, etc.)
  if ((slide.type === 'quiz' || slide.type === 'advanced-quiz') && Array.isArray(d.questions)) {
    d.questions.forEach((q, qi) => {
      if (q.correct === undefined || isNaN(parseInt(q.correct, 10))) {
        errors.push(`${prefix} ("${slide.type}"), question ${qi + 1}: "correct" index must be an integer`);
      }
      if (!Array.isArray(q.options)) {
        errors.push(`${prefix} ("${slide.type}"), question ${qi + 1}: "options" must be an array`);
      }
    });
  }

  if (slide.type === 'table' && Array.isArray(d.columns)) {
    d.columns.forEach((col, ci) => {
      if (!col.key || typeof col.key !== 'string') {
        errors.push(`${prefix} ("table"), column ${ci + 1}: "key" must be a non-empty string`);
      }
    });
  }

  // Validate flow steps if present
  if (slide.flow !== undefined) {
    if (!Array.isArray(slide.flow)) {
      errors.push(`${prefix}: "flow" must be an array when provided`);
    } else {
      slide.flow.forEach((step, si) => {
        if (!step || typeof step !== 'object') {
          errors.push(`${prefix}, flow step ${si + 1}: must be an object`);
        }
      });
    }
  }

  return errors;
}

/**
 * Validate full slide data structure.
 * Throws on fatal errors, returns warnings array.
 */
function validateSlideSchema(slideData, dataFile, root) {
  const registry = loadBlocksRegistry(root || process.cwd());

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

  const allErrors = [];
  slideData.slides.forEach((slide, idx) => {
    const errors = validateSlide(slide, idx, dataFile, registry);
    allErrors.push(...errors);
  });

  if (allErrors.length > 0) {
    throw new Error(`Validation failed for ${dataFile}:\n  ${allErrors.join('\n  ')}`);
  }
}

/**
 * Get block definition from registry.
 */
function getBlockDef(blockType, root) {
  const registry = loadBlocksRegistry(root || process.cwd());
  return registry[blockType] || null;
}

/**
 * List all registered block types.
 */
function listBlockTypes(root) {
  const registry = loadBlocksRegistry(root || process.cwd());
  return Object.keys(registry);
}

/**
 * List block types by category.
 */
function listBlocksByCategory(category, root) {
  const registry = loadBlocksRegistry(root || process.cwd());
  return Object.entries(registry)
    .filter(([, def]) => def.category === category)
    .map(([type]) => type);
}

module.exports = {
  validateSlideSchema,
  validateSlide,
  getBlockDef,
  listBlockTypes,
  listBlocksByCategory,
  loadBlocksRegistry,
};
