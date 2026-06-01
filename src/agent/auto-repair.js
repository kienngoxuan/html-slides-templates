/**
 * LECTA AI — Auto-Repair / Fallback Engine
 * Automatically corrects/fixes slide layout violations detected by the Constraint Engine.
 * Trims excessive bullets, moves excess items to speaker notes, wraps long titles,
 * and scales down density to ensure slides build cleanly and look human-perfect.
 */

const { checkConstraints, LIMITS } = require('./constraint-engine');

/**
 * Repairs a single slide if it has any constraint violations.
 * @param {object} slide - The raw slide definition
 * @returns {object} The repaired slide definition
 */
function repairSlide(slide) {
  // Deep clone to avoid side-effects
  const repaired = JSON.parse(JSON.stringify(slide));
  const violations = checkConstraints(repaired);

  if (violations.length === 0) return repaired;

  const type = repaired.type;
  const d = repaired.data || {};

  // Initialize speaker notes backup area if items are removed
  if (!d.speakerNotes) d.speakerNotes = '';

  violations.forEach(v => {
    switch (v.type) {
      case 'HEADER_TOO_LONG':
        // Wrap/truncate header to 97 characters with ellipsis
        if (d.heading && d.heading.length > 100) {
          d.heading = d.heading.slice(0, 97) + '...';
        }
        break;

      case 'EXCESSIVE_ITEMS':
        // Truncate arrays to maximum safe limit and dump the rest to speaker notes
        const limit = LIMITS[type];
        if (limit && limit.maxItems) {
          let arrayKey = null;
          if (type === 'bullets' && Array.isArray(d.items)) arrayKey = 'items';
          if (type === 'accordion' && Array.isArray(d.items)) arrayKey = 'items';
          if (type === 'tabs' && Array.isArray(d.tabs)) arrayKey = 'tabs';
          if (type === 'stepper' && Array.isArray(d.steps)) arrayKey = 'steps';
          if (type === 'cards' && Array.isArray(d.cards)) arrayKey = 'cards';
          if (type === 'bento' && Array.isArray(d.items)) arrayKey = 'items';
          if (type === 'stats' && Array.isArray(d.stats)) arrayKey = 'stats';

          if (arrayKey && d[arrayKey].length > limit.maxItems) {
            const removed = d[arrayKey].slice(limit.maxItems);
            d[arrayKey] = d[arrayKey].slice(0, limit.maxItems);
            
            // Format removed items into speaker notes for human presenter reference
            d.speakerNotes += `\n[Auto-Repair Archive] Exceeded max allowed items: \n` + 
              removed.map((it, idx) => ` - ${it.text || it.title || it.label || JSON.stringify(it)}`).join('\n');
          }
        }
        break;

      case 'TEXT_TOO_LONG':
        // Shorten extremely long bullet point texts
        if (type === 'bullets' && Array.isArray(d.items)) {
          d.items.forEach(it => {
            if (it.text && it.text.length > LIMITS.bullets.maxTextLength) {
              if (!d.speakerNotes.includes(it.text)) {
                d.speakerNotes += `\n[Full Bullet Text]: ${it.text}`;
              }
              it.text = it.text.slice(0, LIMITS.bullets.maxTextLength - 3) + '...';
            }
          });
        }
        break;

      case 'ANIMATION_BUDGET_EXCEEDED':
        // Squash stagger flow list to fit limits by removing trailing flow animations
        if (repaired.flow && repaired.flow.length > LIMITS.global.maxFlowSteps) {
          repaired.flow = repaired.flow.slice(0, LIMITS.global.maxFlowSteps);
        }
        break;

      default:
        break;
    }
  });

  return repaired;
}

/**
 * Repairs a whole presentation, returning a fully compliant copy.
 */
function repairPresentation(slideData) {
  if (!slideData || !Array.isArray(slideData.slides)) return slideData;
  
  const clone = JSON.parse(JSON.stringify(slideData));
  clone.slides = clone.slides.map(slide => repairSlide(slide));
  
  return clone;
}

module.exports = {
  repairSlide,
  repairPresentation
};
