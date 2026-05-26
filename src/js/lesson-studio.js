/**
 * LECTA AI — Lesson Studio (Phase 1)
 * Shared context panel, template library copy, and progressive flow steps.
 */

const LessonStudio = (function () {
  const CONTEXT_STATUS_TIMEOUT = 1600;
  const RECORDING_STATUS_TIMEOUT = 1400;
  let latestFlowState = null;
  let latestHealth = [];

  function init() {
    if (location.search.includes('presenter=true')) return;
    initContextPanel();
    initTemplateLibrary();
    initFlowPanel();
    initRecordingPanel();
  }

  function safeJSONParse(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function getJSONScript(id, fallback) {
    const el = document.getElementById(id);
    if (!el) return fallback;
    return safeJSONParse(el.textContent || '', fallback);
  }

  function safeGetItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // ignore
    }
  }

  function safeRemoveItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  }

  function getDeckId() {
    return document.body.dataset.deckId || 'lecta-deck';
  }

  function getActiveContext() {
    const defaults = getJSONScript('lesson-context-data', {});
    const stored = safeJSONParse(safeGetItem(`lecta-context-${getDeckId()}`), null);
    return stored || defaults || {};
  }

  /* === Shared Context Panel === */
  function initContextPanel() {
    const panel = document.querySelector('[data-panel="context"]');
    if (!panel) return;

    const defaults = getJSONScript('lesson-context-data', {});
    const deckId = getDeckId();
    const storageKey = `lecta-context-${deckId}`;

    const inputs = panel.querySelectorAll('.context-input, .context-select');
    const saveBtn = panel.querySelector('.context-save-btn');
    const resetBtn = panel.querySelector('.context-reset-btn');
    const status = panel.querySelector('.context-status');

    const stored = safeJSONParse(safeGetItem(storageKey), null);
    const active = stored || defaults;
    applyContextValues(inputs, active);
    applyRhythmPreset(active.rhythmPreset || 'beginner-friendly', active.textDensity || 'medium');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const payload = collectContextValues(inputs);
        safeSetItem(storageKey, JSON.stringify(payload));
        applyRhythmPreset(payload.rhythmPreset || 'beginner-friendly', payload.textDensity || 'medium');
        showContextStatus(status, 'Context saved.');
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        safeRemoveItem(storageKey);
        applyContextValues(inputs, defaults);
        applyRhythmPreset(defaults.rhythmPreset || 'beginner-friendly', defaults.textDensity || 'medium');
        showContextStatus(status, 'Context reset to deck defaults.');
      });
    }
  }

  function applyContextValues(inputs, values) {
    inputs.forEach((input) => {
      const field = input.dataset.field;
      if (!field) return;
      if (values[field] !== undefined) {
        input.value = values[field];
      }
    });
  }

  function collectContextValues(inputs) {
    const payload = {};
    inputs.forEach((input) => {
      const field = input.dataset.field;
      if (!field) return;
      if (input.type === 'number') {
        payload[field] = parseInt(input.value, 10) || 0;
      } else {
        payload[field] = input.value || '';
      }
    });
    return payload;
  }

  function showContextStatus(el, message) {
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => {
      el.style.display = 'none';
    }, CONTEXT_STATUS_TIMEOUT);
  }

  function applyRhythmPreset(preset, density) {
    const root = document.documentElement;
    const map = {
      'beginner-friendly': { font: 1.05, line: 1.08, space: 1.1, duration: 420, stagger: 80 },
      'intermediate-deep-dive': { font: 1, line: 1, space: 1, duration: 360, stagger: 60 },
      'fast-recap': { font: 0.95, line: 0.95, space: 0.9, duration: 260, stagger: 40 },
      'example-heavy': { font: 1, line: 1.02, space: 1.05, duration: 380, stagger: 70 },
      'code-heavy': { font: 0.95, line: 0.98, space: 0.95, duration: 340, stagger: 50 },
    };

    const densityMap = {
      low: { font: 1.05, line: 1.06, space: 1.08 },
      medium: { font: 1, line: 1, space: 1 },
      high: { font: 0.95, line: 0.96, space: 0.92 },
    };

    const config = map[preset] || map['beginner-friendly'];
    const densityCfg = densityMap[density] || densityMap.medium;
    root.style.setProperty('--font-scale', String(config.font * densityCfg.font));
    root.style.setProperty('--line-scale', String(config.line * densityCfg.line));
    root.style.setProperty('--space-scale', String(config.space * densityCfg.space));
    root.style.setProperty('--flow-duration', `${config.duration}ms`);
    root.style.setProperty('--flow-stagger', `${config.stagger}ms`);
  }

  /* === Use-case Template Library === */
  function initTemplateLibrary() {
    const panel = document.querySelector('[data-panel="templates"]');
    if (!panel) return;

    panel.addEventListener('click', (e) => {
      const btn = e.target.closest('.template-copy-btn');
      if (!btn) return;
      const card = btn.closest('.template-card');
      if (!card) return;

      const payload = card.dataset.template || '';
      copyToClipboard(payload, btn);
    });
  }

  function copyToClipboard(text, btn) {
    if (!text) return;

    const onSuccess = () => {
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {});
      return;
    }

    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (e) {
      // ignore
    }
    temp.remove();
  }

  /* === Progressive Flow Panel === */
  function initFlowPanel() {
    const panel = document.querySelector('[data-panel="flow"]');
    if (!panel) return;

    const stepCount = panel.querySelector('.flow-step-count');
    const stepList = panel.querySelector('.flow-step-list');
    const emptyState = panel.querySelector('.flow-empty');
    const prevBtn = panel.querySelector('[data-flow="prev"]');
    const nextBtn = panel.querySelector('[data-flow="next"]');
    const resetBtn = panel.querySelector('[data-flow="reset"]');

    let steps = [];
    let currentStep = 0;
    let currentSlide = null;

    function loadForSlide(slide) {
      currentSlide = slide;
      const raw = slide ? slide.dataset.flow : '';
      const parsed = safeJSONParse(raw || '[]', []);
      steps = normalizeSteps(parsed);
      currentStep = 0;
      renderStepList();
      applyFlowState();
    }

    function normalizeSteps(rawSteps) {
      if (!Array.isArray(rawSteps)) return [];
      return rawSteps.map((step, idx) => {
        const action = (step.action || 'reveal').toLowerCase();
        const targets = step.targets || step.target || [];
        const targetList = Array.isArray(targets) ? targets : [targets];
        const rawPreset = step.preset || step.motion || (action === 'highlight' ? 'highlight-pulse' : 'fade-up');
        const preset = String(rawPreset || '').trim().toLowerCase().replace(/\s+/g, '-');
        return {
          id: step.id || `step-${idx + 1}`,
          label: step.label || `${action === 'highlight' ? 'Highlight' : 'Reveal'} ${idx + 1}`,
          action,
          preset,
          targets: targetList.filter(Boolean),
        };
      }).filter((step) => step.targets.length > 0);
    }

    function getTargetsForStep(step) {
      if (!currentSlide) return [];
      const nodes = [];
      step.targets.forEach((selector) => {
        currentSlide.querySelectorAll(selector).forEach((el) => nodes.push(el));
      });
      return nodes;
    }

    function applyFlowState() {
      if (!currentSlide) return;

      const revealTargets = new Set();
      const allTargets = new Set();
      steps.forEach((step) => {
        getTargetsForStep(step).forEach((el) => {
          allTargets.add(el);
          if (step.action === 'reveal') revealTargets.add(el);
        });
      });

      allTargets.forEach((el) => {
        el.classList.remove('flow-highlight', 'flow-revealed', 'flow-hidden', 'flow-animate', 'flow-controlled');
        el.classList.forEach((cls) => {
          if (cls.startsWith('flow-preset-')) {
            el.classList.remove(cls);
          }
        });
      });

      revealTargets.forEach((el) => {
        el.classList.add('flow-hidden', 'flow-controlled');
      });

      for (let i = 0; i < currentStep; i++) {
        applyStep(steps[i]);
      }

      updateControls();
      emitFlowState();
    }

    function applyStep(step) {
      if (!step) return;
      const targets = getTargetsForStep(step);
      const presetClass = step.preset ? `flow-preset-${step.preset}` : '';

      if (step.action === 'highlight') {
        targets.forEach((el) => {
          el.classList.add('flow-highlight', 'flow-animate');
          if (presetClass) el.classList.add(presetClass);
        });
        return;
      }

      targets.forEach((el) => {
        el.classList.remove('flow-hidden');
        el.classList.add('flow-revealed');
        if (presetClass) {
          el.classList.add('flow-animate', presetClass);
        }
      });
    }

    function updateControls() {
      const total = steps.length;
      if (stepCount) stepCount.textContent = `${currentStep}/${total}`;

      if (prevBtn) prevBtn.disabled = currentStep <= 0;
      if (nextBtn) nextBtn.disabled = currentStep >= total;
      if (resetBtn) resetBtn.disabled = total === 0;

      if (emptyState) emptyState.style.display = total === 0 ? 'block' : 'none';
      if (stepList) stepList.style.display = total === 0 ? 'none' : 'flex';
    }

    function emitFlowState() {
      const total = steps.length;
      const currentLabel = currentStep > 0 && steps[currentStep - 1] ? steps[currentStep - 1].label : 'Not started';
      const nextLabel = currentStep < total && steps[currentStep] ? steps[currentStep].label : 'End';
      latestFlowState = {
        total,
        currentStep,
        currentLabel,
        nextLabel,
      };
      document.dispatchEvent(new CustomEvent('flowState', { detail: latestFlowState }));
    }

    function renderStepList() {
      if (!stepList) return;
      const total = steps.length;
      if (total === 0) {
        stepList.innerHTML = '';
        updateControls();
        return;
      }

      stepList.innerHTML = steps.map((step, idx) => {
        const isActive = idx === currentStep - 1;
        const isDone = idx < currentStep;
        const badge = step.preset || step.action;
        return `
          <button class="flow-step-item${isActive ? ' active' : ''}${isDone ? ' done' : ''}" type="button" data-step-index="${idx}">
            <span class="flow-step-badge">${badge}</span>
            <span class="flow-step-label">${step.label}</span>
          </button>`;
      }).join('');

      stepList.querySelectorAll('.flow-step-item').forEach((item) => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.dataset.stepIndex, 10);
          if (Number.isNaN(idx)) return;
          currentStep = Math.min(Math.max(idx + 1, 0), steps.length);
          applyFlowState();
          renderStepList();
        });
      });

      updateControls();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep <= 0) return;
        currentStep -= 1;
        applyFlowState();
        renderStepList();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep >= steps.length) return;
        currentStep += 1;
        applyFlowState();
        renderStepList();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentStep = 0;
        applyFlowState();
        renderStepList();
      });
    }

    document.addEventListener('slideChanged', (e) => {
      const slides = document.querySelectorAll('.slide');
      const slide = slides[e.detail.index];
      if (slide) loadForSlide(slide);
    });

    const firstSlide = document.querySelector('.slide');
    if (firstSlide) loadForSlide(firstSlide);
  }

  /* === Recording Panel === */
  function initRecordingPanel() {
    const panel = document.querySelector('[data-panel="recording"]');
    if (!panel) return;

    const currentEl = panel.querySelector('[data-recording="current-step"]');
    const nextEl = panel.querySelector('[data-recording="next-step"]');
    const timeEl = panel.querySelector('[data-recording="slide-time"]');
    const stepEl = panel.querySelector('[data-recording="step-count"]');
    const statusEl = panel.querySelector('.recording-status');
    const jumpSelect = panel.querySelector('.recording-jump');
    const checkpointInput = panel.querySelector('.recording-checkpoint');
    const checkpointSave = panel.querySelector('.recording-save');
    const checkpointMsg = panel.querySelector('.recording-save-msg');
    const healthList = panel.querySelector('.recording-health-list');
    const healthEmpty = panel.querySelector('.recording-health-empty');

    const templatePanel = document.querySelector('[data-panel="templates"]');

    const cameraGroup = panel.querySelector('[data-recording-group="camera"]');
    const subtitleGroup = panel.querySelector('[data-recording-group="subtitle"]');

    const deckId = getDeckId();
    const safeKey = `lecta-safezone-${deckId}`;

    const safeState = safeJSONParse(safeGetItem(safeKey), { camera: 'off', subtitle: 'off' });
    applySafeZoneState(safeState);
    updateToggleGroup(cameraGroup, safeState.camera);
    updateToggleGroup(subtitleGroup, safeState.subtitle);

    function updateRecordingFlow(state) {
      const total = state ? state.total : 0;
      const currentIdx = state ? state.currentStep : 0;
      if (currentEl) currentEl.textContent = `Step ${currentIdx}/${total}`;
      if (nextEl) nextEl.textContent = `Next: ${state ? state.nextLabel : '-'}`;
      if (stepEl) stepEl.textContent = `${total}`;
      if (timeEl) timeEl.textContent = formatSeconds(estimateSlideTime(total));
    }

    function updateHealthForSlide(slide) {
      if (!healthList || !healthEmpty) return;
      const index = window.SlideEngine && typeof window.SlideEngine.getCurrent === 'function'
        ? window.SlideEngine.getCurrent()
        : 0;
      const health = latestHealth[index];
      if (!health) {
        healthList.innerHTML = '';
        healthEmpty.style.display = 'block';
        if (statusEl) statusEl.textContent = 'Ready';
        return;
      }

      const issues = buildHealthIssues(health, getActiveContext());
      if (issues.length === 0) {
        healthList.innerHTML = '';
        healthEmpty.style.display = 'block';
        if (statusEl) statusEl.textContent = 'Ready';
        return;
      }

      healthEmpty.style.display = 'none';
      healthList.innerHTML = issues.map((issue) => {
        return `<li class="recording-health-item ${issue.level}">${issue.text}</li>`;
      }).join('');
      if (statusEl) statusEl.textContent = 'Review';
    }

    function updateTemplateRecommendations(slide) {
      if (!templatePanel) return;
      const recommended = getRecommendedCategoryId(slide);
      templatePanel.querySelectorAll('.template-category').forEach((cat) => {
        cat.classList.toggle('recommended', Boolean(recommended && cat.dataset.categoryId === recommended));
      });
    }

    document.addEventListener('flowState', (e) => {
      updateRecordingFlow(e.detail || null);
    });

    document.addEventListener('slideHealth', (e) => {
      latestHealth = Array.isArray(e.detail) ? e.detail : [];
      const slide = document.querySelectorAll('.slide')[window.SlideEngine && typeof window.SlideEngine.getCurrent === 'function'
        ? window.SlideEngine.getCurrent()
        : 0];
      updateHealthForSlide(slide);
    });

    if (latestFlowState) updateRecordingFlow(latestFlowState);

    if (jumpSelect) {
      populateJumpSelect(jumpSelect);
      jumpSelect.addEventListener('change', () => {
        const idx = parseInt(jumpSelect.value, 10);
        if (!Number.isNaN(idx) && window.SlideEngine) {
          window.SlideEngine.goTo(idx);
        }
      });
    }

    function updateCheckpoint(slide) {
      if (!checkpointInput) return;
      const slideId = slide ? slide.id : 'slide-0';
      checkpointInput.dataset.slideId = slideId;
      const stored = safeGetItem(`lecta-checkpoint-${deckId}-${slideId}`);
      checkpointInput.value = stored || '';
    }

    if (checkpointSave) {
      checkpointSave.addEventListener('click', () => {
        if (!checkpointInput) return;
        const slideId = checkpointInput.dataset.slideId || 'slide-0';
        safeSetItem(`lecta-checkpoint-${deckId}-${slideId}`, checkpointInput.value || '');
        showRecordingStatus(checkpointMsg, 'Checkpoint saved.');
      });
    }

    if (cameraGroup) {
      cameraGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.recording-toggle');
        if (!btn) return;
        const value = btn.dataset.value || 'off';
        const state = safeJSONParse(safeGetItem(safeKey), { camera: 'off', subtitle: 'off' });
        state.camera = value;
        safeSetItem(safeKey, JSON.stringify(state));
        applySafeZoneState(state);
        updateToggleGroup(cameraGroup, value);
      });
    }

    if (subtitleGroup) {
      subtitleGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.recording-toggle');
        if (!btn) return;
        const value = btn.dataset.value || 'off';
        const state = safeJSONParse(safeGetItem(safeKey), { camera: 'off', subtitle: 'off' });
        state.subtitle = value;
        safeSetItem(safeKey, JSON.stringify(state));
        applySafeZoneState(state);
        updateToggleGroup(subtitleGroup, value);
      });
    }

    document.addEventListener('slideChanged', (e) => {
      const slides = document.querySelectorAll('.slide');
      const slide = slides[e.detail.index];
      updateCheckpoint(slide);
      updateHealthForSlide(slide);
      updateTemplateRecommendations(slide);
      if (jumpSelect) {
        jumpSelect.value = String(e.detail.index);
      }
    });

    const firstSlide = document.querySelector('.slide');
    updateCheckpoint(firstSlide);
    updateTemplateRecommendations(firstSlide);
  }

  function populateJumpSelect(select) {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const options = slides.map((slide, idx) => {
      const heading = slide.querySelector('h1, h2');
      const label = heading ? heading.textContent.trim() : `Slide ${idx + 1}`;
      return `<option value="${idx}">${idx + 1}. ${label}</option>`;
    });
    select.innerHTML = options.join('');
    select.value = '0';
  }

  function updateToggleGroup(group, value) {
    if (!group) return;
    group.querySelectorAll('.recording-toggle').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.value === value);
    });
  }

  function applySafeZoneState(state) {
    const body = document.body;
    body.classList.remove('safe-zone-enabled', 'safe-zone-camera-left', 'safe-zone-camera-right', 'safe-zone-subtitle-on');

    const camera = state.camera || 'off';
    const subtitle = state.subtitle || 'off';
    if (camera === 'left') body.classList.add('safe-zone-camera-left');
    if (camera === 'right') body.classList.add('safe-zone-camera-right');
    if (subtitle === 'on') body.classList.add('safe-zone-subtitle-on');

    if (camera !== 'off' || subtitle === 'on') {
      body.classList.add('safe-zone-enabled');
    }
  }

  function estimateSlideTime(stepsCount) {
    const context = getActiveContext();
    const pace = context.pace || 'standard';
    const rhythm = context.rhythmPreset || 'beginner-friendly';

    const paceFactor = pace === 'slow' ? 1.2 : pace === 'fast' ? 0.85 : 1;
    const rhythmBase = {
      'beginner-friendly': 14,
      'intermediate-deep-dive': 12,
      'fast-recap': 10,
      'example-heavy': 13,
      'code-heavy': 12,
    };
    const base = rhythmBase[rhythm] || 12;
    const perStep = rhythm === 'fast-recap' ? 4 : rhythm === 'example-heavy' ? 6 : 5;
    const seconds = (base + stepsCount * perStep) * paceFactor;
    return Math.round(seconds);
  }

  function formatSeconds(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function showRecordingStatus(el, message) {
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => {
      el.style.display = 'none';
    }, RECORDING_STATUS_TIMEOUT);
  }

  function buildHealthIssues(health, context) {
    const density = context.textDensity || 'medium';
    const maxChars = density === 'low' ? 650 : density === 'high' ? 1100 : 850;
    const issues = [];

    if (health.chars > maxChars) {
      issues.push({
        level: health.chars > maxChars * 1.3 ? 'danger' : 'warning',
        text: 'Text density is high. Consider splitting the slide.',
      });
    }

    if (health.bullets >= 6) {
      issues.push({ level: 'warning', text: 'Many bullets. Group or split content.' });
    }

    if (health.codeLines >= 12) {
      issues.push({ level: 'warning', text: 'Code block is long. Highlight a subset.' });
    }

    if (health.steps === 0 && health.chars > 260) {
      issues.push({ level: 'warning', text: 'No flow steps for a dense slide.' });
    }

    if (!health.hasNotes) {
      issues.push({ level: 'warning', text: 'Missing speaker notes.' });
    }

    return issues;
  }

  function getRecommendedCategoryId(slide) {
    if (!slide) return '';
    const title = (slide.querySelector('h1, h2') || {}).textContent || '';
    const lower = title.toLowerCase();

    if (slide.querySelector('.slide-title')) return 'chapter-opener';
    if (slide.querySelector('.compare-container')) return 'comparison';
    if (slide.querySelector('.flow-block-container')) return 'pipeline';
    if (slide.querySelector('.stepper')) return 'example-breakdown';
    if (slide.querySelector('.summary-items')) return 'recap';
    if (slide.querySelector('.split-layout-container pre code') || slide.querySelector('.sub-code')) return 'code-explain';
    if (lower.includes('mistake') || lower.includes('misconception')) return 'misconception';
    if (slide.querySelector('.bullet-list')) return 'concept-intro';

    return '';
  }

  return { init };
})();

window.LessonStudio = window.LessonStudio || LessonStudio;
