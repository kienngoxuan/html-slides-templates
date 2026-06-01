/**
 * LECTA AI — Slide Engine
 * Core navigation: keyboard, touch swipe, buttons, progress, BroadcastChannel sync, Presenter view dashboard
 */

const SlideEngine = (function () {
  if (window.SlideEngine) return window.SlideEngine;
  
  let currentSlide = 0;
  let totalSlides = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  let slides = []; // Caching slide elements to optimize performance
  let cachedPresenterNotes = [];

  // Broadcast channel for multi-monitor, zero-server offline peer-to-peer sync
  const broadcast = window.BroadcastChannel ? new BroadcastChannel('lecta-presentation') : null;

  function init() {
    // If embedded iframe, strip down UI controls to display slide tracks only
    if (location.search.includes('embed=true')) {
      const style = document.createElement('style');
      style.textContent = `
        .nav-bar, .gear-btn, .settings-panel, .presenter-toggle, .speaker-notes-panel, .right-sidebar {
          display: none !important;
        }
        .slides-viewport {
          height: 100vh !important;
          width: 100vw !important;
          max-width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
        body {
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(style);
    }

    slides = Array.from(document.querySelectorAll('.slide'));
    totalSlides = slides.length;
    if (totalSlides === 0) return;

    // Check if Presenter View URL parameter is active
    if (location.search.includes('presenter=true')) {
      cacheNotes();
      initPresenterDashboard();
      initBroadcastReceiver({ onNav: syncPresenterDash });
      return;
    }

    updateSlide(0, false);
    bindKeyboard();
    bindTouch();
    bindButtons();
    initBroadcastReceiver();
  }

  function cacheNotes() {
    // Try to load localStorage overrides written by the sidebar notes panel.
    // Key matches the NOTES_KEY constant used in sidebar.js ('lecta-notes').
    let savedNotes = {};
    try {
      savedNotes = JSON.parse(localStorage.getItem('lecta-notes') || '{}');
    } catch (e) { /* ignore */ }

    slides.forEach((s, idx) => {
      const slideId = s.id || `slide-${idx}`;
      // localStorage override takes priority; fall back to built-in dataset notes.
      const notes = savedNotes[slideId] !== undefined
        ? savedNotes[slideId]
        : (s.dataset.speakerNotes || 'No speaker notes for this slide.');
      cachedPresenterNotes.push({ id: slideId, notes });
    });
  }

  function initPresenterDashboard() {
    document.body.innerHTML = `
      <div class="presenter-view-layout">
        <!-- Left Column: Stopwatch notes, progress pacing -->
        <div class="presenter-left-col">
          <div class="presenter-header-card">
            <div>
              <h2 style="margin:0; font-size:1.3rem; font-family:var(--font-heading);">Lecta Presenter Console</h2>
              <div class="presenter-rehearse-timer-progress">
                <div class="presenter-rehearse-timer-bar"></div>
              </div>
            </div>
            <div class="presenter-timer-box">
              <span class="presenter-time-elapsed">00:00:00</span>
              <button class="presenter-btn" id="presenter-timer-toggle" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Pause</button>
            </div>
          </div>
          
          <div class="presenter-notes-box">
            <h3>📝 Speaker Notes</h3>
            <div class="presenter-notes-content">No speaker notes.</div>
          </div>
          
          <div class="presenter-controls-row">
            <button class="presenter-btn" id="pres-btn-prev">← Previous</button>
            <button class="presenter-btn primary" id="pres-btn-next">Next →</button>
          </div>
        </div>
        
        <!-- Right Column: Visual Preview windows -->
        <div class="presenter-right-col">
          <div class="presenter-slide-previews">
            <div style="display:flex; flex-direction:column; gap:4px; flex: 1;">
              <div style="font-size:0.75rem; font-weight:700; color:#64748b; text-transform:uppercase; margin-left:4px;">Current Slide</div>
              <div class="presenter-preview-frame active">
                <iframe id="pres-iframe-curr" src="${location.href.split('?')[0]}?embed=true#slide-0"></iframe>
              </div>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:4px; flex: 1;">
              <div style="font-size:0.75rem; font-weight:700; color:#64748b; text-transform:uppercase; margin-left:4px;">Next Slide</div>
              <div class="presenter-preview-frame">
                <iframe id="pres-iframe-next" src="${location.href.split('?')[0]}?embed=true#slide-1"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Controls
    document.getElementById('pres-btn-prev').addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        broadcastSlide(currentSlide);
        syncPresenterDash(currentSlide);
      }
    });
    document.getElementById('pres-btn-next').addEventListener('click', () => {
      if (currentSlide + 1 < cachedPresenterNotes.length) {
        currentSlide++;
        broadcastSlide(currentSlide);
        syncPresenterDash(currentSlide);
      }
    });

    // Start Timer
    let seconds = 0;
    function startPresenterTimer() {
      return setInterval(() => {
        seconds++;
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        const timerEl = document.querySelector('.presenter-time-elapsed');
        if (timerEl) timerEl.textContent = `${hrs}:${mins}:${secs}`;
      }, 1000);
    }

    let timerInterval = startPresenterTimer();

    let isTimerActive = true;
    document.getElementById('presenter-timer-toggle').addEventListener('click', (e) => {
      if (isTimerActive) {
        clearInterval(timerInterval);
        e.target.textContent = 'Resume';
      } else {
        timerInterval = startPresenterTimer();
        e.target.textContent = 'Pause';
      }
      isTimerActive = !isTimerActive;
    });

    // Initial sync
    syncPresenterDash(currentSlide);
  }

  function broadcastSlide(index) {
    if (broadcast) {
      broadcast.postMessage({ type: 'nav', index });
    }
  }

  function syncPresenterDash(index) {
    currentSlide = index;
    // Update notes
    const notesBox = document.querySelector('.presenter-notes-content');
    if (notesBox) {
      notesBox.textContent = (cachedPresenterNotes[index] && cachedPresenterNotes[index].notes) || 'No speaker notes for this slide.';
    }

    // Update iframes hashes
    const iframeCurr = document.getElementById('pres-iframe-curr');
    const iframeNext = document.getElementById('pres-iframe-next');
    
    const baseUrl = location.href.split('?')[0];
    if (iframeCurr) iframeCurr.src = `${baseUrl}?embed=true#${cachedPresenterNotes[index] ? cachedPresenterNotes[index].id : ''}`;
    if (iframeNext) {
      if (index + 1 < cachedPresenterNotes.length) {
        iframeNext.src = `${baseUrl}?embed=true#${cachedPresenterNotes[index + 1].id}`;
        iframeNext.parentElement.style.opacity = '1';
      } else {
        iframeNext.parentElement.style.opacity = '0.3';
      }
    }

    // Update buttons
    const prevBtn = document.getElementById('pres-btn-prev');
    const nextBtn = document.getElementById('pres-btn-next');
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === cachedPresenterNotes.length - 1;
  }

  function initBroadcastReceiver(options = {}) {
    if (broadcast) {
      const onNav = options.onNav;
      broadcast.onmessage = (e) => {
        if (e.data) {
          if (e.data.type === 'nav') {
            if (typeof onNav === 'function') {
              onNav(e.data.index);
            } else {
              updateSlide(e.data.index, false); // Update locally without animation, do not rebroadcast
            }
          }
        }
      };
    }
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
          // Apply transition preset class if the slide has one
          const preset = s.dataset.transitionPreset;
          if (preset) {
            inner.classList.add(`slide-transition-${preset}`);
          }
          inner.classList.add('slide-enter');
          setTimeout(() => {
            inner.classList.remove('slide-enter');
            if (preset) {
              inner.classList.remove(`slide-transition-${preset}`);
            }
          }, 700);
        }
      }
    });

    // Update speaker notes
    updateSpeakerNotes();

    // Broadcast current slide index changes to peers in real-time
    if (broadcast && animate !== false) {
      broadcast.postMessage({ type: 'nav', index: currentSlide });
    }

    // Dispatch custom event with both current and previous slide indexes
    document.dispatchEvent(new CustomEvent('slideChanged', { 
      detail: { 
        index: currentSlide,
        previousIndex: previousSlide
      } 
    }));

    // Trigger counter animation for stat blocks on the active slide
    if (animate) {
      const activeSlide = slides[currentSlide];
      if (activeSlide) {
        animateStatCounters(activeSlide);
      }
      const prevSlide = slides[previousSlide];
      if (prevSlide) {
        resetStatCounters(prevSlide);
      }
    }
  }

  function resetStatCounters(slideEl) {
    const counters = slideEl.querySelectorAll('.stat-counter[data-count-target]');
    counters.forEach(counter => {
      delete counter.dataset.countAnimated;
      const original = counter.dataset.countOriginal || '0';
      counter.textContent = original;
    });
  }

  function next() {
    if (window.LessonStudio && typeof window.LessonStudio.nextStep === 'function' && window.LessonStudio.nextStep()) {
      return;
    }
    updateSlide(currentSlide + 1);
  }
  function prev() {
    if (window.LessonStudio && typeof window.LessonStudio.prevStep === 'function' && window.LessonStudio.prevStep()) {
      return;
    }
    updateSlide(currentSlide - 1);
  }
  function goTo(index) { updateSlide(index); }

  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Prevent browser default Ctrl+K search dialog
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('toggleSearchPalette'));
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'arrowright':
        case 'arrowdown':
        case ' ':
          e.preventDefault();
          next();
          break;
        case 'arrowleft':
        case 'arrowup':
          e.preventDefault();
          prev();
          break;
        case 'home':
          e.preventDefault();
          goTo(0);
          break;
        case 'end':
          e.preventDefault();
          goTo(totalSlides - 1);
          break;
        case 'd':
          document.dispatchEvent(new CustomEvent('toggleDrawingCanvas'));
          break;
        case 'p':
          // Open Presenter view on second screen
          window.open(location.href.split('?')[0] + '?presenter=true', 'LectaPresenter', 'width=1100,height=750');
          break;
      }
    });
  }

  function bindTouch() {
    const viewport = document.querySelector('.slides-viewport');
    if (!viewport) return;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) next();
        else prev();
      }
    }, { passive: true });
  }

  function isInteractiveElement(el) {
    return el.closest('button, a, input, select, textarea, .quiz-option, .adv-option, .accordion-header, .tab-btn, .step-dot, .flip-card, .drawing-toolbar, .settings-panel, .right-sidebar, .nav-bar, .spotlight-search, .drawing-canvas-overlay, .flow-node-group, .legend-item, .sortable-th, .glass-table td, .table-search-input');
  }

  function bindButtons() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-btn.prev')) {
        prev();
        return;
      }
      if (e.target.closest('.nav-btn.next')) {
        next();
        return;
      }
    });
  }

  function updateSpeakerNotes() {
    const panel = document.querySelector('.speaker-notes-panel');
    if (!panel) return;
    const currentEl = slides[currentSlide];
    const slideId = currentEl ? (currentEl.id || String(currentSlide)) : String(currentSlide);

    // Prefer any custom note saved by the sidebar panel over the built-in default.
    let notes = '';
    try {
      const saved = JSON.parse(localStorage.getItem('lecta-notes') || '{}');
      notes = saved[slideId] !== undefined
        ? saved[slideId]
        : (currentEl ? currentEl.dataset.speakerNotes || '' : '');
    } catch (e) {
      notes = currentEl ? currentEl.dataset.speakerNotes || '' : '';
    }

    const notesP = panel.querySelector('p');
    if (notesP) notesP.textContent = notes || 'No speaker notes for this slide.';
  }

  function getCurrent() { return currentSlide; }
  function getTotal() { return totalSlides; }
  function getBroadcast() { return broadcast; }

  /* === Counter Animation for Stat Blocks === */
  function animateStatCounters(slideEl) {
    const counters = slideEl.querySelectorAll('.stat-counter[data-count-target]');
    if (counters.length === 0) return;

    counters.forEach(counter => {
      // Skip if already animated
      if (counter.dataset.countAnimated === 'true') return;
      counter.dataset.countAnimated = 'true';

      const target = parseFloat(counter.dataset.countTarget) || 0;
      const decimals = parseInt(counter.dataset.countDecimals, 10) || 0;
      const original = counter.dataset.countOriginal || String(target);
      const hasCommas = original.includes(',');
      const duration = 1200; // ms
      let startTime = null;

      // easeOutQuart for a satisfying deceleration
      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function formatNumber(num) {
        let formatted = num.toFixed(decimals);
        if (hasCommas) {
          const parts = formatted.split('.');
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          formatted = parts.join('.');
        }
        return formatted;
      }

      counter.classList.add('counting');
      counter.textContent = formatNumber(0);

      function tick(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = easedProgress * target;

        counter.textContent = formatNumber(currentValue);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = formatNumber(target);
          counter.classList.remove('counting');
        }
      }

      // Slight delay to let the slide enter animation start first
      setTimeout(() => requestAnimationFrame(tick), 200);
    });
  }

  return { init, next, prev, goTo, getCurrent, getTotal, getBroadcast };
})();

window.SlideEngine = window.SlideEngine || SlideEngine;
