const fs = require('fs');
const path = require('path');

function readFile(root, rel) {
  return fs.readFileSync(path.join(root, rel), 'utf-8');
}

function readFiles(root, relList) {
  return relList.map((rel) => readFile(root, rel)).join('\n\n');
}

function loadFaviconDataURI(root, relPath = 'src/favicon.JPG') {
  try {
    const faviconBuffer = fs.readFileSync(path.join(root, relPath));
    const base64Favicon = faviconBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64Favicon}`;
  } catch (err) {
    console.warn('Warning: Could not load src/favicon.JPG for base64 embedding:', err);
    return '';
  }
}

function renderThemeDots(themes, activeThemeId) {
  return themes
    .map((theme) => {
      const isActive = activeThemeId && theme.id === activeThemeId;
      return `<div class="theme-dot-item${isActive ? ' active' : ''}" data-theme="${theme.id}">
    <div class="dot" data-theme="${theme.id}"></div>
    <span>${theme.label}</span>
  </div>`;
    })
    .join('');
}

module.exports = {
  readFile,
  readFiles,
  loadFaviconDataURI,
  renderThemeDots,
};
