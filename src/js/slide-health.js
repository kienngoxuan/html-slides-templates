/**
 * LECTA AI — Slide Health Checker (Phase 4)
 * Computes simple heuristics per slide and emits `slideHealth` event.
 */

const SlideHealth = (function () {
  function parseFlowCount(slideEl) {
    try {
      const raw = slideEl.dataset.flow || '';
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch (e) {
      return 0;
    }
  }

  function computeForSlide(slideEl, index) {
    const heading = slideEl.querySelector('h1, h2, h3');
    const text = (slideEl.textContent || '').replace(/\s+/g, ' ').trim();
    const chars = text.length;
    const bullets = slideEl.querySelectorAll('.bullet-item, .bullet-list li').length;
    const codeLines = Array.from(slideEl.querySelectorAll('pre code'))
      .map((node) => (node.textContent || '').split('\n').length)
      .reduce((a, b) => a + b, 0);
    const steps = parseFlowCount(slideEl);
    const hasNotes = Boolean(slideEl.dataset.speakerNotes && slideEl.dataset.speakerNotes.trim().length > 0);

    const issues = [];
    if (chars > 1200) issues.push('very-dense');
    else if (chars > 700) issues.push('dense');
    if (bullets >= 6) issues.push('many-bullets');
    if (codeLines >= 12) issues.push('long-code');
    if (steps === 0 && chars > 260) issues.push('no-flow');
    if (!hasNotes) issues.push('no-notes');

    const score = Math.max(0, Math.min(100, 100 - (issues.length * 14) - Math.max(0, Math.floor((chars - 220) / 40))));

    return {
      index,
      heading: heading ? heading.textContent.trim() : '',
      chars,
      bullets,
      codeLines,
      steps,
      hasNotes,
      issues,
      score,
    };
  }

  function renderBadge(thumbEl, health) {
    if (!thumbEl) return;
    let badge = thumbEl.querySelector('.health-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'health-badge';
      thumbEl.appendChild(badge);
    }
    badge.dataset.score = String(health.score);
    badge.title = `Score: ${health.score} | Issues: ${health.issues.join(', ') || 'none'}`;
    badge.classList.toggle('health-good', health.score >= 75);
    badge.classList.toggle('health-warning', health.score < 75 && health.score >= 45);
    badge.classList.toggle('health-bad', health.score < 45);
  }

  function runAll() {
    const slides = Array.from(document.querySelectorAll('.slide'));
    const thumbs = Array.from(document.querySelectorAll('.slide-thumb'));
    const results = slides.map((slide, idx) => {
      const res = computeForSlide(slide, idx);
      if (thumbs[idx]) renderBadge(thumbs[idx], res);
      return res;
    });
    document.dispatchEvent(new CustomEvent('slideHealth', { detail: results }));
    return results;
  }

  function init() {
    setTimeout(runAll, 80);
    document.addEventListener('slideChanged', () => setTimeout(runAll, 50));
  }

  return { init, runAll, computeForSlide };
})();

window.SlideHealth = window.SlideHealth || SlideHealth;
