/**
 * LECTA AI — Presentation Constraint Engine
 * Analyzes presentation slide decks for structural, density, and formatting issues.
 * Prevents "AI density bloat" (too many bullets, massive paragraphs, excessive animations)
 * to ensure that compiled slides maintain a highly professional, human-designed aesthetic.
 */

const LIMITS = {
  bullets: { maxItems: 7, maxTextLength: 120 },
  accordion: { maxItems: 6, maxTextLength: 200 },
  tabs: { maxTabs: 5, maxContentLength: 400 },
  stepper: { maxSteps: 6, maxTextLength: 250 },
  cards: { maxCards: 6 },
  bento: { maxItems: 8 },
  stats: { maxStats: 4 },
  global: {
    maxTextLength: 600, // Warn on massive walls of text
    maxFlowSteps: 12   // Limit dynamic stagger animation costs
  }
};

/**
 * Checks a slide for compliance with visual and performance limits.
 * Returns a list of violations (empty = perfect pass).
 */
function checkConstraints(slide) {
  const violations = [];
  const type = slide.type;
  const d = slide.data || {};
  const prefix = `[Slide "${slide.id}"]`;

  // 1. Text walls validation
  if (d.heading && d.heading.length > 100) {
    violations.push({
      type: 'HEADER_TOO_LONG',
      severity: 'warning',
      message: `${prefix}: Slide title exceeds 100 characters. Keep headers concise.`
    });
  }

  // 2. Block-specific validation
  const limit = LIMITS[type];
  if (limit) {
    // Array length checks
    if (type === 'bullets' && Array.isArray(d.items)) {
      if (d.items.length > limit.maxItems) {
        violations.push({
          type: 'EXCESSIVE_ITEMS',
          severity: 'error',
          message: `${prefix}: Contains ${d.items.length} bullet points (Max allowed: ${limit.maxItems} for clean layout).`
        });
      }
      d.items.forEach((it, idx) => {
        if (it.text && it.text.length > limit.maxTextLength) {
          violations.push({
            type: 'TEXT_TOO_LONG',
            severity: 'warning',
            message: `${prefix} bullet ${idx + 1}: Text exceeds ${limit.maxTextLength} chars. Recommended to shorten or move to speaker notes.`
          });
        }
      });
    }

    if (type === 'accordion' && Array.isArray(d.items)) {
      if (d.items.length > limit.maxItems) {
        violations.push({
          type: 'EXCESSIVE_ITEMS',
          severity: 'error',
          message: `${prefix}: Contains ${d.items.length} accordion sections (Max allowed: ${limit.maxItems}).`
        });
      }
    }

    if (type === 'tabs' && Array.isArray(d.tabs)) {
      if (d.tabs.length > limit.maxTabs) {
        violations.push({
          type: 'EXCESSIVE_ITEMS',
          severity: 'error',
          message: `${prefix}: Contains ${d.tabs.length} tabs (Max allowed: ${limit.maxTabs}).`
        });
      }
    }

    if (type === 'stepper' && Array.isArray(d.steps)) {
      if (d.steps.length > limit.maxSteps) {
        violations.push({
          type: 'EXCESSIVE_ITEMS',
          severity: 'error',
          message: `${prefix}: Contains ${d.steps.length} workflow steps (Max allowed: ${limit.maxSteps}).`
        });
      }
    }

    if (type === 'cards' && Array.isArray(d.cards)) {
      if (d.cards.length > limit.maxCards) {
        violations.push({
          type: 'EXCESSIVE_ITEMS',
          severity: 'error',
          message: `${prefix}: Contains ${d.cards.length} flip cards (Max allowed: ${limit.maxCards} to prevent vertical overflow).`
        });
      }
    }

    if (type === 'bento' && Array.isArray(d.items)) {
      if (d.items.length > limit.maxItems) {
        violations.push({
          type: 'EXCESSIVE_ITEMS',
          severity: 'error',
          message: `${prefix}: Bento grid contains ${d.items.length} cards (Max allowed: ${limit.maxItems}).`
        });
      }
    }

    if (type === 'stats' && Array.isArray(d.stats)) {
      if (d.stats.length > limit.maxStats) {
        violations.push({
          type: 'EXCESSIVE_ITEMS',
          severity: 'error',
          message: `${prefix}: Stats deck contains ${d.stats.length} metrics (Max allowed: ${limit.maxStats} for horizontal symmetry).`
        });
      }
    }
  }

  // 3. Animation budget check
  if (slide.flow && slide.flow.length > LIMITS.global.maxFlowSteps) {
    violations.push({
      type: 'ANIMATION_BUDGET_EXCEEDED',
      severity: 'warning',
      message: `${prefix}: Stagger animation has ${slide.flow.length} flow triggers. Recommended to reduce to under ${LIMITS.global.maxFlowSteps} steps.`
    });
  }

  return violations;
}

/**
 * Analyzes an entire presentation and outputs an audit report.
 */
function analyzePresentation(slideData) {
  const allViolations = [];
  if (!slideData || !Array.isArray(slideData.slides)) {
    return { valid: true, violations: [] };
  }

  slideData.slides.forEach(slide => {
    allViolations.push(...checkConstraints(slide));
  });

  const errors = allViolations.filter(v => v.severity === 'error');
  const warnings = allViolations.filter(v => v.severity === 'warning');

  return {
    valid: errors.length === 0,
    violations: allViolations,
    errorCount: errors.length,
    warningCount: warnings.length
  };
}

module.exports = {
  checkConstraints,
  analyzePresentation,
  LIMITS
};
