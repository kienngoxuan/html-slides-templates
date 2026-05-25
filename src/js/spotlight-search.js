/**
 * LECTA AI — Spotlight Command Search Palette
 * Ctrl+K Search Overlay Logic
 */

const SpotlightSearch = (function () {

  function init() {
    initSearchPalette();
  }

  /* === 🔍 Glassmorphic Spotlight Search Command Palette === */
  function initSearchPalette() {
    const backdrop = document.querySelector('.search-palette-backdrop');
    const input = document.querySelector('.search-input');
    const list = document.querySelector('.search-results-list');
    if (!backdrop || !input || !list) return;

    let selectedIndex = -1;
    let currentResults = [];

    document.addEventListener('toggleSearchPalette', () => {
      const isVisible = backdrop.style.display === 'flex';
      if (isVisible) {
        backdrop.style.display = 'none';
      } else {
        backdrop.style.display = 'flex';
        input.value = '';
        input.focus();
        renderResults('');
      }
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.style.display = 'none';
      }
    });

    input.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    function renderResults(query) {
      list.innerHTML = '';
      selectedIndex = -1;
      currentResults = [];

      const queryLower = query.toLowerCase().trim();
      const slides = Array.from(document.querySelectorAll('.slide'));

      slides.forEach((s, idx) => {
        const headingEl = s.querySelector('h2, h1');
        const heading = headingEl ? headingEl.textContent.trim() : `Slide ${idx + 1}`;
        const bodyContent = s.textContent.toLowerCase();

        if (!queryLower || heading.toLowerCase().includes(queryLower) || bodyContent.includes(queryLower)) {
          currentResults.push({ index: idx, heading, id: s.id || `slide-${idx + 1}` });
        }
      });

      if (currentResults.length === 0) {
        list.innerHTML = `<div style="padding:1rem; text-align:center; color:var(--color-text-muted);">No results found. Try another query!</div>`;
        return;
      }

      currentResults.forEach((res, i) => {
        const item = document.createElement('button');
        item.className = 'search-result-item';
        item.innerHTML = `
          <span class="search-result-num">${res.index + 1}</span>
          <div class="search-result-info">
            <span class="search-result-title">${res.heading}</span>
            <span class="search-result-snippet">Jump to #${res.id}</span>
          </div>
        `;
        item.addEventListener('click', () => {
          if (window.SlideEngine) window.SlideEngine.goTo(res.index);
          backdrop.style.display = 'none';
        });
        list.appendChild(item);
      });
    }

    input.addEventListener('keydown', (e) => {
      const items = list.querySelectorAll('.search-result-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelectedResult(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelectedResult(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          items[selectedIndex].click();
        } else if (items.length > 0) {
          items[0].click();
        }
      } else if (e.key === 'Escape') {
        backdrop.style.display = 'none';
      }
    });

    function updateSelectedResult(items) {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('selected');
        }
      });
    }
  }

  return { init };
})();

window.SpotlightSearch = window.SpotlightSearch || SpotlightSearch;
