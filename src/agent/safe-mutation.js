/**
 * LECTA AI — Safe Mutation Zones
 * Provides a clean API for agents to make safe edits to slide decks.
 * Enforces boundary safety by restricting edits to mutable zones (values, props, variants)
 * and preventing corruption of immutable core layouts and engine code.
 */

const { getBlockDef } = require('../core/schema-validator');

// Configuration of allowed mutation fields per component level
const MUTATION_CONTRACT = {
  deck: {
    mutableFields: ['title', 'theme', 'transitionPreset', 'aspectRatio'],
    immutableFields: ['slides'] // Slide addition/removal must go through atomic list operations
  },
  slide: {
    mutableFields: ['transitionPreset', 'flow'],
    immutableFields: ['id', 'type', 'data'] // Change data structure through prop-level mutation
  },
  blockData: {
    // Top-level properties that agents are always allowed to mutate
    mutableProps: ['heading', 'subtext', 'title', 'subtitle', 'badge', 'icon', 'caption', 'explanation', 'verdict', 'latex', 'code'],
    // Specialized nested props that are safe to modify
    mutableArrayProps: ['items', 'steps', 'cards', 'questions', 'events', 'stats', 'resources', 'columns', 'rows', 'nodes', 'connections']
  }
};

/**
 * Validates whether a proposed mutation to a slide block is allowed under the contract.
 * @param {string} blockType - Canonical type of block being edited
 * @param {string} propPath - The property key or nested path being targeted
 * @returns {boolean}
 */
function isMutationAllowed(blockType, propPath) {
  const topKey = propPath.split('.')[0];
  
  // 1. Check general allowed mutable text properties
  if (MUTATION_CONTRACT.blockData.mutableProps.includes(topKey)) {
    return true;
  }
  
  // 2. Check structured arrays
  if (MUTATION_CONTRACT.blockData.mutableArrayProps.includes(topKey)) {
    return true;
  }

  // 3. Fallback to registry definition check
  const def = getBlockDef(blockType);
  if (def) {
    if (def.requiredProps && def.requiredProps.includes(topKey)) return true;
    if (def.arrayProp === topKey) return true;
  }

  return false;
}

/**
 * Safely updates a text property on a slide block.
 * Raises errors or blocks the edit if attempting to corrupt immutable structures.
 */
function mutateSlideProp(slideData, slideId, propPath, newValue) {
  // Deep clone to ensure mutation is atomic and side-effect free
  const clone = JSON.parse(JSON.stringify(slideData));
  const slide = clone.slides.find(s => s.id === slideId);

  if (!slide) {
    throw new Error(`Mutation Failed: Slide with ID "${slideId}" not found.`);
  }

  if (!isMutationAllowed(slide.type, propPath)) {
    throw new Error(`Mutation Blocked: Property "${propPath}" is protected. Agents are restricted to safe content zones.`);
  }

  const parts = propPath.split('.');
  let target = slide.data;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!target[part]) target[part] = {};
    target = target[part];
  }

  const lastKey = parts[parts.length - 1];
  target[lastKey] = newValue;

  return clone;
}

/**
 * Safely appends an item to a block's content array (e.g. adding a step, card, or bullet).
 */
function appendArrayItem(slideData, slideId, arrayPropName, newItem) {
  const clone = JSON.parse(JSON.stringify(slideData));
  const slide = clone.slides.find(s => s.id === slideId);

  if (!slide) throw new Error(`Slide "${slideId}" not found`);
  if (!MUTATION_CONTRACT.blockData.mutableArrayProps.includes(arrayPropName)) {
    throw new Error(`Mutation Blocked: Prop "${arrayPropName}" is not a safe array content zone.`);
  }

  if (!slide.data[arrayPropName]) {
    slide.data[arrayPropName] = [];
  }

  slide.data[arrayPropName].push(newItem);
  return clone;
}

module.exports = {
  isMutationAllowed,
  mutateSlideProp,
  appendArrayItem,
  MUTATION_CONTRACT
};
