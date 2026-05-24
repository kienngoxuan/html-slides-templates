/**
 * LECTA AI — Viewport Emulator Controller
 * Preserves event listeners via parent swapping DOM mechanics.
 * Persists view selection inside localStorage for F5 caching.
 */

const ViewportEmulator = (function () {
  let activeMode = 'desktop';

  function init() {
    // Read persistent cache setting
    const cachedMode = localStorage.getItem('lecta-viewport-mode') || 'desktop';
    
    // Bind UI actions in the settings panel
    bindEvents();
    
    // Initialize standard viewport state
    if (cachedMode === 'mobile') {
      setTimeout(() => setViewportMode('mobile'), 100);
    }
  }

  function setViewportMode(mode) {
    if (mode === activeMode) return;
    activeMode = mode;
    localStorage.setItem('lecta-viewport-mode', mode);

    const body = document.body;
    const viewport = document.querySelector('.slides-viewport') || document.querySelector('.catalog-viewport');
    const navBar = document.querySelector('.nav-bar');
    const presenterToggle = document.querySelector('.presenter-toggle');

    if (!viewport) return;

    if (mode === 'mobile') {
      // 1. Create phone chassis DOM elements if they don't exist
      let wrapper = document.querySelector('.emulator-overlay-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'emulator-overlay-wrapper';
        
        const phone = document.createElement('div');
        phone.className = 'simulated-phone';
        
        const screen = document.createElement('div');
        screen.className = 'simulated-phone-screen';
        
        const indicator = document.createElement('div');
        indicator.className = 'simulated-phone-home-indicator';
        
        phone.appendChild(screen);
        phone.appendChild(indicator);
        wrapper.appendChild(phone);
        body.appendChild(wrapper);
      }

      const screen = wrapper.querySelector('.simulated-phone-screen');
      
      // 2. Perform DOM Parent Swapping
      // Moves original nodes preserving all event listeners and state
      screen.appendChild(viewport);
      if (navBar) screen.appendChild(navBar);
      if (presenterToggle) screen.appendChild(presenterToggle);

      // 3. Add classes to trigger styles
      body.classList.add('viewport-mode-mobile');
      viewport.classList.add('viewport-mobile');
      if (navBar) navBar.classList.add('viewport-mobile');
      if (presenterToggle) presenterToggle.classList.add('viewport-mobile');

    } else {
      // 1. Swap DOM nodes back to the root body
      // We insert them before the sidebar to maintain original outline
      const sidebar = document.querySelector('.right-sidebar');
      if (sidebar) {
        body.insertBefore(viewport, sidebar);
        if (navBar) body.insertBefore(navBar, sidebar);
        if (presenterToggle) body.insertBefore(presenterToggle, sidebar);
      } else {
        body.appendChild(viewport);
        if (navBar) body.appendChild(navBar);
        if (presenterToggle) body.appendChild(presenterToggle);
      }

      // 2. Remove classes to restore standard rules
      body.classList.remove('viewport-mode-mobile');
      viewport.classList.remove('viewport-mobile');
      if (navBar) navBar.classList.remove('viewport-mobile');
      if (presenterToggle) presenterToggle.classList.remove('viewport-mobile');
    }

    // 4. Update the settings UI button states
    updateToggleUI(mode);

    // 5. Dispatch resize/redraw event to force active SVGs to render responsive grids
    setTimeout(() => {
      // Dispatch standard resize event
      window.dispatchEvent(new Event('resize'));
      
      // Dispatch Lecta internal slideChanged event to redraw SVGs instantly
      if (typeof SlideEngine !== 'undefined') {
        document.dispatchEvent(new CustomEvent('slideChanged', { 
          detail: { index: SlideEngine.getCurrent() } 
        }));
      }
    }, 150);
  }

  function bindEvents() {
    // Listen for setting clicks
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.viewport-btn');
      if (!btn) return;
      const targetMode = btn.dataset.viewport;
      if (targetMode) {
        setViewportMode(targetMode);
      }
    });
  }

  function updateToggleUI(mode) {
    const btns = document.querySelectorAll('.viewport-btn');
    btns.forEach(btn => {
      if (btn.dataset.viewport === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  return { init, setViewportMode, getMode: () => activeMode };
})();

// Auto bootstrap on DOM content ready
document.addEventListener('DOMContentLoaded', () => {
  ViewportEmulator.init();
});
