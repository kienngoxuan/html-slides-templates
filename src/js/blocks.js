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
    initTimeline();
    initBullets();
  }

  /* === Accordion === */
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const accordion = item.closest('.accordion');
        // Close others in same accordion
        accordion.querySelectorAll('.accordion-item.open').forEach(open => {
          if (open !== item) open.classList.remove('open');
        });
        item.classList.toggle('open');
      });
    });
  }

  /* === Tabs === */
  function initTabs() {
    document.querySelectorAll('.tabs-container').forEach(container => {
      const buttons = container.querySelectorAll('.tab-btn');
      const panels = container.querySelectorAll('.tab-panel');

      buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          panels[i].classList.add('active');
        });
      });
    });
  }

  /* === Stepper === */
  function initSteppers() {
    document.querySelectorAll('.stepper').forEach(stepper => {
      const dots = stepper.querySelectorAll('.step-dot');
      const contents = stepper.querySelectorAll('.step-content');
      const lines = stepper.querySelectorAll('.step-line');
      const prevBtn = stepper.querySelector('.step-prev');
      const nextBtn = stepper.querySelector('.step-next');
      let currentStep = 0;

      function goToStep(idx) {
        if (idx < 0 || idx >= contents.length) return;
        currentStep = idx;

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

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToStep(i));
      });

      if (prevBtn) prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => goToStep(currentStep + 1));

      goToStep(0);
    });
  }

  /* === Flip Cards === */
  function initFlipCards() {
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }

  /* === Quiz === */
  function initQuiz() {
    document.querySelectorAll('.quiz-question').forEach(question => {
      const correctIdx = parseInt(question.dataset.correct, 10);
      const options = question.querySelectorAll('.quiz-option');
      const explanation = question.querySelector('.quiz-explanation');
      let answered = false;

      options.forEach((opt, i) => {
        opt.addEventListener('click', () => {
          if (answered) return;
          answered = true;

          opt.classList.add('selected');
          if (i === correctIdx) {
            opt.classList.add('correct');
          } else {
            opt.classList.add('wrong');
            options[correctIdx].classList.add('correct');
          }

          if (explanation) {
            explanation.classList.add('visible');
          }
        });
      });
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

  return { init };
})();
