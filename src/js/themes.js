/**
 * LECTA AI — Theme Switcher (stub, owned by SidebarModule)
 */
const ThemeSwitcher = (function () {
  function init() { /* handled by SidebarModule */ }
  return { init };
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

