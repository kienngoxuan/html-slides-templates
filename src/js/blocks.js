/**
 * LECTA AI — Interactive Block Logic
 * Accordion, Tabs, Stepper, Flip Cards, Quiz, Timeline, Bullets
 */

const InteractiveBlocks = (function () {

  function init() {
    initAccordions();
    initTabs();
    initSteppers();
    initFlipCards();
    initQuiz();
    initAdvancedQuiz();
    initTimeline();
    initBullets();
    initInteractiveImages();
    initCharts();
    initTables();
    initBento();
    initFlows();
  }

  /* === Interactive Image URL Customizer === */
  function initInteractiveImages() {
    // Load persisted images
    document.querySelectorAll('.interactive-image').forEach((img, index) => {
      const slide = img.closest('.slide');
      const key = 'lecta-img-' + (slide ? slide.id : ('index-' + index));
      let savedUrl = null;
      try {
        savedUrl = localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage is blocked or full:', e);
      }
      if (savedUrl) {
        img.src = savedUrl;
      }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.edit-image-overlay-btn');
      if (!btn) return;
      const img = btn.parentNode.querySelector('.interactive-image');
      if (!img) return;

      const slide = btn.closest('.slide');
      const key = 'lecta-img-' + (slide ? slide.id : 'index-0');

      const newUrl = prompt('Enter a new Image URL (Unsplash or any web link):', img.src);
      if (newUrl !== null && newUrl.trim() !== '') {
        img.src = newUrl.trim();
        try {
          localStorage.setItem(key, newUrl.trim());
        } catch (err) {
          console.warn('localStorage is blocked or full:', err);
        }
      }
    });
  }

  /* === Accordion (Event Delegation & ARIA Compliant) === */
  function initAccordions() {
    document.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      if (!header) return;

      const item = header.closest('.accordion-item');
      const accordion = item.closest('.accordion');
      if (!accordion) return;

      // Close others in same accordion
      accordion.querySelectorAll('.accordion-item.open').forEach(open => {
        if (open !== item) {
          open.classList.remove('open');
          const openHeader = open.querySelector('.accordion-header');
          if (openHeader) openHeader.setAttribute('aria-expanded', 'false');
        }
      });

      const isOpen = item.classList.toggle('open');
      header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* === Tabs (Event Delegation & ARIA Compliant) === */
  function initTabs() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;

      const container = btn.closest('.tabs-container');
      if (!container) return;

      const buttons = Array.from(container.querySelectorAll('.tab-btn'));
      const panels = container.querySelectorAll('.tab-panel');
      const idx = buttons.indexOf(btn);
      if (idx === -1) return;

      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      if (panels[idx]) panels[idx].classList.add('active');
    });
  }

  /* === Stepper (Event Delegation) === */
  function initSteppers() {
    // Click navigation controls
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.stepper .nav-btn');
      if (!btn) return;

      const stepper = btn.closest('.stepper');
      if (!stepper) return;

      const dots = stepper.querySelectorAll('.step-dot');
      const contents = stepper.querySelectorAll('.step-content');
      const lines = stepper.querySelectorAll('.step-line');
      const prevBtn = stepper.querySelector('.step-prev');
      const nextBtn = stepper.querySelector('.step-next');

      let currentStep = 0;
      dots.forEach((d, i) => {
        if (d.classList.contains('active')) currentStep = i;
      });

      let nextStep = currentStep;
      if (btn.classList.contains('step-prev')) nextStep = currentStep - 1;
      if (btn.classList.contains('step-next')) nextStep = currentStep + 1;

      if (nextStep < 0 || nextStep >= contents.length) return;
      goToStep(stepper, dots, contents, lines, prevBtn, nextBtn, nextStep);
    });

    // Direct dot navigation click delegation
    document.addEventListener('click', (e) => {
      const dot = e.target.closest('.stepper .step-dot');
      if (!dot) return;

      const stepper = dot.closest('.stepper');
      if (!stepper) return;

      const dots = Array.from(stepper.querySelectorAll('.step-dot'));
      const contents = stepper.querySelectorAll('.step-content');
      const lines = stepper.querySelectorAll('.step-line');
      const prevBtn = stepper.querySelector('.step-prev');
      const nextBtn = stepper.querySelector('.step-next');

      const nextStep = dots.indexOf(dot);
      goToStep(stepper, dots, contents, lines, prevBtn, nextBtn, nextStep);
    });

    // Initial default layout for all steppers
    document.querySelectorAll('.stepper').forEach(stepper => {
      const dots = stepper.querySelectorAll('.step-dot');
      const contents = stepper.querySelectorAll('.step-content');
      const lines = stepper.querySelectorAll('.step-line');
      const prevBtn = stepper.querySelector('.step-prev');
      const nextBtn = stepper.querySelector('.step-next');
      goToStep(stepper, dots, contents, lines, prevBtn, nextBtn, 0);
    });
  }

  function goToStep(stepper, dots, contents, lines, prevBtn, nextBtn, idx) {
    dots.forEach((d, i) => {
      d.classList.remove('active', 'completed');
      if (i < idx) d.classList.add('completed');
      if (i === idx) d.classList.add('active');
    });

    lines.forEach((l, i) => {
      l.classList.toggle('active', i < idx);
    });

    contents.forEach((c, i) => {
      c.classList.toggle('active', i === idx);
    });

    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === contents.length - 1;
  }

  /* === Flip Cards === */
  function initFlipCards() {
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }

  /* === Quiz (With Dynamic State Resets) === */
  function initQuiz() {
    document.querySelectorAll('.quiz-question').forEach(question => {
      const correctIdx = parseInt(question.dataset.correct, 10);
      const options = question.querySelectorAll('.quiz-option');
      const explanation = question.querySelector('.quiz-explanation');
      question.dataset.answered = 'false';

      options.forEach((opt, i) => {
        opt.addEventListener('click', () => {
          if (question.dataset.answered === 'true') return;

          // Clear previous highlights to cleanly reset the retry state
          options.forEach(o => o.classList.remove('selected', 'correct', 'wrong'));

          opt.classList.add('selected');

          if (i === correctIdx) {
            question.dataset.answered = 'true'; // Lock the question only when correct
            opt.classList.add('correct');
            if (explanation) {
              explanation.classList.add('visible');
            }
          } else {
            opt.classList.add('wrong');
            if (options[correctIdx]) {
              options[correctIdx].classList.add('correct');
            }
            if (explanation) {
              explanation.classList.add('visible');
            }
          }
        });
      });
    });

    // Reset quiz states when a slide is changed so presenters can re-teach/re-run quizzes
    document.addEventListener('slideChanged', (e) => {
      const activeSlideIndex = e.detail.index;
      const slides = document.querySelectorAll('.slide');
      const activeSlide = slides[activeSlideIndex];
      if (!activeSlide) return;

      activeSlide.querySelectorAll('.quiz-question').forEach(question => {
        question.dataset.answered = 'false';
        question.querySelectorAll('.quiz-option').forEach(opt => {
          opt.classList.remove('selected', 'correct', 'wrong');
        });
        const explanation = question.querySelector('.quiz-explanation');
        if (explanation) {
          explanation.classList.remove('visible');
        }
      });
    });
  }

  /* === Advanced Quiz (Submit Assessment) === */
  function initAdvancedQuiz() {
    document.addEventListener('click', (e) => {
      // 1. Option selection
      const option = e.target.closest('.adv-option');
      if (option) {
        const question = option.closest('.adv-question');
        const container = option.closest('.advanced-quiz-container');
        if (!container || container.dataset.submitted === 'true') return;

        question.querySelectorAll('.adv-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        return;
      }

      // 2. Submit assessment
      const submitBtn = e.target.closest('.adv-submit-btn');
      if (submitBtn) {
        const container = submitBtn.closest('.advanced-quiz-container');
        if (!container || container.dataset.submitted === 'true') return;

        const questions = container.querySelectorAll('.adv-question');
        let unanswered = 0;
        questions.forEach(q => {
          if (!q.querySelector('.adv-option.selected')) {
            unanswered++;
          }
        });

        if (unanswered > 0) {
          alert(`Please answer all ${unanswered} remaining question(s) before submitting!`);
          return;
        }

        container.dataset.submitted = 'true';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';

        let score = 0;
        questions.forEach(q => {
          const correctIdx = parseInt(q.dataset.correct, 10);
          const options = q.querySelectorAll('.adv-option');
          let selectedIdx = -1;
          
          options.forEach((opt, idx) => {
            if (opt.classList.contains('selected')) {
              selectedIdx = idx;
            }
          });

          options.forEach((opt, idx) => {
            if (idx === correctIdx) {
              opt.classList.add('correct');
            } else if (idx === selectedIdx) {
              opt.classList.add('wrong');
            }
          });

          if (selectedIdx === correctIdx) {
            score++;
          }
        });
        const backdrop = container.querySelector('.adv-quiz-modal-backdrop');
        const scoreFraction = container.querySelector('.score-fraction');
        const feedback = container.querySelector('.adv-result-feedback');

        if (backdrop && scoreFraction && feedback) {
          const total = questions.length;
          scoreFraction.textContent = `${score}/${total}`;
          
          let msg = '';
          const ratio = score / total;
          if (ratio === 1) {
            msg = '🏆 Perfect Score! You master these concepts completely!';
          } else if (ratio >= 0.7) {
            msg = '✨ Great job! You passed the assessment with honors.';
          } else {
            msg = '📚 Good attempt. Review the slides and try again to improve your score!';
          }
          feedback.textContent = msg;

          // Teleport modal backdrop to body to avoid container transform/filter viewport clipping contexts!
          backdrop._originalParent = container;
          document.body.appendChild(backdrop);

          backdrop.style.display = 'flex';
          document.body.classList.add('adv-quiz-modal-open');
        }
        return;
      }

      // 3. Retry quiz
      const retryBtn = e.target.closest('.adv-retry-btn');
      if (retryBtn) {
        const modalBackdrop = e.target.closest('.adv-quiz-modal-backdrop');
        const container = retryBtn.closest('.advanced-quiz-container') || (modalBackdrop ? modalBackdrop._originalParent : null);
        if (!container) return;

        container.dataset.submitted = 'false';
        const submitBtn = container.querySelector('.adv-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }

        const backdrop = document.querySelector('body > .adv-quiz-modal-backdrop') || container.querySelector('.adv-quiz-modal-backdrop');
        if (backdrop) {
          backdrop.style.display = 'none';
          if (backdrop._originalParent) {
            backdrop._originalParent.appendChild(backdrop);
          }
        }
        document.body.classList.remove('adv-quiz-modal-open');

        container.querySelectorAll('.adv-option').forEach(opt => {
          opt.classList.remove('selected', 'correct', 'wrong');
        });
        return;
      }

      // 4. Close modal overlay popup
      const closeBtn = e.target.closest('.adv-quiz-modal-close');
      if (closeBtn) {
        const backdrop = closeBtn.closest('.adv-quiz-modal-backdrop');
        if (backdrop) {
          backdrop.style.display = 'none';
          if (backdrop._originalParent) {
            backdrop._originalParent.appendChild(backdrop);
          }
        }
        document.body.classList.remove('adv-quiz-modal-open');
        return;
      }
    });

    // Reset advanced quiz states when slides transition
    document.addEventListener('slideChanged', (e) => {
      // Find any modal currently teleported to body and return it to its slide
      document.querySelectorAll('body > .adv-quiz-modal-backdrop').forEach(backdrop => {
        backdrop.style.display = 'none';
        if (backdrop._originalParent) {
          backdrop._originalParent.appendChild(backdrop);
        }
      });

      const activeSlideIndex = e.detail.index;
      const slides = document.querySelectorAll('.slide');
      const activeSlide = slides[activeSlideIndex];
      if (!activeSlide) return;

      activeSlide.querySelectorAll('.advanced-quiz-container').forEach(container => {
        container.dataset.submitted = 'false';
        const submitBtn = container.querySelector('.adv-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
        const backdrop = container.querySelector('.adv-quiz-modal-backdrop');
        if (backdrop) backdrop.style.display = 'none';

        container.querySelectorAll('.adv-option').forEach(opt => {
          opt.classList.remove('selected', 'correct', 'wrong');
        });
      });
      document.body.classList.remove('adv-quiz-modal-open');
    });
  }

  /* === Timeline === */
  function initTimeline() {
    document.querySelectorAll('.timeline-item').forEach(item => {
      item.addEventListener('click', () => {
        const timeline = item.closest('.timeline');
        // Toggle active
        const wasActive = item.classList.contains('active');
        timeline.querySelectorAll('.timeline-item.active').forEach(a => a.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    });
  }

  /* === Expandable Bullets === */
  function initBullets() {
    document.querySelectorAll('.bullet-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('expanded');
      });
    });
  }

    /* === Canva-style Chart Tooltips === */
  function bindTooltipEvents(el, text) {
    const showTooltip = (clientX, clientY) => {
      const tooltip = document.querySelector('.chart-tooltip');
      if (!tooltip) return;
      tooltip.innerHTML = text;
      tooltip.style.left = `${clientX}px`;
      tooltip.style.top = `${clientY}px`;
      tooltip.classList.add('visible');
    };

    const hideTooltip = () => {
      const tooltip = document.querySelector('.chart-tooltip');
      if (tooltip) tooltip.classList.remove('visible');
    };

    // Mouse events
    el.addEventListener('mouseenter', (e) => {
      showTooltip(e.clientX, e.clientY);
      el.style.filter = 'brightness(1.15) saturate(1.1)';
    });

    el.addEventListener('mousemove', (e) => {
      const tooltip = document.querySelector('.chart-tooltip');
      if (tooltip) {
        tooltip.style.left = `${e.clientX}px`;
        tooltip.style.top = `${e.clientY}px`;
      }
    });

    el.addEventListener('mouseleave', () => {
      hideTooltip();
      el.style.filter = 'none';
    });

    // Touch events for mobile screens and simulated devices
    el.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        showTooltip(e.touches[0].clientX, e.touches[0].clientY);
        el.style.filter = 'brightness(1.15) saturate(1.1)';
      }
    });

    el.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const tooltip = document.querySelector('.chart-tooltip');
        if (tooltip) {
          tooltip.style.left = `${e.touches[0].clientX}px`;
          tooltip.style.top = `${e.touches[0].clientY}px`;
        }
      }
    });

    el.addEventListener('touchend', () => {
      hideTooltip();
      el.style.filter = 'none';
    });
  }

  function renderChartContainer(container) {
    const svg = container.querySelector('.svg-chart');
    if (!svg) return;

    const type = container.dataset.chartType || 'bar';
    let labels = [];
    let datasets = [];

    try {
      labels = JSON.parse(container.dataset.labels || '[]');
      datasets = JSON.parse(container.dataset.datasets || '[]');
    } catch (e) {
      console.error('Error parsing chart data:', e);
      return;
    }

    svg.innerHTML = ''; // Clear preview

    if (datasets.length === 0) return;

    // Setup theme gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="primary-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-primary)" />
        <stop offset="100%" stop-color="color-mix(in oklch, var(--color-primary) 30%, transparent)" />
      </linearGradient>
      <linearGradient id="success-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-success)" />
        <stop offset="100%" stop-color="color-mix(in oklch, var(--color-success) 30%, transparent)" />
      </linearGradient>
      <linearGradient id="accent-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-accent)" />
        <stop offset="100%" stop-color="color-mix(in oklch, var(--color-accent) 30%, transparent)" />
      </linearGradient>
    `;
    svg.appendChild(defs);

    if (type === 'bar') {
      renderBarChart(svg, labels, datasets);
    } else if (type === 'line') {
      renderLineChart(svg, labels, datasets);
    } else if (type === 'donut') {
      renderDonutChart(svg, labels, datasets);
    }

    // Render legend
    const legend = container.querySelector('.chart-legend');
    if (legend) {
      legend.innerHTML = datasets.map((ds, dsi) => `
        <div class="legend-item" data-dataset-index="${dsi}">
          <span class="legend-color" style="background: var(--color-${ds.color || 'primary'})"></span>
          <span class="legend-label">${ds.label}</span>
        </div>
      `).join('');

      legend.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.dataset.datasetIndex, 10);
          const elements = svg.querySelectorAll(`.dataset-group-${idx}`);
          const isActive = !item.classList.contains('inactive');

          item.classList.toggle('inactive');
          elements.forEach(el => {
            el.style.opacity = isActive ? '0.1' : '1';
            el.style.transition = 'opacity var(--transition-base)';
          });
        });
      });
    }
  }

  /* === Charts === */
  function initCharts() {
    // Create tooltip container if it doesn't exist
    let tooltip = document.querySelector('.chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      document.body.appendChild(tooltip);
    }

    document.querySelectorAll('.chart-block-container').forEach(container => {
      renderChartContainer(container);
    });

    // Re-render and trigger entrance animations on slide switch
    document.addEventListener('slideChanged', (e) => {
      const activeSlideIndex = e.detail.index;
      const slides = document.querySelectorAll('.slide');
      const activeSlide = slides[activeSlideIndex];
      if (!activeSlide) return;

      const chartContainers = activeSlide.querySelectorAll('.chart-block-container');
      chartContainers.forEach(container => {
        renderChartContainer(container);
      });
    });
  }

  function renderBarChart(svg, labels, datasets) {
    const W = 600;
    const H = 320;
    const padding = 50;
    const chartW = W - padding * 2;
    const chartH = H - padding * 2;

    let maxVal = 0;
    datasets.forEach(ds => {
      ds.data.forEach(val => { if (val > maxVal) maxVal = val; });
    });
    maxVal = maxVal * 1.15 || 100;

    const groupCount = labels.length;
    const dsCount = datasets.length;
    const groupWidth = chartW / groupCount;
    const barSpacing = 4;
    const totalBarsWidth = groupWidth * 0.65;
    const singleBarWidth = totalBarsWidth / dsCount - barSpacing;

    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const y = padding + chartH - (i / ticks) * chartH;
      const val = Math.round((i / ticks) * maxVal);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padding);
      line.setAttribute('y1', y);
      line.setAttribute('x2', W - padding);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'var(--color-border-light)');
      line.setAttribute('stroke-width', '1');
      if (i > 0) line.setAttribute('stroke-dasharray', '4 4');
      svg.appendChild(line);

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', padding - 10);
      txt.setAttribute('y', y + 4);
      txt.setAttribute('text-anchor', 'end');
      txt.setAttribute('fill', 'var(--color-text-muted)');
      txt.setAttribute('font-size', '11');
      txt.setAttribute('font-family', 'var(--font-mono)');
      txt.textContent = val;
      svg.appendChild(txt);
    }

    // Support up to 15 columns without overlaps via auto-rotation!
    labels.forEach((lbl, gIdx) => {
      const groupX = padding + gIdx * groupWidth;
      const centerX = groupX + groupWidth / 2;

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', centerX);
      txt.setAttribute('y', H - padding + 24);
      txt.setAttribute('fill', 'var(--color-text-muted)');
      
      if (labels.length > 5) {
        // Rotate labels to fit dense columns nicely
        txt.setAttribute('transform', `rotate(-30, ${centerX}, ${H - padding + 22})`);
        txt.setAttribute('text-anchor', 'end');
        txt.setAttribute('font-size', '10');
      } else {
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('font-size', '12');
      }
      
      txt.textContent = lbl;
      svg.appendChild(txt);

      datasets.forEach((ds, dsIdx) => {
        const val = ds.data[gIdx] || 0;
        const barH = (val / maxVal) * chartH;
        const barX = centerX - totalBarsWidth / 2 + dsIdx * (singleBarWidth + barSpacing);
        const barY = H - padding - barH;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('class', `dataset-group-${dsIdx}`);
        rect.setAttribute('x', barX);
        rect.setAttribute('y', H - padding);
        rect.setAttribute('width', singleBarWidth);
        rect.setAttribute('height', 0);
        rect.setAttribute('rx', 4);
        rect.setAttribute('fill', `url(#${ds.color || 'primary'}-grad)`);

        rect.style.cursor = 'pointer';
        rect.style.transition = 'y 0.8s cubic-bezier(0.25, 1, 0.5, 1), height 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.2s ease';
        
        // Canva-style high fidelity tooltip
        bindTooltipEvents(rect, `<strong>${ds.label}</strong><br><span>${lbl}</span>: <strong style="color: var(--color-${ds.color || 'primary'})">${val}</strong>`);

        svg.appendChild(rect);

        setTimeout(() => {
          rect.setAttribute('y', barY);
          rect.setAttribute('height', Math.max(2, barH));
        }, 50 + gIdx * 30);
      });
    });

    const baseline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    baseline.setAttribute('x1', padding);
    baseline.setAttribute('y1', H - padding);
    baseline.setAttribute('x2', W - padding);
    baseline.setAttribute('y2', H - padding);
    baseline.setAttribute('stroke', 'var(--color-border)');
    baseline.setAttribute('stroke-width', '1.5');
    svg.appendChild(baseline);
  }

  function renderLineChart(svg, labels, datasets) {
    const W = 600;
    const H = 320;
    const padding = 50;
    const chartW = W - padding * 2;
    const chartH = H - padding * 2;

    let maxVal = 0;
    datasets.forEach(ds => {
      ds.data.forEach(val => { if (val > maxVal) maxVal = val; });
    });
    maxVal = maxVal * 1.15 || 100;

    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const y = padding + chartH - (i / ticks) * chartH;
      const val = Math.round((i / ticks) * maxVal);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padding);
      line.setAttribute('y1', y);
      line.setAttribute('x2', W - padding);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'var(--color-border-light)');
      line.setAttribute('stroke-width', '1');
      if (i > 0) line.setAttribute('stroke-dasharray', '4 4');
      svg.appendChild(line);

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', padding - 10);
      txt.setAttribute('y', y + 4);
      txt.setAttribute('text-anchor', 'end');
      txt.setAttribute('fill', 'var(--color-text-muted)');
      txt.setAttribute('font-size', '11');
      txt.setAttribute('font-family', 'var(--font-mono)');
      txt.textContent = val;
      svg.appendChild(txt);
    }

    const stepX = chartW / (labels.length - 1 || 1);

    // Support up to 20 labels without overlaps via auto-rotation!
    labels.forEach((lbl, idx) => {
      const x = padding + idx * stepX;
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', x);
      txt.setAttribute('y', H - padding + 24);
      txt.setAttribute('fill', 'var(--color-text-muted)');
      
      if (labels.length > 5) {
        // Rotate labels to fit dense datasets nicely
        txt.setAttribute('transform', `rotate(-30, ${x}, ${H - padding + 22})`);
        txt.setAttribute('text-anchor', 'end');
        txt.setAttribute('font-size', '10');
      } else {
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('font-size', '12');
      }
      
      txt.textContent = lbl;
      svg.appendChild(txt);
    });

    datasets.forEach((ds, dsIdx) => {
      let pathD = '';
      const points = [];

      ds.data.forEach((val, idx) => {
        const x = padding + idx * stepX;
        const y = H - padding - (val / maxVal) * chartH;
        points.push({ x, y });
        if (idx === 0) {
          pathD += `M ${x} ${y}`;
        } else {
          const prev = points[idx - 1];
          const cp1x = prev.x + stepX / 3;
          const cp1y = prev.y;
          const cp2x = x - stepX / 3;
          const cp2y = y;
          pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        }
      });

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', `dataset-group-${dsIdx}`);
      path.setAttribute('d', pathD);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', `var(--color-${ds.color || 'primary'})`);
      path.setAttribute('stroke-width', '3');
      path.setAttribute('stroke-linecap', 'round');
      
      svg.appendChild(path);
      
      let pathLength = 1500;
      try {
        const totalLen = path.getTotalLength();
        if (totalLen > 0) pathLength = totalLen;
      } catch (e) {
        console.warn('Failed to measure path length, using fallback:', e);
      }

      path.setAttribute('stroke-dasharray', pathLength);
      path.setAttribute('stroke-dashoffset', pathLength);
      path.style.transition = 'stroke-dashoffset 1.5s ease-out';

      setTimeout(() => {
        path.setAttribute('stroke-dashoffset', '0');
      }, 100);

      points.forEach((pt, idx) => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('class', `dataset-group-${dsIdx}`);
        dot.setAttribute('cx', pt.x);
        dot.setAttribute('cy', pt.y);
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', 'var(--color-bg)');
        dot.setAttribute('stroke', `var(--color-${ds.color || 'primary'})`);
        dot.setAttribute('stroke-width', '3');
        dot.style.cursor = 'pointer';
        dot.style.transition = 'r 0.2s ease, filter 0.2s ease';

        // Canva-style high fidelity tooltip
        bindTooltipEvents(dot, `<strong>${ds.label}</strong><br><span>${labels[idx]}</span>: <strong style="color: var(--color-${ds.color || 'primary'})">${ds.data[idx]}</strong>`);

        dot.addEventListener('mouseenter', () => {
          dot.setAttribute('r', '8');
        });
        dot.addEventListener('mouseleave', () => {
          dot.setAttribute('r', '5');
        });
        dot.addEventListener('touchstart', () => {
          dot.setAttribute('r', '8');
        });
        dot.addEventListener('touchend', () => {
          dot.setAttribute('r', '5');
        });

        svg.appendChild(dot);
      });
    });

    const baseline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    baseline.setAttribute('x1', padding);
    baseline.setAttribute('y1', H - padding);
    baseline.setAttribute('x2', W - padding);
    baseline.setAttribute('y2', H - padding);
    baseline.setAttribute('stroke', 'var(--color-border)');
    baseline.setAttribute('stroke-width', '1.5');
    svg.appendChild(baseline);
  }

  function renderDonutChart(svg, labels, datasets) {
    const W = 600;
    const H = 320;
    const cx = W / 2 - 80;
    const cy = H / 2;
    const r = 70;
    const strokeW = 20;
    const circumference = 2 * Math.PI * r;

    const data = datasets[0].data || [];
    const total = data.reduce((a, b) => a + b, 0) || 1;

    let accumulatedAngle = -Math.PI / 2;

    const chartLegendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Support up to 10+ slices with dynamic colors & clean dual-column legends!
    const isDualColumn = data.length > 5;
    const itemsPerCol = isDualColumn ? Math.ceil(data.length / 2) : data.length;
    const lineSpacing = isDualColumn ? 22 : 24;

    data.forEach((val, idx) => {
      const percentage = val / total;
      const strokeLength = percentage * circumference;
      const strokeOffset = circumference - strokeLength;
      
      // Dynamic OKLCH color engine for infinite distinct hues
      const colors = ['primary', 'success', 'accent', 'error', 'warning'];
      let strokeColor;
      if (data.length <= 5) {
        strokeColor = `var(--color-${colors[idx % colors.length]})`;
      } else {
        const hue = Math.round(30 + (idx * 300) / data.length);
        strokeColor = `oklch(68% 0.16 ${hue})`;
      }

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', `dataset-group-0`);
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', strokeColor);
      circle.setAttribute('stroke-width', strokeW);
      circle.setAttribute('stroke-dasharray', circumference);
      circle.setAttribute('stroke-dashoffset', circumference);
      
      const rotAngle = (accumulatedAngle + Math.PI / 2) * (180 / Math.PI);
      circle.setAttribute('transform', `rotate(${rotAngle} ${cx} ${cy})`);
      accumulatedAngle += percentage * 2 * Math.PI;

      circle.style.cursor = 'pointer';
      circle.style.transition = 'stroke-dashoffset 1s ease-out, stroke-width 0.2s ease, filter 0.2s ease';

      // Canva-style high fidelity tooltip
      bindTooltipEvents(circle, `<strong>${labels[idx] || 'Item'}</strong><br><span style="font-size: 1.1rem; font-weight: 700; color: ${strokeColor}">${val}</span> (${Math.round(percentage * 100)}%)`);

      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('stroke-width', strokeW + 4);
      });
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('stroke-width', strokeW);
      });
      circle.addEventListener('touchstart', () => {
        circle.setAttribute('stroke-width', strokeW + 4);
      });
      circle.addEventListener('touchend', () => {
        circle.setAttribute('stroke-width', strokeW);
      });

      svg.appendChild(circle);

      setTimeout(() => {
        circle.setAttribute('stroke-dashoffset', strokeOffset);
      }, 100);

      // Dual-column legend positioning
      const colIdx = isDualColumn ? idx % 2 : 0;
      const rowIdx = isDualColumn ? Math.floor(idx / 2) : idx;
      
      const legendX = isDualColumn 
        ? (cx + r + 25 + colIdx * 125) 
        : (cx + r + 45);
      const legendY = cy - (itemsPerCol * lineSpacing) / 2 + rowIdx * lineSpacing + 8;

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', legendX);
      dot.setAttribute('cy', legendY - 4);
      dot.setAttribute('r', isDualColumn ? '5' : '6');
      dot.setAttribute('fill', strokeColor);
      chartLegendGroup.appendChild(dot);

      const labelTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelTxt.setAttribute('x', legendX + 14);
      labelTxt.setAttribute('y', legendY);
      labelTxt.setAttribute('fill', 'var(--color-text)');
      labelTxt.setAttribute('font-size', isDualColumn ? '10.5' : '13');
      labelTxt.setAttribute('font-weight', '500');
      
      if (isDualColumn) {
        // Combine label and percentage for compact dual-column display
        labelTxt.textContent = `${labels[idx] || 'Item'} (${Math.round(percentage * 100)}%)`;
      } else {
        labelTxt.textContent = `${labels[idx] || 'Item'}`;
      }
      chartLegendGroup.appendChild(labelTxt);

      if (!isDualColumn) {
        const valTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valTxt.setAttribute('x', legendX + 210);
        valTxt.setAttribute('y', legendY);
        valTxt.setAttribute('fill', 'var(--color-text-muted)');
        valTxt.setAttribute('font-size', '13');
        valTxt.setAttribute('font-family', 'var(--font-mono)');
        valTxt.setAttribute('text-anchor', 'end');
        valTxt.textContent = `${val} (${Math.round(percentage * 100)}%)`;
        chartLegendGroup.appendChild(valTxt);
      }
    });

    svg.appendChild(chartLegendGroup);

    const centerTotal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerTotal.setAttribute('x', cx);
    centerTotal.setAttribute('y', cy - 5);
    centerTotal.setAttribute('text-anchor', 'middle');
    centerTotal.setAttribute('fill', 'var(--color-text-muted)');
    centerTotal.setAttribute('font-size', '11');
    centerTotal.setAttribute('font-weight', '600');
    centerTotal.textContent = 'TOTAL';
    svg.appendChild(centerTotal);

    const centerVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerVal.setAttribute('x', cx);
    centerVal.setAttribute('y', cy + 14);
    centerVal.setAttribute('text-anchor', 'middle');
    centerVal.setAttribute('fill', 'var(--color-text)');
    centerVal.setAttribute('font-size', '18');
    centerVal.setAttribute('font-weight', '700');
    centerVal.setAttribute('font-family', 'var(--font-mono)');
    centerVal.textContent = total;
    svg.appendChild(centerVal);
  }

  /* === Tables === */
  function initTables() {
    document.querySelectorAll('.table-search-input').forEach(input => {
      input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        const container = input.closest('.table-block-container');
        const rows = container.querySelectorAll('tbody tr');

        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          const matches = cells.some(cell => cell.textContent.toLowerCase().includes(query));
          row.style.display = matches ? '' : 'none';
        });
      });
    });

    document.querySelectorAll('.sortable-th').forEach(th => {
      let isAsc = true;
      th.addEventListener('click', () => {
        const container = th.closest('.table-block-container');
        const table = container.querySelector('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const index = Array.from(th.parentNode.children).indexOf(th);
        
        th.parentNode.querySelectorAll('.sort-indicator').forEach(ind => ind.textContent = '↕');
        isAsc = !th.classList.contains('asc-sort');
        th.parentNode.querySelectorAll('th').forEach(h => h.classList.remove('asc-sort', 'desc-sort'));

        th.classList.add(isAsc ? 'asc-sort' : 'desc-sort');
        th.querySelector('.sort-indicator').textContent = isAsc ? '▲' : '▼';

        rows.sort((a, b) => {
          const aText = a.children[index].textContent.trim();
          const bText = b.children[index].textContent.trim();

          const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
          const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));

          if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? aNum - bNum : bNum - aNum;
          }

          return isAsc 
            ? aText.localeCompare(bText) 
            : bText.localeCompare(aText);
        });

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }

  /* === Bento Grid === */
  function initBento() {
    // Premium css hover interactions only
  }

  /* === Flow / Mindmap === */
  function initFlows() {
    document.querySelectorAll('.flow-block-container').forEach(container => {
      const svg = container.querySelector('.flow-svg-canvas');
      if (!svg) return;

      let nodes = [];
      let connections = [];

      try {
        nodes = JSON.parse(container.dataset.nodes || '[]');
        connections = JSON.parse(container.dataset.connections || '[]');
      } catch (e) {
        console.error('Error parsing flow data:', e);
        return;
      }

      const nodeWidth = 160;
      const nodeHeight = 50;
      const paddingX = 40;
      const rightSafety = 40;
      const spreadWidth = 800 - paddingX - rightSafety - nodeWidth;

      const N = nodes.length;
      nodes.forEach((node, idx) => {
        if (node.x === undefined) {
          node.x = paddingX + idx * (spreadWidth / Math.max(1, N - 1));
        }
        if (node.y === undefined) {
          node.y = 100 + (idx % 2 === 0 ? 0 : 80);
        }
      });

      const defs = svg.querySelector('defs');
      svg.innerHTML = '';
      if (defs) {
        svg.appendChild(defs);
        const marker = defs.querySelector('#arrow');
        if (marker) {
          // Position arrow tip exactly on the dynamic border of the node!
          marker.setAttribute('refX', Math.round(nodeWidth / 2 + 8));
        }
      }

      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startX = fromNode.x + nodeWidth / 2;
        const startY = fromNode.y + nodeHeight / 2;
        const endX = toNode.x + nodeWidth / 2;
        const endY = toNode.y + nodeHeight / 2;

        const dx = endX - startX;
        const cp1x = startX + dx * 0.4;
        const cp1y = startY;
        const cp2x = startX + dx * 0.6;
        const cp2y = endY;

        path.setAttribute('d', `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'var(--color-primary-alpha)');
        path.setAttribute('stroke-width', '2.5');
        svg.appendChild(path);
      });

      nodes.forEach(node => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'flow-node-group');
        group.setAttribute('data-id', node.id);
        group.style.cursor = 'pointer';

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', node.x);
        rect.setAttribute('y', node.y);
        rect.setAttribute('width', nodeWidth);
        rect.setAttribute('height', nodeHeight);
        rect.setAttribute('rx', 12);
        rect.setAttribute('fill', 'var(--color-surface)');
        rect.setAttribute('stroke', 'var(--color-border)');
        rect.setAttribute('stroke-width', '2');
        rect.style.transition = 'all var(--transition-base)';

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x + nodeWidth / 2);
        text.setAttribute('y', node.y + nodeHeight / 2 + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'var(--color-text)');
        text.setAttribute('font-weight', '600');
        text.style.pointerEvents = 'none';
        
        // Dynamic font scaling & auto-ellipses based on dynamic nodeWidth!
        // Capacity: Fits long labels perfectly even when N=10 (width=60px)
        const fontSize = nodeWidth < 110 ? 9 : (nodeWidth < 135 ? 10 : 12);
        text.setAttribute('font-size', fontSize);
        
        let labelText = node.label || '';
        const charRatio = fontSize === 9 ? 5.5 : (fontSize === 10 ? 6.5 : 7.5);
        const maxChars = Math.floor(nodeWidth / charRatio);
        if (labelText.length > maxChars && maxChars > 5) {
          labelText = labelText.substring(0, maxChars - 2) + '..';
        }
        text.textContent = labelText;

        group.appendChild(rect);
        group.appendChild(text);
        svg.appendChild(group);

        group.addEventListener('click', () => {
          svg.querySelectorAll('rect').forEach(r => {
            r.setAttribute('fill', 'var(--color-surface)');
            r.setAttribute('stroke', 'var(--color-border)');
          });

          rect.setAttribute('fill', 'var(--color-primary-alpha)');
          rect.setAttribute('stroke', 'var(--color-primary)');

          const defaultMsg = container.querySelector('.flow-detail-default-msg');
          const content = container.querySelector('.flow-detail-content');
          const title = container.querySelector('.flow-detail-title');
          const desc = container.querySelector('.flow-detail-desc');

          if (defaultMsg && content && title && desc) {
            defaultMsg.style.display = 'none';
            content.style.display = 'block';
            title.textContent = node.label;
            desc.textContent = node.details || 'No details specified for this step.';
          }
        });
      });
    });
    initDrawing();
    initSearchPalette();
    initLaserPointerTrails();
    initKaTeXMaths();
    initMermaidDiagrams();
    initSyntaxHighlighting();
  }

  /* === 🖌️ Presenter Canvas Annotation & Scribbling Overlay === */
  let isDrawingActive = false;
  function initDrawing() {
    const canvas = document.querySelector('.drawing-canvas-overlay');
    const toolbar = document.querySelector('.drawing-toolbar');
    if (!canvas || !toolbar) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let tool = 'pen'; // 'pen', 'highlighter', 'eraser'
    let color = '#ef4444'; // Red default
    let size = 4;

    function resizeCanvas() {
      const view = document.querySelector('.slides-viewport') || document.body;
      canvas.width = view.clientWidth;
      canvas.height = view.clientHeight;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Toggle overlay and toolbar
    document.addEventListener('toggleDrawingCanvas', () => {
      isDrawingActive = !isDrawingActive;
      if (isDrawingActive) {
        canvas.style.pointerEvents = 'auto';
        toolbar.classList.add('active');
        resizeCanvas();
      } else {
        canvas.style.pointerEvents = 'none';
        toolbar.classList.remove('active');
      }
    });

    // Handle Toolbar Tools Selection
    toolbar.querySelectorAll('.draw-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('draw-clear')) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }
        toolbar.querySelectorAll('.draw-tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tool = btn.dataset.tool;
      });
    });

    // Handle Colors Selection
    toolbar.querySelectorAll('.draw-color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        toolbar.querySelectorAll('.draw-color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        color = dot.dataset.color;
      });
    });

    // Handle Size Range Slider
    const sizeSlider = toolbar.querySelector('.draw-brush-size');
    const sizeIndicator = toolbar.querySelector('.draw-brush-indicator');
    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        size = e.target.value;
        if (sizeIndicator) sizeIndicator.textContent = `Size: ${size}px`;
      });
    }

    // Scribble Drawing Mechanics (Desktop Mouse & Mobile Touch)
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      if (!isDrawingActive) return;
      isDrawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      e.preventDefault();
    }

    function draw(e) {
      if (!isDrawingActive || !isDrawing) return;
      const pos = getPos(e);

      ctx.lineWidth = size;
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = size * 3; // Wider eraser
      } else if (tool === 'highlighter') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.globalAlpha = 1.0;
      }

      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      e.preventDefault();
    }

    function stopDraw() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);

    // Clear canvas when slides navigate
    document.addEventListener('slideChanged', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  /* === 🔍 Glassmorphic Spotlight Search Command Palette === */
  function initSearchPalette() {
    const backdrop = document.querySelector('.search-palette-backdrop');
    const input = document.querySelector('.search-input');
    const list = document.querySelector('.search-results-list');
    if (!backdrop || !input || !list) return;

    let selectedIndex = -1;
    let currentResults = [];

    document.addEventListener('toggleSearchPalette', () => {
      const isVisible = backdrop.style.display === 'flex';
      if (isVisible) {
        backdrop.style.display = 'none';
      } else {
        backdrop.style.display = 'flex';
        input.value = '';
        input.focus();
        renderResults('');
      }
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.style.display = 'none';
      }
    });

    input.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    function renderResults(query) {
      list.innerHTML = '';
      selectedIndex = -1;
      currentResults = [];

      const queryLower = query.toLowerCase().trim();
      const slides = Array.from(document.querySelectorAll('.slide'));

      slides.forEach((s, idx) => {
        const headingEl = s.querySelector('h2, h1');
        const heading = headingEl ? headingEl.textContent.trim() : `Slide ${idx + 1}`;
        const bodyContent = s.textContent.toLowerCase();

        if (!queryLower || heading.toLowerCase().includes(queryLower) || bodyContent.includes(queryLower)) {
          currentResults.push({ index: idx, heading, id: s.id || `slide-${idx + 1}` });
        }
      });

      if (currentResults.length === 0) {
        list.innerHTML = `<div style="padding:1rem; text-align:center; color:var(--color-text-muted);">No results found. Try another query!</div>`;
        return;
      }

      currentResults.forEach((res, i) => {
        const item = document.createElement('button');
        item.className = 'search-result-item';
        item.innerHTML = `
          <span class="search-result-num">${res.index + 1}</span>
          <div class="search-result-info">
            <span class="search-result-title">${res.heading}</span>
            <span class="search-result-snippet">Jump to #${res.id}</span>
          </div>
        `;
        item.addEventListener('click', () => {
          if (window.SlideEngine) window.SlideEngine.goTo(res.index);
          backdrop.style.display = 'none';
        });
        list.appendChild(item);
      });
    }

    input.addEventListener('keydown', (e) => {
      const items = list.querySelectorAll('.search-result-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelectedResult(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelectedResult(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          items[selectedIndex].click();
        } else if (items.length > 0) {
          items[0].click();
        }
      } else if (e.key === 'Escape') {
        backdrop.style.display = 'none';
      }
    });

    function updateSelectedResult(items) {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('selected');
        }
      });
    }
  }

  /* === 🎯 Decaying Laser Pointer Particle Trails === */
  function initLaserPointerTrails() {
    document.addEventListener('mousemove', (e) => {
      if (!document.body.classList.contains('laser-pointer')) return;

      const dot = document.createElement('div');
      dot.className = 'laser-trail-particle';
      dot.style.position = 'fixed';
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.backgroundColor = '#ef4444';
      dot.style.borderRadius = '50%';
      dot.style.pointerEvents = 'none';
      dot.style.zIndex = '9999999';
      dot.style.transform = 'translate(-50%, -50%)';
      dot.style.boxShadow = '0 0 10px #ef4444, 0 0 20px #ef4444';
      dot.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      document.body.appendChild(dot);

      setTimeout(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'translate(-50%, -50%) scale(0.2)';
      }, 50);

      setTimeout(() => {
        dot.remove();
      }, 450);
    });
  }

  /* === 🧮 KaTeX On-Demand Loader === */
  function initKaTeXMaths() {
    const containers = document.querySelectorAll('.math-display-equation');
    if (containers.length === 0) return;

    if (!window.renderMathInElement) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
      script.onload = () => {
        containers.forEach(el => {
          const latex = el.dataset.latex || '';
          try {
            window.katex.render(latex, el, { displayMode: true, throwOnError: false });
          } catch (e) {
            console.error('KaTeX error:', e);
          }
        });
      };
      document.body.appendChild(script);
    }
  }

  /* === 🌿 Mermaid On-Demand Loader === */
  function initMermaidDiagrams() {
    const containers = document.querySelectorAll('.mermaid');
    if (containers.length === 0) return;

    if (!window.mermaid) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.2.4/dist/mermaid.min.js';
      script.onload = () => {
        window.mermaid.initialize({ startOnLoad: true, theme: 'neutral' });
      };
      document.body.appendChild(script);
    }
  }

  /* === 💻 Prism Syntax Highlighting On-Demand Loader === */
  function initSyntaxHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    if (codeBlocks.length === 0) return;

    if (!window.Prism) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
      script.onload = () => {
        window.Prism.highlightAll();
      };
      document.body.appendChild(script);
    }
  }

  return { init };
})();

window.InteractiveBlocks = window.InteractiveBlocks || InteractiveBlocks;
