/**
 * LECTA AI — Slide Engine
 * Core navigation: keyboard, touch swipe, buttons, progress
 */

const SlideEngine = (function () {
  if (window.SlideEngine) return window.SlideEngine;
  
  let currentSlide = 0;
  let totalSlides = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let slides = []; // Caching slide elements to optimize performance

  function init() {
    slides = Array.from(document.querySelectorAll('.slide'));
    totalSlides = slides.length;
    if (totalSlides === 0) return;

    updateSlide(0, false);
    bindKeyboard();
    bindTouch();
    bindButtons();
  }

  function updateSlide(index, animate = true) {
    if (index < 0 || index >= totalSlides) return;
    const previousSlide = currentSlide;
    currentSlide = index;

    // Move track
    const track = document.querySelector('.slides-track');
    if (track) {
      track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Update progress bar
    const progress = document.querySelector('.nav-progress');
    if (progress) {
      progress.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
    }

    // Update counter
    const counter = document.querySelector('.nav-counter');
    if (counter) {
      counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }

    // Update button states
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;

    // Add enter animation to current slide
    slides.forEach((s, i) => {
      const inner = s.querySelector('.slide-inner');
      if (inner) {
        if (i === currentSlide && animate) {
          inner.classList.add('slide-enter');
          setTimeout(() => inner.classList.remove('slide-enter'), 600);
        }
      }
    });

    // Update speaker notes
    updateSpeakerNotes();

    // Dispatch custom event with both current and previous slide indexes
    document.dispatchEvent(new CustomEvent('slideChanged', { 
      detail: { 
        index: currentSlide,
        previousIndex: previousSlide
      } 
    }));
  }

  function next() { updateSlide(currentSlide + 1); }
  function prev() { updateSlide(currentSlide - 1); }
  function goTo(index) { updateSlide(index); }

  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prev();
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          break;
        case 'End':
          e.preventDefault();
          goTo(totalSlides - 1);
          break;
      }
    });
  }

  function bindTouch() {
    const viewport = document.querySelector('.slides-viewport');
    if (!viewport) return;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    }, { passive: true });
  }

  function bindButtons() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-btn.prev')) prev();
      if (e.target.closest('.nav-btn.next')) next();
    });
  }

  function updateSpeakerNotes() {
    const panel = document.querySelector('.speaker-notes-panel');
    if (!panel) return;
    const currentEl = slides[currentSlide];
    const notes = currentEl ? currentEl.dataset.speakerNotes : '';
    const notesP = panel.querySelector('p');
    if (notesP) notesP.textContent = notes || 'No speaker notes for this slide.';
  }

  function getCurrent() { return currentSlide; }
  function getTotal() { return totalSlides; }

  return { init, next, prev, goTo, getCurrent, getTotal };
})();

window.SlideEngine = window.SlideEngine || SlideEngine;
