/**
 * LECTA AI — Atomic Primitives
 * Smallest reusable HTML fragments. Used by renderer.js and composite builders.
 * Works in both Node.js (build) and browser (CSR).
 */

(function (exports) {

  /* ─── Text Escaping ─── */
  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ─── Slide Shell ─── */
  function slideShell(slide, innerHTML, opts = {}) {
    const d = slide.data || {};
    const notes = (d.speakerNotes || '').replace(/"/g, '&quot;');
    const flowAttr = slide.flow ? ` data-flow="${esc(JSON.stringify(slide.flow))}"` : '';
    const tp = slide.transitionPreset || '';
    const transitionAttr = tp ? ` data-transition-preset="${esc(tp)}"` : '';
    const transitionClass = (opts.applyTransitionClass && tp) ? ` slide-transition-${tp}` : '';
    const innerClass = opts.innerClass ? ` ${opts.innerClass}` : '';

    return `<section class="slide" id="${slide.id}" data-speaker-notes="${notes}"${flowAttr}${transitionAttr}>
  <div class="slide-inner${transitionClass}${innerClass}">
    ${innerHTML}
  </div>
</section>`;
  }

  /* ─── Block Heading (icon + h2) — used in ~20 blocks ─── */
  function blockHeading(icon, heading) {
    return `<div class="block-heading"><span class="icon">${icon || ''}</span><h2>${esc(heading)}</h2></div>`;
  }

  /* ─── Badge Pill ─── */
  function badge(text) {
    return `<span class="badge">${esc(text || '')}</span>`;
  }

  /* ─── Badge Pill (colored variant) ─── */
  function badgePill(text, type) {
    return `<span class="badge-pill pill-${type || 'primary'}">${esc(text)}</span>`;
  }

  /* ─── Section Title (for splash) ─── */
  function sectionTitle(text, tag = 'h1') {
    return `<${tag}>${esc(text)}</${tag}>`;
  }

  /* ─── Subtitle ─── */
  function subtitle(text) {
    return `<p class="subtitle">${esc(text)}</p>`;
  }

  /* ─── Caption ─── */
  function caption(text, className) {
    return text ? `<p class="${className || 'image-caption'}">${esc(text)}</p>` : '';
  }

  /* ─── Avatar ─── */
  function avatar(url, name, className = 'quote-avatar', placeholderClass = 'quote-avatar-placeholder') {
    if (url) {
      return `<img class="${className}" src="${esc(url)}" alt="${esc(name || '')}" />`;
    }
    return `<div class="${placeholderClass}">${esc((name || 'A').charAt(0).toUpperCase())}</div>`;
  }

  /* ─── Metric / Stat Value with counter ─── */
  function statValue(rawValue) {
    const str = String(rawValue);
    const numMatch = str.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/);
    if (numMatch) {
      const prefix = esc(numMatch[1]);
      const numericStr = numMatch[2];
      const suffix = esc(numMatch[3]);
      const isDecimal = numericStr.includes('.');
      const decimalPlaces = isDecimal ? (numericStr.split('.')[1] || '').length : 0;
      const cleanNum = numericStr.replace(/,/g, '');
      return `${prefix}<span class="stat-counter" data-count-target="${esc(cleanNum)}" data-count-decimals="${decimalPlaces}" data-count-original="${esc(numericStr)}">${esc(numericStr)}</span>${suffix}`;
    }
    return esc(str);
  }

  /* ─── Trend Indicator ─── */
  function trendIndicator(trend, subtext) {
    if (trend) {
      const dir = trend === 'up' ? 'up' : 'down';
      const arrow = trend === 'up' ? '↑' : '↓';
      return `<div class="stat-trend trend-${dir}">${arrow} ${esc(subtext || '')}</div>`;
    }
    if (subtext) return `<div class="stat-subtext">${esc(subtext)}</div>`;
    return '';
  }

  /* ─── Callout / Tip Box ─── */
  function callout(text, className = 'step-tip') {
    return text ? `<div class="${className}">${esc(text)}</div>` : '';
  }

  /* ─── Option Letter (A, B, C...) ─── */
  function optionLetter(index) {
    return `<span class="option-letter">${String.fromCharCode(65 + index)}</span>`;
  }

  /* ─── Code Block ─── */
  function codeBlock(code, language = 'javascript') {
    return `<pre><code class="language-${esc(language)}">${esc(code)}</code></pre>`;
  }

  /* ─── Resource Link ─── */
  function resourceLink(label, url) {
    return `<a href="${esc(url)}" class="resource-link" target="_blank">🔗 ${esc(label)}</a>`;
  }

  /* ─── Social Chip ─── */
  function socialChip(platform, handle) {
    const urls = {
      github: `https://github.com/${esc(handle)}`,
      twitter: `https://twitter.com/${esc(handle)}`,
      email: `mailto:${esc(handle)}`,
    };
    return `<a href="${urls[platform] || '#'}" class="splash-social-chip" target="_blank">${platform.charAt(0).toUpperCase() + platform.slice(1)}</a>`;
  }

  /* ─── Flow ID attribute ─── */
  function flowId(prefix, index) {
    return ` data-flow-id="${prefix}-${index + 1}"`;
  }

  /* ─── Chevron SVG (accordion) ─── */
  function chevronSvg() {
    return `<svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;
  }

  /* ─── Code Diff Header ─── */
  function codeDiffHeader(title, lang, type) {
    return `<div class="code-diff-header code-diff-${type}">
          <span class="code-diff-dot"></span>
          ${esc(title)}
          <span class="code-diff-lang">${esc(lang)}</span>
        </div>`;
  }

  // Export for both Node and browser
  exports.esc = esc;
  exports.slideShell = slideShell;
  exports.blockHeading = blockHeading;
  exports.badge = badge;
  exports.badgePill = badgePill;
  exports.sectionTitle = sectionTitle;
  exports.subtitle = subtitle;
  exports.caption = caption;
  exports.avatar = avatar;
  exports.statValue = statValue;
  exports.trendIndicator = trendIndicator;
  exports.callout = callout;
  exports.optionLetter = optionLetter;
  exports.codeBlock = codeBlock;
  exports.resourceLink = resourceLink;
  exports.socialChip = socialChip;
  exports.flowId = flowId;
  exports.chevronSvg = chevronSvg;
  exports.codeDiffHeader = codeDiffHeader;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.LectaAtoms = {}));
