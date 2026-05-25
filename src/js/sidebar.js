/**
 * LECTA AI — Sidebar, Settings Panel, Dark/Light Mode
 */

const SidebarModule = (function () {
  if (window.SidebarModule) return window.SidebarModule;

  // ===== STATE =====
  const THEME_KEY = 'lecta-theme';
  const MODE_KEY  = 'lecta-mode';
  const NOTES_KEY = 'lecta-notes';
  
  const LIGHT_THEMES = ['ocean','forest','berry','slate','paper','nordic','sunset'];
  const DARK_THEMES  = ['neon','midnight','evergreen','volcano'];
  
  let timerInterval = null;
  let timerSeconds = 0;
  let timerRunning = false;
  let sidebarOpen = false;
  let studentNames = ['Alex','Maria','James','Sofia','Liam','Emma','Noah','Olivia','Ethan','Ava','Lucas','Mia','Benjamin','Charlotte'];

  // Safe localStorage Wrappers
  function safeGetItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage is blocked or full:', e);
      return null;
    }
  }

  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage is blocked or full:', e);
    }
  }

  // ===== INIT =====
  function init() {
    if (location.search.includes('presenter=true')) return;
    initThemeMode();
    initGearPanel();
    initSidebar();
    initTimer();
    initNotes();
    initTeachingTools();
    initRandomPicker();
    syncOverviewActive();
  }

  // ===== DARK / LIGHT MODE =====
  function initThemeMode() {
    const savedMode  = safeGetItem(MODE_KEY);
    const savedTheme = safeGetItem(THEME_KEY) || 'ocean';
    
    // Auto detect dark mode from system preferences if not saved
    let defaultMode = 'light';
    if (!savedMode) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        defaultMode = 'dark';
      }
    } else {
      defaultMode = savedMode;
    }

    applyMode(defaultMode, savedTheme, false);
  }

  function applyMode(mode, theme, save = true) {
    if (mode === 'dark') {
      const activeDarkTheme = (theme && DARK_THEMES.includes(theme)) ? theme : (safeGetItem(THEME_KEY) || 'neon');
      const dt = DARK_THEMES.includes(activeDarkTheme) ? activeDarkTheme : 'neon';
      
      document.documentElement.setAttribute('data-theme', dt);
      if (save) {
        safeSetItem(MODE_KEY, 'dark');
        safeSetItem(THEME_KEY, dt);
      }
    } else {
      const activeLightTheme = (theme && LIGHT_THEMES.includes(theme)) ? theme : (safeGetItem(THEME_KEY) || 'ocean');
      const lt = LIGHT_THEMES.includes(activeLightTheme) ? activeLightTheme : 'ocean';
      
      document.documentElement.setAttribute('data-theme', lt);
      if (save) {
        safeSetItem(MODE_KEY, 'light');
        safeSetItem(THEME_KEY, lt);
      }
    }
    
    // Sync mode buttons
    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });

    // Show/hide theme dot sections dynamically
    const lightSection = document.querySelector('.light-theme-dots');
    const darkSection  = document.querySelector('.dark-theme-dots');
    if (lightSection) lightSection.style.display = mode === 'light' ? 'block' : 'none';
    if (darkSection)  darkSection.style.display  = mode === 'dark' ? 'block' : 'none';

    // Sync dot active state
    const currentTheme = document.documentElement.getAttribute('data-theme');
    document.querySelectorAll('.theme-dot-item').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === currentTheme);
    });
  }

  function applyThemeSelection(theme) {
    const isDark = DARK_THEMES.includes(theme);
    const mode = isDark ? 'dark' : 'light';
    applyMode(mode, theme, true);
  }

  // ===== GEAR PANEL =====
  function initGearPanel() {
    const gearBtn = document.querySelector('.gear-btn');
    const panel   = document.querySelector('.settings-panel');
    if (!gearBtn || !panel) return;

    gearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.classList.toggle('open');
      gearBtn.classList.toggle('active', open);
    });

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !gearBtn.contains(e.target)) {
        panel.classList.remove('open');
        gearBtn.classList.remove('active');
      }
    });

    // Mode buttons (Light / Dark)
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        const currentTheme = safeGetItem(THEME_KEY);
        // default toggle
        if (mode === 'dark') {
          applyMode('dark', DARK_THEMES.includes(currentTheme) ? currentTheme : 'neon');
        } else {
          applyMode('light', LIGHT_THEMES.includes(currentTheme) ? currentTheme : 'ocean');
        }
      });
    });

    // Theme dots selection
    document.querySelectorAll('.theme-dot-item').forEach(el => {
      el.addEventListener('click', () => {
        applyThemeSelection(el.dataset.theme);
      });
    });

    // Sidebar toggle from settings panel
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
    if (sidebarToggleBtn) {
      sidebarToggleBtn.addEventListener('click', () => {
        toggleSidebar();
        panel.classList.remove('open');
        gearBtn.classList.remove('active');
      });
    }

    // Fullscreen
    const fsBtn = document.querySelector('.fullscreen-btn');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          fsBtn.textContent = '⛶ Exit Fullscreen';
        } else {
          document.exitFullscreen();
          fsBtn.textContent = '⛶ Fullscreen';
        }
      });
    }
  }

  // ===== SIDEBAR =====
  function initSidebar() {
    // Robust delegation-based click handlers for maximum reliability
    document.addEventListener('click', (e) => {
      // 1. Sidebar close button
      if (e.target.closest('.sidebar-close')) {
        toggleSidebar(false);
      }

      // 2. Thumbnail click navigation
      const thumb = e.target.closest('.slide-thumb');
      if (thumb) {
        const idx = parseInt(thumb.dataset.slide, 10);
        const slideEngine = window.SlideEngine;
        if (slideEngine && typeof slideEngine.goTo === 'function') {
          slideEngine.goTo(idx);
        }
      }
    });

    // Tab switching inside sidebar
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = document.querySelector('.sidebar-panel[data-panel="' + tab.dataset.tab + '"]');
        if (target) target.classList.add('active');
      });
    });

    // Sync overview highlight on slide change
    let firstLoad = true;
    document.addEventListener('slideChanged', (e) => {
      syncOverviewActive(e.detail.index);
      if (!firstLoad && e.detail.previousIndex !== undefined && e.detail.previousIndex !== e.detail.index) {
        saveNoteForSlide(e.detail.previousIndex);
      }
      firstLoad = false;
      loadNoteForSlide(e.detail.index);
    });
  }

  function toggleSidebar(forceOpen) {
    const sidebar = document.querySelector('.right-sidebar');
    if (!sidebar) return;
    sidebarOpen = forceOpen !== undefined ? forceOpen : !sidebarOpen;
    sidebar.classList.toggle('open', sidebarOpen);
    document.body.classList.toggle('sidebar-open', sidebarOpen);
    const btn = document.querySelector('.sidebar-toggle-btn');
    if (btn) btn.textContent = sidebarOpen ? '◀ Close Panel' : '▶ Teaching Panel';
  }

  function syncOverviewActive(idx) {
    const slideEngine = window.SlideEngine;
    const current = idx !== undefined ? idx : (slideEngine && typeof slideEngine.getCurrent === 'function' ? slideEngine.getCurrent() : 0);
    document.querySelectorAll('.slide-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === current);
    });
    // Update progress section inside sidebar
    const total = document.querySelectorAll('.slide-thumb').length;
    if (total === 0) return;
    const pct = Math.round(((current + 1) / total) * 100);
    const progFill = document.querySelector('[data-progress="slides"] .prog-fill');
    const progVal  = document.querySelector('[data-progress="slides"] .prog-val');
    if (progFill) progFill.style.width = pct + '%';
    if (progVal)  progVal.textContent = pct + '%';
  }

  // ===== TIMER =====
  function initTimer() {
    const display   = document.querySelector('.timer-clock');
    const status    = document.querySelector('.timer-status');
    const startBtn  = document.querySelector('[data-timer="start"]');
    const pauseBtn  = document.querySelector('[data-timer="pause"]');
    const resetBtn  = document.querySelector('[data-timer="reset"]');
    if (!display) return;

    function updateDisplay() {
      const h = Math.floor(timerSeconds / 3600);
      const m = Math.floor((timerSeconds % 3600) / 60);
      const s = timerSeconds % 60;
      display.textContent = (h > 0 ? String(h).padStart(2,'0') + ':' : '') +
        String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
      if (timerSeconds >= 45 * 60) display.style.color = 'var(--color-error)';
      else if (timerSeconds >= 30 * 60) display.style.color = 'var(--color-warning)';
      else display.style.color = 'var(--color-primary)';
    }

    if (startBtn) startBtn.addEventListener('click', () => {
      if (timerRunning) return;
      timerRunning = true;
      timerInterval = setInterval(() => { timerSeconds++; updateDisplay(); }, 1000);
      if (status) status.textContent = 'Presentation running...';
      startBtn.classList.add('running');
    });

    if (pauseBtn) pauseBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      timerRunning = false;
      if (status) status.textContent = 'Paused';
      if (startBtn) startBtn.classList.remove('running');
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      timerRunning = false;
      timerSeconds = 0;
      updateDisplay();
      if (status) status.textContent = 'Ready to start';
      if (startBtn) startBtn.classList.remove('running');
    });

    updateDisplay();
  }

  // ===== NOTES =====
  let currentSlideForNotes = 0;
  function initNotes() {
    const saveBtn  = document.querySelector('.notes-save-btn');
    const savedMsg = document.querySelector('.notes-saved-msg');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        saveNoteForSlide(currentSlideForNotes);
        if (savedMsg) { savedMsg.style.display = 'block'; setTimeout(() => { savedMsg.style.display = 'none'; }, 2000); }
      });
    }
    loadNoteForSlide(0);
  }

  function getSlideId(idx) {
    const slides = document.querySelectorAll('.slide');
    return slides[idx]?.id || String(idx);
  }

  function saveNoteForSlide(idx) {
    if (idx === undefined || idx === null) return;
    const ta = document.querySelector('.notes-textarea');
    if (!ta) return;
    const slideId = getSlideId(idx);
    
    try {
      const notes = JSON.parse(safeGetItem(NOTES_KEY) || '{}');
      notes[slideId] = ta.value;
      safeSetItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed to save slide notes:', e);
    }
  }

  function loadNoteForSlide(idx) {
    currentSlideForNotes = idx;
    const ta = document.querySelector('.notes-textarea');
    if (!ta) return;
    const slideId = getSlideId(idx);
    
    try {
      const notes = JSON.parse(safeGetItem(NOTES_KEY) || '{}');
      ta.value = notes[slideId] || '';
    } catch (e) {
      console.warn('Failed to load slide notes:', e);
      ta.value = '';
    }
  }

  // ===== TEACHING TOOLS =====
  function initTeachingTools() {
    // Spotlight mode
    const spotlightBtn = document.querySelector('[data-tool="spotlight"]');
    const spotlightOverlay = document.querySelector('.spotlight-overlay');
    if (spotlightBtn && spotlightOverlay) {
      spotlightBtn.addEventListener('click', () => {
        const title = document.querySelector('.slide.active h1, .slide.active h2');
        const content = document.querySelector('.spotlight-content p');
        if (content && title) content.textContent = title.textContent;
        spotlightOverlay.classList.add('active');
        spotlightBtn.classList.add('active');
      });
      spotlightOverlay.addEventListener('click', () => {
        spotlightOverlay.classList.remove('active');
        if (spotlightBtn) spotlightBtn.classList.remove('active');
      });
    }

    // Pointer mode (cursor highlight)
    const pointerBtn = document.querySelector('[data-tool="pointer"]');
    if (pointerBtn) {
      pointerBtn.addEventListener('click', () => {
        document.body.classList.toggle('laser-pointer');
        pointerBtn.classList.toggle('active');
      });
    }

    // Freeze mode (blank screen)
    const freezeBtn = document.querySelector('[data-tool="freeze"]');
    const freezeOverlay = document.createElement('div');
    freezeOverlay.className = 'freeze-overlay';
    freezeOverlay.style.cssText = 'position:fixed;inset:0;background:var(--color-bg);z-index:2500;display:none;cursor:pointer;align-items:center;justify-content:center;flex-direction:column;gap:1rem;font-size:1.5rem;color:var(--color-text-muted)';
    freezeOverlay.innerHTML = '<span style="font-size:3rem">🔒</span><p style="font-size:1rem">Screen frozen — click to resume</p>';
    document.body.appendChild(freezeOverlay);
    if (freezeBtn) {
      freezeBtn.addEventListener('click', () => {
        freezeOverlay.style.display = 'flex';
        freezeBtn.classList.add('active');
      });
    }
    freezeOverlay.addEventListener('click', () => {
      freezeOverlay.style.display = 'none';
      if (freezeBtn) freezeBtn.classList.remove('active');
    });

    // Q&A submit
    const qaSubmit = document.querySelector('.qa-submit');
    if (qaSubmit) {
      qaSubmit.addEventListener('click', () => {
        const inp = document.querySelector('.qa-input');
        if (inp && inp.value.trim()) {
          alert('Q&A question submitted: "' + inp.value + '"');
          inp.value = '';
        }
      });
    }
  }

  // ===== RANDOM PICKER =====
  function initRandomPicker() {
    const btn  = document.querySelector('.random-btn');
    const disp = document.querySelector('.random-name');
    if (!btn || !disp) return;

    // Load custom student list if available
    try {
      const customStudentsAttr = document.body.dataset.students;
      if (customStudentsAttr) {
        const parsed = JSON.parse(customStudentsAttr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          studentNames = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse custom student list:', e);
    }

    btn.addEventListener('click', () => {
      let count = 0;
      // High-speed smooth snappy spinning
      const spin = setInterval(() => {
        disp.textContent = studentNames[Math.floor(Math.random() * studentNames.length)];
        count++;
        if (count >= 10) { clearInterval(spin); }
      }, 35);
    });
  }

  return { init, toggleSidebar };
})();

window.SidebarModule = window.SidebarModule || SidebarModule;
