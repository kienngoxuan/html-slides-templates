/**
 * LECTA AI — Core Interactive Elements
 * Accordion, Tabs, Stepper, Flip Cards, Quiz, Advanced Quiz, Timeline, Bullets, Interactive Images
 */

const InteractiveBlocksCore = (function () {

  function init() {
    initInteractiveImages();
    initAccordions();
    initTabs();
    initSteppers();
    initFlipCards();
    initQuiz();
    initAdvancedQuiz();
    initTimeline();
    initBullets();
    initChecklist();
  }

  /* === Interactive Image URL Customizer === */
  function initInteractiveImages() {
    const IMAGE_INDEX_KEY = 'lecta-img-index';
    const IMAGE_CACHE_LIMIT = 40;

    function readImageIndex() {
      try {
        const raw = localStorage.getItem(IMAGE_INDEX_KEY);
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
      } catch (e) {
        console.warn('localStorage is blocked or full:', e);
        return [];
      }
    }

    function writeImageIndex(list) {
      try {
        localStorage.setItem(IMAGE_INDEX_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('localStorage is blocked or full:', e);
      }
    }

    function pruneImageIndex(list) {
      while (list.length > IMAGE_CACHE_LIMIT) {
        const key = list.shift();
        if (!key) continue;
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('localStorage is blocked or full:', e);
        }
      }
    }

    function recordImageKey(key) {
      const list = readImageIndex().filter((k) => k !== key);
      list.push(key);
      pruneImageIndex(list);
      writeImageIndex(list);
    }

    function saveImageUrl(key, url) {
      try {
        localStorage.setItem(key, url);
        recordImageKey(key);
      } catch (err) {
        console.warn('localStorage is blocked or full:', err);
        const list = readImageIndex();
        pruneImageIndex(list);
        try {
          localStorage.setItem(key, url);
          recordImageKey(key);
        } catch (e) {
          console.warn('localStorage is blocked or full:', e);
        }
      }
    }

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

    function closeEditor(editor) {
      if (!editor) return;
      editor.remove();
    }

    function openImageEditor(wrapper, img, key) {
      if (!wrapper || !img) return;
      const existing = wrapper.querySelector('.image-url-editor');
      if (existing) return;

      const editor = document.createElement('div');
      editor.className = 'image-url-editor';

      const panel = document.createElement('div');
      panel.className = 'image-url-editor-panel';

      const label = document.createElement('label');
      label.className = 'image-url-editor-label';
      label.textContent = 'Image URL';

      const input = document.createElement('input');
      input.type = 'url';
      input.className = 'image-url-editor-input';
      input.placeholder = 'https://...';
      input.value = img.src || '';

      const actions = document.createElement('div');
      actions.className = 'image-url-editor-actions';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-outline';
      cancelBtn.textContent = 'Cancel';

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'btn btn-primary';
      saveBtn.textContent = 'Apply';

      actions.appendChild(cancelBtn);
      actions.appendChild(saveBtn);
      panel.appendChild(label);
      panel.appendChild(input);
      panel.appendChild(actions);
      editor.appendChild(panel);
      wrapper.appendChild(editor);

      const applyValue = () => {
        const newUrl = input.value.trim();
        if (!newUrl) return;
        img.src = newUrl;
        saveImageUrl(key, newUrl);
        closeEditor(editor);
      };

      saveBtn.addEventListener('click', applyValue);
      cancelBtn.addEventListener('click', () => closeEditor(editor));
      editor.addEventListener('click', (evt) => {
        if (evt.target === editor) closeEditor(editor);
      });
      input.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter') {
          evt.preventDefault();
          applyValue();
        } else if (evt.key === 'Escape') {
          closeEditor(editor);
        }
      });

      setTimeout(() => input.focus(), 0);
    }

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.edit-image-overlay-btn');
      if (!btn) return;
      const wrapper = btn.closest('.image-box-wrapper');
      const img = wrapper ? wrapper.querySelector('.interactive-image') : null;
      if (!img) return;

      const slide = btn.closest('.slide');
      const key = 'lecta-img-' + (slide ? slide.id : 'index-0');

      openImageEditor(wrapper, img, key);
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
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.flip-card');
      if (card) {
        card.classList.toggle('flipped');
      }
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

          options.forEach(o => o.classList.remove('selected', 'correct', 'wrong'));
          opt.classList.add('selected');

          if (i === correctIdx) {
            question.dataset.answered = 'true';
            opt.classList.add('correct');
            if (explanation) explanation.classList.add('visible');
          } else {
            opt.classList.add('wrong');
            if (options[correctIdx]) options[correctIdx].classList.add('correct');
            if (explanation) explanation.classList.add('visible');
          }
        });
      });
    });

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
        if (explanation) explanation.classList.remove('visible');
      });
    });
  }

  /* === Advanced Quiz (Submit Assessment) === */
  function initAdvancedQuiz() {
    document.addEventListener('click', (e) => {
      const option = e.target.closest('.adv-option');
      if (option) {
        const question = option.closest('.adv-question');
        const container = option.closest('.advanced-quiz-container');
        if (!container || container.dataset.submitted === 'true') return;

        question.querySelectorAll('.adv-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        return;
      }

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

          document.querySelectorAll('body > .adv-quiz-modal-backdrop').forEach(existing => {
            if (existing !== backdrop) {
              existing.style.display = 'none';
              if (existing._originalParent) {
                existing._originalParent.appendChild(existing);
              } else {
                existing.remove();
              }
            }
          });

          if (backdrop.parentElement !== document.body) {
            backdrop._originalParent = container;
            document.body.appendChild(backdrop);
          }

          backdrop.style.display = 'flex';
          document.body.classList.add('adv-quiz-modal-open');
        }
        return;
      }

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

      const closeBtn = e.target.closest('.adv-quiz-modal-close');
      if (closeBtn) {
        const backdrop = closeBtn.closest('.adv-quiz-modal-backdrop');
        if (backdrop) {
          backdrop.style.display = 'none';
          const parent = backdrop._originalParent || backdrop.closest('.advanced-quiz-container');
          if (parent) parent.appendChild(backdrop);
        }
        document.body.classList.remove('adv-quiz-modal-open');
        return;
      }
    });

    document.addEventListener('slideChanged', (e) => {
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

  /* === Checklist Reveal === */
  function initChecklist() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.checklist-toggle');
      if (!toggle) return;
      const item = toggle.closest('.checklist-item');
      if (!item) return;

      const isChecked = item.classList.contains('checked');
      item.classList.toggle('checked', !isChecked);

      // Update aria state
      toggle.setAttribute('aria-pressed', String(!isChecked));

      // Update box content
      const box = toggle.querySelector('.checklist-box');
      if (box) box.textContent = !isChecked ? '✓' : '';

      // Micro-bounce animation
      item.style.transform = 'scale(1.02)';
      setTimeout(() => { item.style.transform = ''; }, 200);
    });
  }

  return { init };
})();

window.InteractiveBlocksCore = window.InteractiveBlocksCore || InteractiveBlocksCore;
