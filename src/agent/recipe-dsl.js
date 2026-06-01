/**
 * LECTA AI — Recipe DSL Compiler
 * Enables agents to specify slides in a simplified declarative DSL.
 * Compiles the DSL representation into canonical slide engine JSON.
 */

const { BLOCK_ALIASES } = require('../core/alias-resolver');

/**
 * Standard templates for compiling specific DSL block shorthand definitions
 * to the exact schema properties required by Lecta.
 */
const DSL_BLOCK_COMPILERS = {
  'hero': (props) => ({
    type: 'title',
    data: {
      heading: props.title || 'Slide Title',
      subtitle: props.subtitle || '',
      badge: props.badge || '',
      speakerNotes: props.notes || ''
    }
  }),
  
  'bullets': (props) => ({
    type: 'bullets',
    data: {
      heading: props.title || 'Bullet List',
      icon: props.icon || '📌',
      items: (props.items || []).map(it => typeof it === 'string' ? { text: it, detail: '' } : it),
      speakerNotes: props.notes || ''
    }
  }),

  'stat-card': (props) => ({
    type: 'stats',
    data: {
      heading: props.title || 'Key Metrics',
      icon: props.icon || '📊',
      stats: [{
        value: props.value || '0',
        label: props.label || 'Metric Label',
        trend: props.trend || null,
        subtext: props.subtext || ''
      }],
      speakerNotes: props.notes || ''
    }
  }),

  'code-diff': (props) => ({
    type: 'code-diff',
    data: {
      heading: props.title || 'Code Evolution',
      icon: props.icon || '⚡',
      leftTitle: props.beforeTitle || 'Before',
      leftLang: props.lang || 'javascript',
      leftCode: props.beforeCode || '',
      rightTitle: props.afterTitle || 'After',
      rightLang: props.lang || 'javascript',
      rightCode: props.afterCode || '',
      speakerNotes: props.notes || ''
    }
  }),

  'bento': (props) => ({
    type: 'bento',
    data: {
      heading: props.title || 'Bento Overview',
      icon: props.icon || '🍱',
      items: (props.items || []).map((it, idx) => ({
        title: it.title || `Item ${idx + 1}`,
        content: it.content || '',
        size: it.size || 'small',
        icon: it.icon || '',
        badge: it.badge || '',
        bgGradient: it.bgGradient || null
      })),
      speakerNotes: props.notes || ''
    }
  })
};

/**
 * Compiles a declarative DSL slide presentation into canonical Lecta AI presentation JSON.
 */
function compileDSL(dslData) {
  if (!dslData) return null;

  const meta = {
    title: dslData.title || 'Declarative Slide Presentation',
    theme: dslData.theme || 'ocean',
    transitionPreset: dslData.transitionPreset || 'fade',
    aspectRatio: dslData.aspectRatio || '16:9',
    interactive: dslData.interactive !== undefined ? dslData.interactive : true
  };

  const slides = (dslData.slides || []).map((slide, idx) => {
    const id = slide.id || `slide-${idx + 1}`;
    
    // If it's already using a canonical type, pass it through after alias mapping
    let canonicalType = slide.type;
    if (BLOCK_ALIASES[canonicalType]) {
      canonicalType = BLOCK_ALIASES[canonicalType];
    }

    if (DSL_BLOCK_COMPILERS[canonicalType]) {
      // Compile using block-specific DSL compiler
      const compiled = DSL_BLOCK_COMPILERS[canonicalType](slide.props || slide.data || {});
      return {
        id,
        type: compiled.type,
        transitionPreset: slide.transitionPreset || meta.transitionPreset,
        data: compiled.data,
        flow: slide.flow || null
      };
    }

    // Default passthrough compiler
    return {
      id,
      type: canonicalType || 'title',
      transitionPreset: slide.transitionPreset || meta.transitionPreset,
      data: slide.data || slide.props || {},
      flow: slide.flow || null
    };
  });

  return { meta, slides };
}

module.exports = { compileDSL, DSL_BLOCK_COMPILERS };
