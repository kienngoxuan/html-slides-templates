/**
 * LECTA AI — Heavy Rendering Lazy Loaders
 * Dynamic on-demand loading for KaTeX, Mermaid.js, and Prism.js
 */

const LazyLoaders = (function () {

  function init() {
    initKaTeXMaths();
    initMermaidDiagrams();
    initSyntaxHighlighting();
  }

  /* === 🧮 KaTeX On-Demand Loader === */
  function initKaTeXMaths() {
    const containers = document.querySelectorAll('.math-display-equation');
    if (containers.length === 0) return;

    function renderWithAutoRender() {
      containers.forEach(el => {
        if (el.dataset.katexRendered === 'true') return;
        const latex = el.dataset.latex || '';
        el.textContent = `\\[${latex}\\]`;
        try {
          window.renderMathInElement(el, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '\\[', right: '\\]', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
            ],
            throwOnError: false,
          });
          el.dataset.katexRendered = 'true';
        } catch (e) {
          console.error('KaTeX auto-render error:', e);
        }
      });
    }

    function renderWithCore() {
      containers.forEach(el => {
        if (el.dataset.katexRendered === 'true') return;
        const latex = el.dataset.latex || '';
        try {
          window.katex.render(latex, el, { displayMode: true, throwOnError: false });
          el.dataset.katexRendered = 'true';
        } catch (e) {
          console.error('KaTeX error:', e);
        }
      });
    }

    function ensureKaTeXStyles() {
      if (document.querySelector('link[data-katex-css="true"]')) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
      link.dataset.katexCss = 'true';
      document.head.appendChild(link);
    }

    function loadAutoRender() {
      if (window.renderMathInElement) {
        renderWithAutoRender();
        return;
      }

      if (document.querySelector('script[data-katex-auto-render="true"]')) return;
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js';
      script.dataset.katexAutoRender = 'true';
      script.onload = () => {
        if (window.renderMathInElement) renderWithAutoRender();
        else if (window.katex) renderWithCore();
      };
      document.body.appendChild(script);
    }

    ensureKaTeXStyles();

    if (!window.katex) {
      if (document.querySelector('script[data-katex-core="true"]')) return;
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
      script.dataset.katexCore = 'true';
      script.onload = () => loadAutoRender();
      document.body.appendChild(script);
      return;
    }

    if (!window.renderMathInElement) {
      loadAutoRender();
      return;
    }

    renderWithAutoRender();
  }

  /* === 🌿 Mermaid On-Demand Loader === */
  function initMermaidDiagrams() {
    const containers = document.querySelectorAll('.mermaid');
    if (containers.length === 0) return;

    if (!window.mermaid) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.2.4/dist/mermaid.min.js';
      script.onload = () => {
        window.mermaid.initialize({ startOnLoad: true, theme: 'neutral' });
      };
      document.body.appendChild(script);
    }
  }

  /* === 💻 Prism Syntax Highlighting On-Demand Loader === */
  function initSyntaxHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    if (codeBlocks.length === 0) return;

    if (!window.Prism) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
      script.onload = () => {
        window.Prism.highlightAll();
      };
      document.body.appendChild(script);
    }
  }

  return { init };
})();

window.LazyLoaders = window.LazyLoaders || LazyLoaders;
