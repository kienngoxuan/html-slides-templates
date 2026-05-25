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

    if (!window.renderMathInElement) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
      script.onload = () => {
        containers.forEach(el => {
          const latex = el.dataset.latex || '';
          try {
            window.katex.render(latex, el, { displayMode: true, throwOnError: false });
          } catch (e) {
            console.error('KaTeX error:', e);
          }
        });
      };
      document.body.appendChild(script);
    }
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
