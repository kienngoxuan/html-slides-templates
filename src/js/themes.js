/**
 * LECTA AI — Theme Switcher
 */

const ThemeSwitcher = (function () {
  const STORAGE_KEY = 'lecta-theme';
  const DEFAULT_THEME = 'ocean';

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    applyTheme(saved);
    bindDots();
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update active dot
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.classList.toggle('active', dot.dataset.theme === theme);
    });
  }

  function bindDots() {
    document.querySelectorAll('.theme-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        applyTheme(dot.dataset.theme);
      });
    });
  }

  return { init, applyTheme };
})();

/**
 * LECTA AI — Speaker Notes Toggle
 */
const SpeakerNotes = (function () {
  function init() {
    const toggleBtn = document.querySelector('.toggle-notes');
    const panel = document.querySelector('.speaker-notes-panel');
    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('visible');
      toggleBtn.textContent = panel.classList.contains('visible') ? '📝 Hide Notes' : '📝 Notes';
    });
  }

  return { init };
})();
