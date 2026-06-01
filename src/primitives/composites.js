/**
 * LECTA AI — Composite Builders
 * Mid-level components built from atomic primitives.
 * Each composite = a reusable block fragment (e.g. quiz-card, timeline-item, stat-card).
 * Used by renderer.js to assemble full blocks without duplicating HTML patterns.
 */

(function (exports) {

  // Import atoms (works in Node and browser)
  const A = (typeof require !== 'undefined')
    ? require('./atoms')
    : (window.LectaAtoms || {});

  /* ─── Quiz Question Card (shared by quiz + advanced-quiz) ─── */
  function quizQuestionCard(q, qi, opts = {}) {
    const variant = opts.variant || 'standard'; // 'standard' | 'advanced'
    const optionClass = variant === 'advanced' ? 'adv-option' : 'quiz-option';
    const questionClass = variant === 'advanced' ? 'adv-question' : 'quiz-question';
    const extraAttrs = variant === 'advanced' ? ` data-question-index="${qi}"` : '';

    const optionsHTML = q.options.map((o, oi) =>
      `<button class="${optionClass}" ${variant === 'advanced' ? `data-option-index="${oi}"` : ''}>
            ${A.optionLetter(oi)}
            ${A.esc(o)}
          </button>`
    ).join('\n          ');

    let extra = '';
    if (variant === 'standard' && q.explanation) {
      extra = `\n        <div class="quiz-explanation">${A.esc(q.explanation)}</div>`;
    }

    return `<div class="${questionClass}" data-correct="${q.correct}"${extraAttrs}>
        <h4>${qi + 1}. ${A.esc(q.question)}</h4>
        <div class="${variant === 'advanced' ? 'adv-options' : 'quiz-options'}">
          ${optionsHTML}
        </div>${extra}
      </div>`;
  }

  /* ─── Timeline Item (shared by timeline vertical) ─── */
  function timelineItem(event, index) {
    return `<div class="timeline-item"${A.flowId('timeline', index)}>
        <div class="timeline-dot"></div>
        <div class="timeline-year">${A.esc(event.year)}</div>
        <div class="timeline-title">${A.esc(event.title)}</div>
        <div class="timeline-desc">${A.esc(event.description)}</div>
      </div>`;
  }

  /* ─── Timeline Horizontal Item ─── */
  function timelineHItem(event, index) {
    return `<div class="timeline-h-item"${A.flowId('timeline-h', index)}>
        <div class="timeline-h-dot"></div>
        <div class="timeline-h-card">
          <div class="timeline-h-year">${A.esc(event.year)}</div>
          <div class="timeline-h-title">${A.esc(event.title)}</div>
          ${event.desc ? `<div class="timeline-h-desc">${A.esc(event.desc)}</div>` : ''}
        </div>
      </div>`;
  }

  /* ─── Stat Card ─── */
  function statCard(stat, index) {
    const valueHTML = A.statValue(stat.value);
    const detailText = stat.trend || stat.subtext || '';
    
    let isUp = true;
    if (stat.hasOwnProperty('trendUp')) {
      isUp = stat.trendUp;
    } else if (typeof detailText === 'string') {
      isUp = detailText.includes('+') || !detailText.toLowerCase().includes('-');
    }
    
    const dirClass = isUp ? 'trend-up' : 'trend-down';
    const arrow = isUp ? '↑' : '↓';
    
    let dropdownHTML = '';
    if (detailText) {
      dropdownHTML = `
        <div class="stat-toggle-btn ${dirClass}" aria-label="Toggle Details">
          <span class="stat-toggle-icon">${arrow}</span>
        </div>
        <div class="stat-dropdown">
          <div class="stat-dropdown-inner">
            <span class="stat-dropdown-text">${A.esc(detailText)}</span>
          </div>
        </div>`;
    }

    return `<div class="stat-card${detailText ? ' expandable' : ''}"${A.flowId('stat', index)}>
        <div class="stat-value">${valueHTML}</div>
        <div class="stat-label">${A.esc(stat.label)}</div>
        ${dropdownHTML}
      </div>`;
  }

  /* ─── Bento Card ─── */
  function bentoCard(item, index) {
    const bgStyle = item.bgGradient
      ? `background: linear-gradient(135deg, ${item.bgGradient.split(' to ')[0]}, ${item.bgGradient.split(' to ')[1] || 'transparent'}); border: none;`
      : '';
    const hasBg = item.bgGradient ? ' bento-card-gradient' : '';
    const sizeClass = `bento-size-${item.size || 'small'}`;

    return `<div class="bento-card ${sizeClass}${hasBg}" style="${bgStyle}"${A.flowId('bento', index)}>
          ${item.badge ? `<span class="bento-badge">${A.esc(item.badge)}</span>` : ''}
          ${item.icon ? `<div class="bento-icon">${A.esc(item.icon)}</div>` : ''}
          <div class="bento-card-content">
            <h3>${A.esc(item.title)}</h3>
            <p>${A.esc(item.content)}</p>
          </div>
        </div>`;
  }

  /* ─── Bullet Item (expandable) ─── */
  function bulletItem(item, index) {
    const isObj = item && typeof item === 'object';
    const text = isObj ? (item.text || '') : item;
    const detail = isObj ? (item.detail || '') : '';
    
    return `<li class="bullet-item"${A.flowId('bullet', index)}>
        <div class="bullet-text">${A.esc(text)}</div>
        ${detail ? `<div class="bullet-detail"><p>${A.esc(detail)}</p></div>` : ''}
      </li>`;
  }

  /* ─── Accordion Item ─── */
  function accordionItem(item, index, slideId) {
    return `<div class="accordion-item"${A.flowId('accordion', index)}>
        <button class="accordion-header" role="button" aria-expanded="false" aria-controls="accordion-content-${slideId}-${index}" id="accordion-header-${slideId}-${index}">
          ${A.esc(item.title)}
          ${A.chevronSvg()}
        </button>
        <div class="accordion-body" role="region" aria-labelledby="accordion-header-${slideId}-${index}" id="accordion-content-${slideId}-${index}">
          <div class="accordion-content">
            <p>${A.esc(item.content)}</p>
            ${item.example ? A.codeBlock(item.example) : ''}
          </div>
        </div>
      </div>`;
  }

  /* ─── Tab (button + panel) ─── */
  function tabButton(label, index, slideId, isActive) {
    return `<button class="tab-btn${isActive ? ' active' : ''}" role="tab" aria-selected="${isActive}" aria-controls="panel-${slideId}-${index}" id="tab-${slideId}-${index}">${A.esc(label)}</button>`;
  }

  function tabPanel(tab, index, slideId, isActive) {
    return `<div class="tab-panel${isActive ? ' active' : ''}" role="tabpanel" aria-labelledby="tab-${slideId}-${index}" id="panel-${slideId}-${index}"${A.flowId('tab-panel', index)}>
        <p>${A.esc(tab.content)}</p>
        ${tab.features ? `<div class="tab-features">${tab.features.map(f => `<span class="tab-feature-tag">${A.esc(f)}</span>`).join('')}</div>` : ''}
        ${tab.code ? A.codeBlock(tab.code) : ''}
      </div>`;
  }

  /* ─── Step (stepper) ─── */
  function stepDot(index, total, isActive) {
    let html = `<div class="step-dot${isActive ? ' active' : ''}">${index + 1}</div>`;
    if (index < total - 1) html += `<div class="step-line"></div>`;
    return html;
  }

  function stepContent(step, index) {
    return `<div class="step-content${index === 0 ? ' active' : ''}"${A.flowId('step', index)}>
        <h4>${A.esc(step.title)}</h4>
        <p>${A.esc(step.content)}</p>
        ${A.callout(step.tip)}
      </div>`;
  }

  /* ─── Flip Card ─── */
  function flipCard(card, index) {
    return `<div class="flip-card"${A.flowId('card', index)}>
        <div class="flip-card-inner">
          <div class="flip-card-front">${A.esc(card.front)}</div>
          <div class="flip-card-back">${A.esc(card.back)}</div>
        </div>
      </div>`;
  }

  /* ─── Checklist Item ─── */
  function checklistItem(item, index) {
    return `<li class="checklist-item${item.completed ? ' checked' : ''}"${A.flowId('check', index)} data-checklist-id="${A.esc(item.id || String(index))}" role="listitem">
        <button class="checklist-toggle" aria-label="Toggle ${A.esc(item.text)}" aria-pressed="${item.completed ? 'true' : 'false'}">
          <span class="checklist-box" aria-hidden="true">${item.completed ? '✓' : ''}</span>
        </button>
        <span class="checklist-text">${A.esc(item.text)}</span>
      </li>`;
  }

  /* ─── Compare Side ─── */
  function compareSide(side, color, sideLabel) {
    return `<div class="compare-side side-${color || (sideLabel === 'left' ? 'blue' : 'green')}">
        <h3>${A.esc(side.title)}</h3>
        <ul class="compare-list">
          ${side.items.map((item, idx) => `<li${A.flowId(`compare-${sideLabel}`, idx)}>${A.esc(item)}</li>`).join('\n          ')}
        </ul>
      </div>`;
  }

  /* ─── Code Diff Pane ─── */
  function codeDiffPane(title, lang, code, type, flowIdName) {
    return `<div class="code-diff-pane" data-flow-id="${flowIdName}">
        ${A.codeDiffHeader(title, lang, type)}
        ${A.codeBlock(code, lang)}
      </div>`;
  }

  /* ─── Sub-block Renderer (for split) ─── */
  function subBlock(b, id) {
    if (!b) return '';
    const type = b.type;
    const d = b.data || {};
    switch (type) {
      case 'text':
        return `<div class="sub-block sub-text"><p>${A.esc(d.content)}</p></div>`;
      case 'bullets':
        return `<div class="sub-block sub-bullets"><ul class="stagger-spring" style="list-style-type: disc; padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">${d.items.map((it, i) => `<li${A.flowId('sub-bullet', i)}>${A.esc(it)}</li>`).join('')}</ul></div>`;
      case 'code':
        return `<div class="sub-block sub-code">${A.codeBlock(d.code, d.language || 'javascript')}</div>`;
      case 'image':
        return `<div class="sub-block sub-image" style="border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);"><img src="${d.url}" alt="${A.esc(d.alt || '')}" style="width: 100%; display: block; object-fit: cover;"></div>`;
      case 'math':
        return `<div class="sub-block sub-math"><div class="math-block-container"><div class="math-display-equation" data-latex="${A.esc(d.latex)}">\\\\[ ${A.esc(d.latex)} \\\\]</div>${d.explanation ? `<p class="math-explanation">${A.esc(d.explanation)}</p>` : ''}</div></div>`;
      case 'mermaid':
        const escapedCode = (d.code || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        return `<div class="sub-block sub-mermaid"><div class="mermaid-block-container"><div class="mermaid-diagram-wrapper"><div class="mermaid" id="mermaid-${id}" data-mermaid-code="${escapedCode}">${(d.code || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div></div></div></div>`;
      default:
        return `<div class="sub-block sub-unknown"><p>${A.esc(JSON.stringify(b))}</p></div>`;
    }
  }

  // Export
  exports.quizQuestionCard = quizQuestionCard;
  exports.timelineItem = timelineItem;
  exports.timelineHItem = timelineHItem;
  exports.statCard = statCard;
  exports.bentoCard = bentoCard;
  exports.bulletItem = bulletItem;
  exports.accordionItem = accordionItem;
  exports.tabButton = tabButton;
  exports.tabPanel = tabPanel;
  exports.stepDot = stepDot;
  exports.stepContent = stepContent;
  exports.flipCard = flipCard;
  exports.checklistItem = checklistItem;
  exports.compareSide = compareSide;
  exports.codeDiffPane = codeDiffPane;
  exports.subBlock = subBlock;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.LectaComposites = {}));
