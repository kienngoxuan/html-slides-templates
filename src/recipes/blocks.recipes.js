/**
 * LECTA AI — Composition Recipes
 * High-level block templates that compose atomic primitives and composite blocks
 * into standard layouts. Reusable in both Node.js (build) and browser (CSR).
 */

(function (exports) {

  // Load dependency modules (Node vs Browser fallback)
  const A = (typeof require !== 'undefined')
    ? require('../primitives/atoms')
    : (window.LectaAtoms || {});

  const C = (typeof require !== 'undefined')
    ? require('../primitives/composites')
    : (window.LectaComposites || {});

  /* ─── Recipe: Title Slide ─── */
  function titleRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.badge(d.badge)}
    ${A.sectionTitle(d.heading)}
    ${A.subtitle(d.subtitle)}`;
  }

  /* ─── Recipe: Splash Slide ─── */
  function splashRecipe(slide) {
    const d = slide.data || {};
    const socialHTML = d.social
      ? `<div class="splash-social-grid">${Object.entries(d.social).map(([p, h]) => A.socialChip(p, h)).join('')}</div>`
      : '';

    return `    <div class="splash-container">
      <div class="splash-avatar-area">
        ${A.avatar(d.avatarUrl, d.author, 'splash-avatar', 'splash-avatar-placeholder')}
        ${d.duration ? `<span class="splash-duration-badge">⏱️ ${A.esc(d.duration)}</span>` : ''}
      </div>
      <div class="splash-content-area">
        ${A.badge(d.badge)}
        ${A.sectionTitle(d.title, 'h1')}
        ${d.subtitle ? `<p class="splash-subtitle">${A.esc(d.subtitle)}</p>` : ''}
        ${d.author ? `<div class="splash-author">${A.esc(d.author)}</div>` : ''}
        ${d.role ? `<div class="splash-role">${A.esc(d.role)}</div>` : ''}
        ${socialHTML}
      </div>
    </div>`;
  }

  /* ─── Recipe: Bullet List ─── */
  function bulletsRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <ul class="bullet-list stagger-spring">
      ${d.items.map((item, i) => C.bulletItem(item, i)).join('\n      ')}
    </ul>`;
  }

  /* ─── Recipe: Collapsible Accordions ─── */
  function accordionRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="accordion stagger">
      ${d.items.map((item, i) => C.accordionItem(item, i, slide.id)).join('\n      ')}
    </div>`;
  }

  /* ─── Recipe: Tabs ─── */
  function tabsRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="tabs-container">
      <div class="tabs-header" role="tablist">
        ${d.tabs.map((t, i) => C.tabButton(t.label, i, slide.id, i === 0)).join('\n        ')}
      </div>
      ${d.tabs.map((t, i) => C.tabPanel(t, i, slide.id, i === 0)).join('\n      ')}
    </div>`;
  }

  /* ─── Recipe: Stepper ─── */
  function stepperRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="stepper">
      <div class="stepper-progress">
        ${d.steps.map((s, i) => C.stepDot(i, d.steps.length, i === 0)).join('')}
      </div>
      ${d.steps.map((s, i) => C.stepContent(s, i)).join('\n      ')}
      <div class="stepper-nav">
        <button class="nav-btn step-prev" disabled>← Previous</button>
        <button class="nav-btn step-next">Next →</button>
      </div>
    </div>`;
  }

  /* ─── Recipe: Flip Cards ─── */
  function cardsRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="cards-grid stagger">
      ${d.cards.map((c, i) => C.flipCard(c, i)).join('\n      ')}
    </div>
    <p class="flip-hint">Click any card to flip it</p>`;
  }

  /* ─── Recipe: Standard Quiz ─── */
  function quizRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="quiz-container stagger">
      ${d.questions.map((q, qi) => C.quizQuestionCard(q, qi, { variant: 'standard' })).join('\n      ')}
    </div>`;
  }

  /* ─── Recipe: Advanced Assessment Quiz ─── */
  function advancedQuizRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon || '🏆', d.heading)}
    <div class="advanced-quiz-container stagger" data-total-questions="${d.questions.length}">
      ${d.questions.map((q, qi) => C.quizQuestionCard(q, qi, { variant: 'advanced' })).join('\n      ')}
      
      <div class="adv-quiz-action-row">
        <button class="btn btn-primary adv-submit-btn">📥 Submit Assessment</button>
      </div>
      
      <!-- Modal Overlay Popup -->
      <div class="adv-quiz-modal-backdrop" style="display: none;">
        <div class="adv-quiz-modal glassmorphic-panel stagger-item">
          <button class="adv-quiz-modal-close" aria-label="Close modal">&times;</button>
          <div class="adv-result-score">Score: <span class="score-fraction">0/0</span></div>
          <div class="adv-result-feedback"></div>
          <button class="adv-retry-btn" style="margin-top: 1.5rem;">🔄 Try Again</button>
        </div>
      </div>
    </div>`;
  }

  /* ─── Recipe: Side-by-Side Compare Columns ─── */
  function compareRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="compare-grid stagger">
      ${C.compareSide(d.left, d.left.color, 'left')}
      ${C.compareSide(d.right, d.right.color, 'right')}
    </div>
    ${d.verdict ? `<div class="compare-verdict flow-controlled flow-preset-card-pop" data-flow-id="compare-verdict">${A.esc(d.verdict)}</div>` : ''}`;
  }

  /* ─── Recipe: Timelines (Vertical) ─── */
  function timelineRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="timeline-container stagger">
      <div class="timeline-line"></div>
      ${d.events.map((event, idx) => C.timelineItem(event, idx)).join('\n      ')}
    </div>`;
  }

  /* ─── Recipe: Timeline Horizontal ─── */
  function timelineHorizontalRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="timeline-h-container stagger">
      <div class="timeline-h-track">
        <div class="timeline-h-line"></div>
        ${d.events.map((event, idx) => C.timelineHItem(event, idx)).join('\n        ')}
      </div>
    </div>`;
  }

  /* ─── Recipe: Summary & Resource Links ─── */
  function summaryRecipe(slide) {
    const d = slide.data || {};
    const linksHTML = Array.isArray(d.resources)
      ? `<div class="summary-resources stagger-item">
          <h4>🔗 Resources & Further Reading</h4>
          <div class="resources-grid">${d.resources.map(res => A.resourceLink(res.label, res.url)).join('')}</div>
        </div>`
      : '';

    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="summary-container stagger">
      <ul class="summary-points">
        ${d.items.map((pt, i) => {
          const text = pt && typeof pt === 'object' ? (pt.text || pt.title || '') : pt;
          return `<li data-flow-id="summary-point-${i + 1}">${A.esc(text)}</li>`;
        }).join('\n        ')}
      </ul>
      ${d.callToAction ? `<div class="summary-cta stagger-item">${A.esc(d.callToAction)}</div>` : ''}
      ${linksHTML}
    </div>`;
  }

  /* ─── Recipe: Interactive Image Editor ─── */
  function imageRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="image-block-container">
      <div class="interactive-image-wrapper">
        <img class="interactive-image" src="${d.url}" alt="${A.esc(d.caption || '')}" />
        <div class="image-edit-overlay">
          <button class="edit-image-overlay-btn">✏️ Edit Image URL</button>
        </div>
      </div>
      ${A.caption(d.caption)}
    </div>`;
  }

  /* ─── Recipe: SVG Chart ─── */
  function chartRecipe(slide) {
    const d = slide.data || {};
    const labelsJSON = A.esc(JSON.stringify(d.labels || []));
    const datasetsJSON = A.esc(JSON.stringify(d.datasets || []));

    const chartW = d.width || 600;
    const chartH = d.height || 320;

    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="chart-block-container" data-chart-type="${d.chartType}" data-labels="${labelsJSON}" data-datasets="${datasetsJSON}" data-chart-w="${chartW}" data-chart-h="${chartH}">
      <div class="chart-canvas-wrapper">
        <svg class="svg-chart" viewBox="0 0 ${chartW} ${chartH}"></svg>
      </div>
      <div class="chart-legend"></div>
    </div>`;
  }

  /* ─── Recipe: Sortable/Filterable Table ─── */
  function tableRecipe(slide) {
    const d = slide.data || {};
    const colsJSON = A.esc(JSON.stringify(d.columns));
    const rowsJSON = A.esc(JSON.stringify(d.rows));

    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="table-block-container" data-columns="${colsJSON}" data-rows="${rowsJSON}">
      <div class="table-actions">
        <input type="text" class="table-search-input" placeholder="🔍 Search table..." />
        <span class="table-row-count">0 rows</span>
      </div>
      <div class="table-responsive-wrapper">
        <table class="glass-table">
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>
    </div>`;
  }

  /* ─── Recipe: Bento Box Grid ─── */
  function bentoRecipe(slide) {
    const d = slide.data || {};
    const templateStyle = d.gridTemplate ? `style="grid-template-areas: ${d.gridTemplate}"` : '';

    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="bento-grid stagger" ${templateStyle}>
      ${d.items.map((item, idx) => C.bentoCard(item, idx)).join('\n      ')}
    </div>`;
  }

  /* ─── Recipe: Interactive Flowchart / Mindmap ─── */
  function flowRecipe(slide) {
    const d = slide.data || {};
    const nodesJSON = A.esc(JSON.stringify(d.nodes));
    const connsJSON = A.esc(JSON.stringify(d.connections));

    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="flow-block-container" data-nodes="${nodesJSON}" data-connections="${connsJSON}">
      <div class="flow-layout-wrapper">
        <svg class="flow-svg-canvas" viewBox="0 0 900 600"></svg>
      </div>
      <div class="flow-detail-panel">
        <div class="flow-detail-default-msg">
          Click any element in the diagram to inspect its detailed specification.
        </div>
        <div class="flow-detail-content" style="display: none; position: relative;">
          <button class="flow-side-panel-close" style="position: absolute; right: 0; top: 0; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--color-text-muted);">&times;</button>
          <div class="flow-detail-title">Inspect Element</div>
          <div class="flow-detail-desc">Click any element in the diagram to inspect its detailed specification.</div>
        </div>
      </div>
    </div>`;
  }

  /* ─── Recipe: Split Layout ─── */
  function splitRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="split-grid-50-50">
      ${C.subBlock(d.left, `${slide.id}-left`)}
      ${C.subBlock(d.right, `${slide.id}-right`)}
    </div>`;
  }

  /* ─── Recipe: Math LaTeX ─── */
  function mathRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="math-block-container">
      <div class="math-display-equation" data-latex="${A.esc(d.latex)}">
        \\[ ${A.esc(d.latex)} \\]
      </div>
      ${A.caption(d.explanation, 'math-explanation')}
    </div>`;
  }

  /* ─── Recipe: Mermaid Diagram ─── */
  function mermaidRecipe(slide) {
    const d = slide.data || {};
    const escapedCode = (d.code || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="mermaid-block-container">
      <div class="mermaid-diagram-wrapper">
        <div class="mermaid" id="mermaid-${slide.id}" data-mermaid-code="${escapedCode}">${(d.code || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div>
      </div>
    </div>`;
  }

  /* ─── Recipe: Video Block ─── */
  function videoRecipe(slide) {
    const d = slide.data || {};
    const type = d.videoType || 'native';
    let embedHTML = '';

    if (type === 'youtube' && d.videoId) {
      embedHTML = `<iframe class="video-iframe" src="https://www.youtube.com/embed/${A.esc(d.videoId)}" allowfullscreen></iframe>`;
    } else if (type === 'vimeo' && d.videoId) {
      embedHTML = `<iframe class="video-iframe" src="https://player.vimeo.com/video/${A.esc(d.videoId)}" allowfullscreen></iframe>`;
    } else if (d.videoUrl) {
      const posterAttr = d.poster ? ` poster="${A.esc(d.poster)}"` : '';
      embedHTML = `<video class="native-video-player" controls${posterAttr} src="${A.esc(d.videoUrl)}"></video>`;
    } else {
      embedHTML = `<div class="video-placeholder-error">Missing video configuration</div>`;
    }

    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="video-block-container">
      <div class="video-wrapper">
        ${embedHTML}
      </div>
      ${A.caption(d.caption)}
    </div>`;
  }

  /* ─── Recipe: Quote Card ─── */
  function quoteCardRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon || '💬', d.heading)}
    <div class="quote-card-container stagger">
      <blockquote class="quote-text stagger-item">"${A.esc(d.quote)}"</blockquote>
      <div class="quote-author-row stagger-item">
        ${A.avatar(d.avatarUrl, d.author, 'quote-avatar', 'quote-avatar-placeholder')}
        <div class="quote-author-meta">
          <div class="quote-author-name">${A.esc(d.author || 'Anonymous')}</div>
          ${d.role ? `<div class="quote-author-role">${A.esc(d.role)}</div>` : ''}
        </div>
      </div>
    </div>`;
  }

  /* ─── Recipe: Definition Card ─── */
  function definitionCardRecipe(slide) {
    const d = slide.data || {};
    const pronHTML = d.pronunciation ? `<span class="definition-pronunciation">${A.esc(d.pronunciation)}</span>` : '';
    const typeHTML = d.type ? A.badgePill(d.type, 'accent') : '';

    return `    ${A.blockHeading(d.icon || '📖', d.heading)}
    <div class="definition-card-container stagger">
      <div class="definition-header stagger-item">
        <h3 class="definition-term">${A.esc(d.term)}</h3>
        ${typeHTML}
        ${pronHTML}
      </div>
      <div class="definition-body stagger-item">
        <p class="definition-desc">${A.esc(d.definition)}</p>
        ${d.example ? `<blockquote class="definition-example">${A.esc(d.example)}</blockquote>` : ''}
      </div>
    </div>`;
  }

  /* ─── Recipe: Technical Analogy ─── */
  function analogyRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon || '💡', d.heading)}
    <div class="analogy-container stagger">
      <div class="analogy-card analogy-technical stagger-item">
        <div class="analogy-card-label">⚙️ Technical Concept</div>
        <p>${A.esc(d.technicalConcept)}</p>
      </div>
      <div class="analogy-bridge stagger-item">
        <div class="analogy-bridge-text">${A.esc(d.bridgeText || 'Is Like...')}</div>
        <div class="analogy-bridge-arrow">↔</div>
      </div>
      <div class="analogy-card analogy-realworld stagger-item">
        <div class="analogy-card-label">🌾 Real-world Analogy</div>
        <p>${A.esc(d.analogy)}</p>
      </div>
    </div>`;
  }

  /* ─── Recipe: Animated Stats ─── */
  function statsRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="stats-grid stagger">
      ${d.stats.map((stat, idx) => C.statCard(stat, idx)).join('\n      ')}
    </div>`;
  }

  /* ─── Recipe: Interactive Checklist ─── */
  function checklistRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="checklist-container stagger">
      <ul class="checklist-list" role="list">
        ${d.items.map((item, idx) => C.checklistItem(item, idx)).join('\n        ')}
      </ul>
    </div>`;
  }

  /* ─── Recipe: Code Diff Side-by-Side ─── */
  function codeDiffRecipe(slide) {
    const d = slide.data || {};
    return `    ${A.blockHeading(d.icon, d.heading)}
    <div class="code-diff-container stagger">
      ${C.codeDiffPane(d.leftTitle || 'Before', d.leftLang || 'javascript', d.leftCode, 'left', 'diff-pane-left')}
      ${C.codeDiffPane(d.rightTitle || 'After', d.rightLang || 'javascript', d.rightCode, 'right', 'diff-pane-right')}
    </div>`;
  }

  // Export
  exports.titleRecipe = titleRecipe;
  exports.splashRecipe = splashRecipe;
  exports.bulletsRecipe = bulletsRecipe;
  exports.accordionRecipe = accordionRecipe;
  exports.tabsRecipe = tabsRecipe;
  exports.stepperRecipe = stepperRecipe;
  exports.cardsRecipe = cardsRecipe;
  exports.quizRecipe = quizRecipe;
  exports.advancedQuizRecipe = advancedQuizRecipe;
  exports.compareRecipe = compareRecipe;
  exports.timelineRecipe = timelineRecipe;
  exports.timelineHorizontalRecipe = timelineHorizontalRecipe;
  exports.summaryRecipe = summaryRecipe;
  exports.imageRecipe = imageRecipe;
  exports.chartRecipe = chartRecipe;
  exports.tableRecipe = tableRecipe;
  exports.bentoRecipe = bentoRecipe;
  exports.flowRecipe = flowRecipe;
  exports.splitRecipe = splitRecipe;
  exports.mathRecipe = mathRecipe;
  exports.mermaidRecipe = mermaidRecipe;
  exports.videoRecipe = videoRecipe;
  exports.quoteCardRecipe = quoteCardRecipe;
  exports.definitionCardRecipe = definitionCardRecipe;
  exports.analogyRecipe = analogyRecipe;
  exports.statsRecipe = statsRecipe;
  exports.checklistRecipe = checklistRecipe;
  exports.codeDiffRecipe = codeDiffRecipe;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.LectaRecipes = {}));
