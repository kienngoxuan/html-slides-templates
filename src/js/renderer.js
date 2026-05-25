/**
 * LECTA AI — HTML Renderer
 * Converts slide JSON data into semantic HTML blocks
 */

function renderSlideHTML(slide) {
  const d = slide.data;
  const notes = (d.speakerNotes || '').replace(/"/g, '&quot;');

  switch (slide.type) {
    case 'title':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner slide-title">
    <span class="badge">${esc(d.badge || '')}</span>
    <h1>${esc(d.heading)}</h1>
    <p class="subtitle">${esc(d.subtitle)}</p>
  </div>
</section>`;

    case 'bullets':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || ''}</span><h2>${esc(d.heading)}</h2></div>
    <ul class="bullet-list stagger">
      ${d.items.map(item => `<li class="bullet-item">
        <div class="bullet-text">${esc(item.text)}</div>
        <div class="bullet-detail"><p>${esc(item.detail || '')}</p></div>
      </li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

    case 'accordion':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || ''}</span><h2>${esc(d.heading)}</h2></div>
    <div class="accordion stagger">
      ${d.items.map((item, i) => `<div class="accordion-item">
        <button class="accordion-header" role="button" aria-expanded="false" aria-controls="accordion-content-${slide.id}-${i}" id="accordion-header-${slide.id}-${i}">
          ${esc(item.title)}
          <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="accordion-body" role="region" aria-labelledby="accordion-header-${slide.id}-${i}" id="accordion-content-${slide.id}-${i}">
          <div class="accordion-content">
            <p>${esc(item.content)}</p>
            ${item.example ? `<pre><code>${esc(item.example)}</code></pre>` : ''}
          </div>
        </div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'tabs':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || ''}</span><h2>${esc(d.heading)}</h2></div>
    <div class="tabs-container">
      <div class="tabs-header" role="tablist">
        ${d.tabs.map((t, i) => `<button class="tab-btn${i === 0 ? ' active' : ''}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" aria-controls="panel-${slide.id}-${i}" id="tab-${slide.id}-${i}">${esc(t.label)}</button>`).join('')}
      </div>
      ${d.tabs.map((t, i) => `<div class="tab-panel${i === 0 ? ' active' : ''}" role="tabpanel" aria-labelledby="tab-${slide.id}-${i}" id="panel-${slide.id}-${i}">
        <p>${esc(t.content)}</p>
        ${t.features ? `<div class="tab-features">${t.features.map(f => `<span class="tab-feature-tag">${esc(f)}</span>`).join('')}</div>` : ''}
        ${t.code ? `<pre><code>${esc(t.code)}</code></pre>` : ''}
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'stepper':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || ''}</span><h2>${esc(d.heading)}</h2></div>
    <div class="stepper">
      <div class="stepper-progress">
        ${d.steps.map((s, i) => {
          let html = `<div class="step-dot${i === 0 ? ' active' : ''}">${i + 1}</div>`;
          if (i < d.steps.length - 1) html += `<div class="step-line"></div>`;
          return html;
        }).join('')}
      </div>
      ${d.steps.map((s, i) => `<div class="step-content${i === 0 ? ' active' : ''}">
        <h4>${esc(s.title)}</h4>
        <p>${esc(s.content)}</p>
        ${s.tip ? `<div class="step-tip">${esc(s.tip)}</div>` : ''}
      </div>`).join('\n      ')}
      <div class="stepper-nav">
        <button class="nav-btn step-prev" disabled>← Previous</button>
        <button class="nav-btn step-next">Next →</button>
      </div>
    </div>
  </div>
</section>`;

    case 'cards':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || ''}</span><h2>${esc(d.heading)}</h2></div>
    <div class="cards-grid stagger">
      ${d.cards.map(c => `<div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">${esc(c.front)}</div>
          <div class="flip-card-back">${esc(c.back)}</div>
        </div>
      </div>`).join('\n      ')}
    </div>
    <p class="flip-hint">Click any card to flip it</p>
  </div>
</section>`;

    case 'advanced-quiz':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '🏆'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="advanced-quiz-container stagger" data-total-questions="${d.questions.length}">
      ${d.questions.map((q, qi) => `<div class="adv-question" data-question-index="${qi}" data-correct="${q.correct}">
        <h4>${qi + 1}. ${esc(q.question)}</h4>
        <div class="adv-options">
          ${q.options.map((o, oi) => `<button class="adv-option" data-option-index="${oi}">
            <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
            ${esc(o)}
          </button>`).join('\n          ')}
        </div>
      </div>`).join('\n      ')}
      
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
    </div>
  </div>
</section>`;

    case 'quiz':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || ''}</span><h2>${esc(d.heading)}</h2></div>
    <div class="quiz-container stagger">
      ${d.questions.map((q, qi) => `<div class="quiz-question" data-correct="${q.correct}">
        <h4>${qi + 1}. ${esc(q.question)}</h4>
        <div class="quiz-options">
          ${q.options.map((o, oi) => `<button class="quiz-option">
            <span class="option-letter">${String.fromCharCode(65 + oi)}</span>
            ${esc(o)}
          </button>`).join('\n          ')}
        </div>
        <div class="quiz-explanation">${esc(q.explanation)}</div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'compare':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || ''}</span><h2>${esc(d.heading)}</h2></div>
    <div class="compare-container">
      <div class="compare-side side-${d.left.color || 'blue'}">
        <h3>${esc(d.left.title)}</h3>
        <ul class="compare-list">
          ${d.left.items.map(i => `<li>${esc(i)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="compare-side side-${d.right.color || 'green'}">
        <h3>${esc(d.right.title)}</h3>
        <ul class="compare-list">
          ${d.right.items.map(i => `<li>${esc(i)}</li>`).join('\n          ')}
        </ul>
      </div>
      ${d.verdict ? `<div class="compare-verdict">${esc(d.verdict)}</div>` : ''}
    </div>
  </div>
</section>`;

    case 'timeline':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || ''}</span><h2>${esc(d.heading)}</h2></div>
    <div class="timeline stagger">
      ${d.events.map(e => `<div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-year">${esc(e.year)}</div>
        <div class="timeline-title">${esc(e.title)}</div>
        <div class="timeline-desc">${esc(e.description)}</div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'summary':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || ''}</span><h2>${esc(d.heading)}</h2></div>
    <ul class="summary-items stagger">
      ${d.items.map(i => `<li>${esc(i)}</li>`).join('\n      ')}
    </ul>
    ${d.callToAction ? `<div class="summary-cta"><p>${esc(d.callToAction)}</p></div>` : ''}
    ${d.resources ? `<div class="summary-resources">
      ${d.resources.map(r => `<a href="${esc(r.url)}" class="resource-link" target="_blank">🔗 ${esc(r.label)}</a>`).join('')}
    </div>` : ''}
  </div>
</section>`;

    case 'image':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '🖼️'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="image-block-container stagger">
      <div class="image-box-wrapper">
        <img class="interactive-image" src="${esc(d.url || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80')}" alt="${esc(d.caption || 'Slide Image')}" />
        <button class="edit-image-overlay-btn">✏️ Change Image URL</button>
      </div>
      ${d.caption ? `<p class="image-caption">${esc(d.caption)}</p>` : ''}
    </div>
  </div>
</section>`;

    case 'chart':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '📊'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="chart-block-container stagger" data-chart-type="${esc(d.chartType || 'bar')}" data-labels="${esc(JSON.stringify(d.labels || [])).replace(/"/g, '&quot;')}" data-datasets="${esc(JSON.stringify(d.datasets || [])).replace(/"/g, '&quot;')}">
      <div class="chart-canvas-wrapper">
        <svg class="svg-chart" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet"></svg>
      </div>
      <div class="chart-legend"></div>
    </div>
  </div>
</section>`;

    case 'table':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '🧮'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="table-block-container stagger">
      <div class="table-actions">
        <input type="text" class="table-search-input" placeholder="Search rows..." />
      </div>
      <div class="table-responsive-wrapper">
        <table class="glass-table">
          <thead>
            <tr>
              ${(d.columns || []).map(col => `<th data-col-key="${esc(col.key)}" class="sortable-th">
                ${esc(col.label)}
                <span class="sort-indicator">↕</span>
              </th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${(d.rows || []).map(row => `<tr>
              ${(d.columns || []).map(col => {
                const val = row[col.key];
                if (col.type === 'progress') {
                  const percent = Math.min(100, Math.max(0, parseInt(val, 10) || 0));
                  return `<td data-label="${esc(col.label)}">
                    <div class="progress-cell-wrapper">
                      <div class="progress-cell-bar"><div class="progress-cell-fill" style="width: ${percent}%"></div></div>
                      <span class="progress-cell-text">${percent}%</span>
                    </div>
                  </td>`;
                } else if (col.type === 'badge') {
                  const parts = String(val || '').split('·');
                  const text = (parts[0] || '').trim();
                  const type = (parts[1] || 'primary').trim();
                  return `<td data-label="${esc(col.label)}"><span class="badge-pill pill-${type}">${esc(text)}</span></td>`;
                } else if (col.type === 'code') {
                  return `<td data-label="${esc(col.label)}"><code class="code-cell">${esc(val)}</code></td>`;
                }
                return `<td data-label="${esc(col.label)}">${esc(val)}</td>`;
              }).join('')}
            </tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>`;

    case 'bento':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '🍱'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="bento-grid stagger" style="--grid-template: ${esc(d.gridTemplate || 'auto')}">
      ${(d.items || []).map(item => {
        const bgStyle = item.bgGradient ? `background: linear-gradient(135deg, ${item.bgGradient.split(' to ')[0]}, ${item.bgGradient.split(' to ')[1] || 'transparent'}); border: none;` : '';
        const hasBg = item.bgGradient ? ' bento-card-gradient' : '';
        const sizeClass = `bento-size-${item.size || 'small'}`;
        return `<div class="bento-card ${sizeClass}${hasBg}" style="${bgStyle}">
          ${item.badge ? `<span class="bento-badge">${esc(item.badge)}</span>` : ''}
          ${item.icon ? `<div class="bento-icon">${esc(item.icon)}</div>` : ''}
          <div class="bento-card-content">
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.content)}</p>
          </div>
        </div>`;
      }).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'flow':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '🌿'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="flow-block-container stagger" data-nodes="${esc(JSON.stringify(d.nodes || [])).replace(/"/g, '&quot;')}" data-connections="${esc(JSON.stringify(d.connections || [])).replace(/"/g, '&quot;')}">
      <div class="flow-layout-wrapper">
        <svg class="flow-svg-canvas" viewBox="0 0 800 350">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-primary)" />
            </marker>
          </defs>
        </svg>
      </div>
      <div class="flow-detail-panel glassmorphic-panel">
        <div class="flow-detail-default-msg">💡 Click on any step in the flowchart to view deep insights.</div>
        <div class="flow-detail-content" style="display: none;">
          <h4 class="flow-detail-title"></h4>
          <p class="flow-detail-desc"></p>
        </div>
      </div>
    </div>
  </div>
</section>`;

    case 'math':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '🧮'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="math-block-container">
      <div class="math-display-equation" data-latex="${esc(d.latex)}">
        \\[ ${d.latex} \\]
      </div>
      ${d.explanation ? `<p class="math-explanation">${esc(d.explanation)}</p>` : ''}
    </div>
  </div>
</section>`;

    case 'mermaid':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '🌿'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="mermaid-block-container">
      <div class="mermaid-diagram-wrapper">
        <div class="mermaid" id="mermaid-${slide.id}">${d.code}</div>
      </div>
    </div>
  </div>
</section>`;

    case 'video': {
      let videoHTML = '';
      if (d.videoType === 'youtube') {
        videoHTML = `<a href="https://www.youtube.com/watch?v=${d.videoId}" target="_blank" class="video-link-card" aria-label="Watch video on YouTube">
        <div class="video-preview-thumbnail" style="background-image: url('https://img.youtube.com/vi/${d.videoId}/hqdefault.jpg')">
          <div class="video-play-overlay">
            <div class="video-play-btn">▶</div>
            <span class="video-play-text">Watch on YouTube</span>
          </div>
        </div>
      </a>`;
      } else if (d.videoType === 'vimeo') {
        videoHTML = `<a href="https://vimeo.com/${d.videoId}" target="_blank" class="video-link-card" aria-label="Watch video on Vimeo">
        <div class="video-preview-thumbnail" style="background: #111;">
          <div class="video-play-overlay">
            <div class="video-play-btn" style="background: #00adef; box-shadow: 0 4px 20px rgba(0, 173, 239, 0.5);">▶</div>
            <span class="video-play-text">Watch on Vimeo</span>
          </div>
        </div>
      </a>`;
      } else {
        videoHTML = `<video class="video-player-frame" controls poster="${d.poster || ''}"><source src="${d.videoUrl}" type="video/mp4"></video>`;
      }
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '🎬'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="video-block-container">
      ${videoHTML}
    </div>
  </div>
</section>`;
    }

    case 'split':
      return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}">
  <div class="slide-inner">
    <div class="block-heading"><span class="icon">${d.icon || '⚔️'}</span><h2>${esc(d.heading)}</h2></div>
    <div class="split-layout-container ${d.layout || 'split-50-50'}">
      <div class="split-column left-column">
        ${renderSubBlock(d.left, slide.id + '-left')}
      </div>
      <div class="split-column right-column">
        ${renderSubBlock(d.right, slide.id + '-right')}
      </div>
    </div>
  </div>
</section>`;

    default:
      return `<section class="slide" id="${slide.id}"><div class="slide-inner"><p>Unknown block type: ${slide.type}</p></div></section>`;
  }
}

function renderSubBlock(b, id) {
  if (!b) return '';
  const type = b.type;
  const d = b.data || {};
  switch (type) {
    case 'text':
      return `<div class="sub-block sub-text"><p>${esc(d.content)}</p></div>`;
    case 'bullets':
      return `<div class="sub-block sub-bullets"><ul style="list-style-type: disc; padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">${d.items.map(it => `<li>${esc(it)}</li>`).join('')}</ul></div>`;
    case 'code':
      return `<div class="sub-block sub-code"><pre><code class="language-${d.language || 'javascript'}">${esc(d.code)}</code></pre></div>`;
    case 'image':
      return `<div class="sub-block sub-image" style="border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);"><img src="${d.url}" alt="${esc(d.alt || '')}" style="width: 100%; display: block; object-fit: cover;"></div>`;
    default:
      return `<div class="sub-block sub-unknown"><p>${esc(JSON.stringify(b))}</p></div>`;
  }
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { renderSlideHTML };
