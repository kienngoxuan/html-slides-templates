/**
 * LECTA AI — Data & Diagram Blocks
 * Charts, Tables, Bento, Flow/Mindmap
 */

const InteractiveBlocksData = (function () {

  function init() {
    initCharts();
    initTables();
    initBento();
    initFlows();
  }

  /* === Canva-style Chart Tooltips === */
  function bindTooltipEvents(el, text) {
    const padding = 12;

    const positionTooltip = (clientX, clientY) => {
      const tooltip = document.querySelector('.chart-tooltip');
      if (!tooltip) return;

      const width = tooltip.offsetWidth || 0;
      const height = tooltip.offsetHeight || 0;
      const halfW = width / 2;

      let left = clientX;
      let top = clientY;

      if (left + halfW + padding > window.innerWidth) {
        left = window.innerWidth - halfW - padding;
      }
      if (left - halfW - padding < 0) {
        left = halfW + padding;
      }
      if (top - height - padding < 0) {
        top = height + padding;
      }
      if (top + padding > window.innerHeight) {
        top = window.innerHeight - padding;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const showTooltip = (clientX, clientY) => {
      const tooltip = document.querySelector('.chart-tooltip');
      if (!tooltip) return;
      tooltip.innerHTML = text;
      positionTooltip(clientX, clientY);
      tooltip.classList.add('visible');
    };

    const hideTooltip = () => {
      const tooltip = document.querySelector('.chart-tooltip');
      if (tooltip) tooltip.classList.remove('visible');
    };

    el.addEventListener('mouseenter', (e) => {
      showTooltip(e.clientX, e.clientY);
      el.style.filter = 'brightness(1.15) saturate(1.1)';
    });

    el.addEventListener('mousemove', (e) => {
      positionTooltip(e.clientX, e.clientY);
    });

    el.addEventListener('mouseleave', () => {
      hideTooltip();
      el.style.filter = 'none';
    });

    el.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        showTooltip(e.touches[0].clientX, e.touches[0].clientY);
        el.style.filter = 'brightness(1.15) saturate(1.1)';
      }
    });

    el.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        positionTooltip(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    el.addEventListener('touchend', () => {
      hideTooltip();
      el.style.filter = 'none';
    });
  }

  function renderChartContainer(container) {
    const svg = container.querySelector('.svg-chart');
    if (!svg) return;

    const type = container.dataset.chartType || 'bar';
    let labels = [];
    let datasets = [];

    try {
      labels = JSON.parse(container.dataset.labels || '[]');
      datasets = JSON.parse(container.dataset.datasets || '[]');
    } catch (e) {
      console.error('Error parsing chart data:', e);
      return;
    }

    svg.innerHTML = '';

    if (datasets.length === 0) return;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="primary-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-primary)" />
        <stop offset="100%" stop-color="color-mix(in oklch, var(--color-primary) 30%, transparent)" />
      </linearGradient>
      <linearGradient id="success-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-success)" />
        <stop offset="100%" stop-color="color-mix(in oklch, var(--color-success) 30%, transparent)" />
      </linearGradient>
      <linearGradient id="accent-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-accent)" />
        <stop offset="100%" stop-color="color-mix(in oklch, var(--color-accent) 30%, transparent)" />
      </linearGradient>
    `;
    svg.appendChild(defs);

    if (type === 'bar') {
      renderBarChart(svg, labels, datasets, container);
    } else if (type === 'line') {
      renderLineChart(svg, labels, datasets, container);
    } else if (type === 'donut') {
      renderDonutChart(svg, labels, datasets, container);
    }

    const legend = container.querySelector('.chart-legend');
    if (legend) {
      legend.innerHTML = datasets.map((ds, dsi) => `
        <div class="legend-item" data-dataset-index="${dsi}">
          <span class="legend-color" style="background: var(--color-${ds.color || 'primary'})"></span>
          <span class="legend-label">${ds.label}</span>
        </div>
      `).join('');

      legend.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.dataset.datasetIndex, 10);
          const elements = svg.querySelectorAll(`.dataset-group-${idx}`);
          const isActive = !item.classList.contains('inactive');

          item.classList.toggle('inactive');
          elements.forEach(el => {
            el.style.opacity = isActive ? '0.1' : '1';
            el.style.transition = 'opacity var(--transition-base)';
          });
        });
      });
    }
  }

  function initCharts() {
    let tooltip = document.querySelector('.chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      document.body.appendChild(tooltip);
    }

    document.querySelectorAll('.chart-block-container').forEach(container => {
      renderChartContainer(container);
    });

    document.addEventListener('slideChanged', (e) => {
      const activeSlideIndex = e.detail.index;
      const slides = document.querySelectorAll('.slide');
      const activeSlide = slides[activeSlideIndex];
      if (!activeSlide) return;

      activeSlide.querySelectorAll('.chart-block-container').forEach(container => {
        renderChartContainer(container);
      });
    });
  }

  function renderBarChart(svg, labels, datasets, container) {
    const W = parseInt(container && container.dataset.chartW, 10) || 600;
    const H = parseInt(container && container.dataset.chartH, 10) || 320;
    const padding = 50;
    const chartW = W - padding * 2;
    const chartH = H - padding * 2;

    let maxVal = 0;
    datasets.forEach(ds => {
      ds.data.forEach(val => { if (val > maxVal) maxVal = val; });
    });
    maxVal = maxVal * 1.15 || 100;

    const groupCount = labels.length;
    const dsCount = datasets.length;
    const groupWidth = chartW / groupCount;
    const barSpacing = 4;
    const totalBarsWidth = groupWidth * 0.65;
    const singleBarWidth = totalBarsWidth / dsCount - barSpacing;

    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const y = padding + chartH - (i / ticks) * chartH;
      const val = Math.round((i / ticks) * maxVal);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padding);
      line.setAttribute('y1', y);
      line.setAttribute('x2', W - padding);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'var(--color-border-light)');
      line.setAttribute('stroke-width', '1');
      if (i > 0) line.setAttribute('stroke-dasharray', '4 4');
      svg.appendChild(line);

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', padding - 10);
      txt.setAttribute('y', y + 4);
      txt.setAttribute('text-anchor', 'end');
      txt.setAttribute('fill', 'var(--color-text-muted)');
      txt.setAttribute('font-size', '11');
      txt.setAttribute('font-family', 'var(--font-mono)');
      txt.textContent = val;
      svg.appendChild(txt);
    }

    labels.forEach((lbl, gIdx) => {
      const groupX = padding + gIdx * groupWidth;
      const centerX = groupX + groupWidth / 2;

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', centerX);
      txt.setAttribute('y', H - padding + 24);
      txt.setAttribute('fill', 'var(--color-text-muted)');
      
      if (labels.length > 5) {
        txt.setAttribute('transform', `rotate(-30, ${centerX}, ${H - padding + 22})`);
        txt.setAttribute('text-anchor', 'end');
        txt.setAttribute('font-size', '10');
      } else {
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('font-size', '12');
      }
      
      txt.textContent = lbl;
      svg.appendChild(txt);

      datasets.forEach((ds, dsIdx) => {
        const val = ds.data[gIdx] || 0;
        const barH = (val / maxVal) * chartH;
        const barX = centerX - totalBarsWidth / 2 + dsIdx * (singleBarWidth + barSpacing);
        const barY = H - padding - barH;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('class', `dataset-group-${dsIdx}`);
        rect.setAttribute('x', barX);
        rect.setAttribute('y', H - padding);
        rect.setAttribute('width', singleBarWidth);
        rect.setAttribute('height', 0);
        rect.setAttribute('rx', 4);
        rect.setAttribute('fill', `url(#${ds.color || 'primary'}-grad)`);

        rect.style.cursor = 'pointer';
        rect.style.transition = 'y 0.8s cubic-bezier(0.25, 1, 0.5, 1), height 0.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.2s ease';
        
        bindTooltipEvents(rect, `<strong>${ds.label}</strong><br><span>${lbl}</span>: <strong style="color: var(--color-${ds.color || 'primary'})">${val}</strong>`);

        svg.appendChild(rect);

        setTimeout(() => {
          rect.setAttribute('y', barY);
          rect.setAttribute('height', Math.max(2, barH));
        }, 50 + gIdx * 30);
      });
    });

    const baseline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    baseline.setAttribute('x1', padding);
    baseline.setAttribute('y1', H - padding);
    baseline.setAttribute('x2', W - padding);
    baseline.setAttribute('y2', H - padding);
    baseline.setAttribute('stroke', 'var(--color-border)');
    baseline.setAttribute('stroke-width', '1.5');
    svg.appendChild(baseline);
  }

  function renderLineChart(svg, labels, datasets, container) {
    const W = parseInt(container && container.dataset.chartW, 10) || 600;
    const H = parseInt(container && container.dataset.chartH, 10) || 320;
    const padding = 50;
    const chartW = W - padding * 2;
    const chartH = H - padding * 2;

    let maxVal = 0;
    datasets.forEach(ds => {
      ds.data.forEach(val => { if (val > maxVal) maxVal = val; });
    });
    maxVal = maxVal * 1.15 || 100;

    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const y = padding + chartH - (i / ticks) * chartH;
      const val = Math.round((i / ticks) * maxVal);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padding);
      line.setAttribute('y1', y);
      line.setAttribute('x2', W - padding);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'var(--color-border-light)');
      line.setAttribute('stroke-width', '1');
      if (i > 0) line.setAttribute('stroke-dasharray', '4 4');
      svg.appendChild(line);

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', padding - 10);
      txt.setAttribute('y', y + 4);
      txt.setAttribute('text-anchor', 'end');
      txt.setAttribute('fill', 'var(--color-text-muted)');
      txt.setAttribute('font-size', '11');
      txt.setAttribute('font-family', 'var(--font-mono)');
      txt.textContent = val;
      svg.appendChild(txt);
    }

    const stepX = chartW / (labels.length - 1 || 1);

    labels.forEach((lbl, idx) => {
      const x = padding + idx * stepX;
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', x);
      txt.setAttribute('y', H - padding + 24);
      txt.setAttribute('fill', 'var(--color-text-muted)');
      
      if (labels.length > 5) {
        txt.setAttribute('transform', `rotate(-30, ${x}, ${H - padding + 22})`);
        txt.setAttribute('text-anchor', 'end');
        txt.setAttribute('font-size', '10');
      } else {
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('font-size', '12');
      }
      
      txt.textContent = lbl;
      svg.appendChild(txt);
    });

    datasets.forEach((ds, dsIdx) => {
      let pathD = '';
      const points = [];

      ds.data.forEach((val, idx) => {
        const x = padding + idx * stepX;
        const y = H - padding - (val / maxVal) * chartH;
        points.push({ x, y });
        if (idx === 0) {
          pathD += `M ${x} ${y}`;
        } else {
          const prev = points[idx - 1];
          const cp1x = prev.x + stepX / 3;
          const cp1y = prev.y;
          const cp2x = x - stepX / 3;
          const cp2y = y;
          pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
        }
      });

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', `dataset-group-${dsIdx}`);
      path.setAttribute('d', pathD);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', `var(--color-${ds.color || 'primary'})`);
      path.setAttribute('stroke-width', '3');
      path.setAttribute('stroke-linecap', 'round');
      
      svg.appendChild(path);
      
      let pathLength = 1500;
      try {
        const totalLen = path.getTotalLength();
        if (totalLen > 0) pathLength = totalLen;
      } catch (e) {
        console.warn('Failed to measure path length:', e);
      }

      path.setAttribute('stroke-dasharray', pathLength);
      path.setAttribute('stroke-dashoffset', pathLength);
      path.style.transition = 'stroke-dashoffset 1.5s ease-out';

      setTimeout(() => {
        path.setAttribute('stroke-dashoffset', '0');
      }, 100);

      points.forEach((pt, idx) => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('class', `dataset-group-${dsIdx}`);
        dot.setAttribute('cx', pt.x);
        dot.setAttribute('cy', pt.y);
        dot.setAttribute('r', '5');
        dot.setAttribute('fill', 'var(--color-bg)');
        dot.setAttribute('stroke', `var(--color-${ds.color || 'primary'})`);
        dot.setAttribute('stroke-width', '3');
        dot.style.cursor = 'pointer';
        dot.style.transition = 'r 0.2s ease, filter 0.2s ease';

        bindTooltipEvents(dot, `<strong>${ds.label}</strong><br><span>${labels[idx]}</span>: <strong style="color: var(--color-${ds.color || 'primary'})">${ds.data[idx]}</strong>`);

        dot.addEventListener('mouseenter', () => {
          dot.setAttribute('r', '8');
        });
        dot.addEventListener('mouseleave', () => {
          dot.setAttribute('r', '5');
        });
        dot.addEventListener('touchstart', () => {
          dot.setAttribute('r', '8');
        });
        dot.addEventListener('touchend', () => {
          dot.setAttribute('r', '5');
        });

        svg.appendChild(dot);
      });
    });

    const baseline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    baseline.setAttribute('x1', padding);
    baseline.setAttribute('y1', H - padding);
    baseline.setAttribute('x2', W - padding);
    baseline.setAttribute('y2', H - padding);
    baseline.setAttribute('stroke', 'var(--color-border)');
    baseline.setAttribute('stroke-width', '1.5');
    svg.appendChild(baseline);
  }

  function renderDonutChart(svg, labels, datasets, container) {
    const W = parseInt(container && container.dataset.chartW, 10) || 600;
    const H = parseInt(container && container.dataset.chartH, 10) || 320;
    const cx = W / 2 - 80;
    const cy = H / 2;
    const r = 70;
    const strokeW = 20;
    const circumference = 2 * Math.PI * r;

    const data = datasets[0].data || [];
    const total = data.reduce((a, b) => a + b, 0) || 1;

    let accumulatedAngle = -Math.PI / 2;

    const chartLegendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const isDualColumn = data.length > 5;
    const itemsPerCol = isDualColumn ? Math.ceil(data.length / 2) : data.length;
    const lineSpacing = isDualColumn ? 22 : 24;

    data.forEach((val, idx) => {
      const percentage = val / total;
      const strokeLength = percentage * circumference;
      const strokeOffset = circumference - strokeLength;
      
      const colors = ['primary', 'success', 'accent', 'error', 'warning'];
      let strokeColor;
      if (data.length <= 5) {
        strokeColor = `var(--color-${colors[idx % colors.length]})`;
      } else {
        const hue = Math.round(30 + (idx * 300) / data.length);
        strokeColor = `oklch(68% 0.16 ${hue})`;
      }

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', `dataset-group-0`);
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', strokeColor);
      circle.setAttribute('stroke-width', strokeW);
      circle.setAttribute('stroke-dasharray', circumference);
      circle.setAttribute('stroke-dashoffset', circumference);
      
      const rotAngle = (accumulatedAngle + Math.PI / 2) * (180 / Math.PI);
      circle.setAttribute('transform', `rotate(${rotAngle} ${cx} ${cy})`);
      accumulatedAngle += percentage * 2 * Math.PI;

      circle.style.cursor = 'pointer';
      circle.style.transition = 'stroke-dashoffset 1s ease-out, stroke-width 0.2s ease, filter 0.2s ease';

      bindTooltipEvents(circle, `<strong>${labels[idx] || 'Item'}</strong><br><span style="font-size: 1.1rem; font-weight: 700; color: ${strokeColor}">${val}</span> (${Math.round(percentage * 100)}%)`);

      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('stroke-width', strokeW + 4);
      });
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('stroke-width', strokeW);
      });
      circle.addEventListener('touchstart', () => {
        circle.setAttribute('stroke-width', strokeW + 4);
      });
      circle.addEventListener('touchend', () => {
        circle.setAttribute('stroke-width', strokeW);
      });

      svg.appendChild(circle);

      setTimeout(() => {
        circle.setAttribute('stroke-dashoffset', strokeOffset);
      }, 100);

      const colIdx = isDualColumn ? idx % 2 : 0;
      const rowIdx = isDualColumn ? Math.floor(idx / 2) : idx;
      
      const legendX = isDualColumn 
        ? (cx + r + 25 + colIdx * 125) 
        : (cx + r + 45);
      const legendY = cy - (itemsPerCol * lineSpacing) / 2 + rowIdx * lineSpacing + 8;

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', legendX);
      dot.setAttribute('cy', legendY - 4);
      dot.setAttribute('r', isDualColumn ? '5' : '6');
      dot.setAttribute('fill', strokeColor);
      chartLegendGroup.appendChild(dot);

      const labelTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelTxt.setAttribute('x', legendX + 14);
      labelTxt.setAttribute('y', legendY);
      labelTxt.setAttribute('fill', 'var(--color-text)');
      labelTxt.setAttribute('font-size', isDualColumn ? '10.5' : '13');
      labelTxt.setAttribute('font-weight', '500');
      
      if (isDualColumn) {
        labelTxt.textContent = `${labels[idx] || 'Item'} (${Math.round(percentage * 100)}%)`;
      } else {
        labelTxt.textContent = `${labels[idx] || 'Item'}`;
      }
      chartLegendGroup.appendChild(labelTxt);

      if (!isDualColumn) {
        const valTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valTxt.setAttribute('x', legendX + 210);
        valTxt.setAttribute('y', legendY);
        valTxt.setAttribute('fill', 'var(--color-text-muted)');
        valTxt.setAttribute('font-size', '13');
        valTxt.setAttribute('font-family', 'var(--font-mono)');
        valTxt.setAttribute('text-anchor', 'end');
        valTxt.textContent = `${val} (${Math.round(percentage * 100)}%)`;
        chartLegendGroup.appendChild(valTxt);
      }
    });

    svg.appendChild(chartLegendGroup);

    const centerTotal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerTotal.setAttribute('x', cx);
    centerTotal.setAttribute('y', cy - 5);
    centerTotal.setAttribute('text-anchor', 'middle');
    centerTotal.setAttribute('fill', 'var(--color-text-muted)');
    centerTotal.setAttribute('font-size', '11');
    centerTotal.setAttribute('font-weight', '600');
    centerTotal.textContent = 'TOTAL';
    svg.appendChild(centerTotal);

    const centerVal = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerVal.setAttribute('x', cx);
    centerVal.setAttribute('y', cy + 14);
    centerVal.setAttribute('text-anchor', 'middle');
    centerVal.setAttribute('fill', 'var(--color-text)');
    centerVal.setAttribute('font-size', '18');
    centerVal.setAttribute('font-weight', '700');
    centerVal.setAttribute('font-family', 'var(--font-mono)');
    centerVal.textContent = total;
    svg.appendChild(centerVal);
  }

  /* === Tables === */
  function renderTableContainer(container) {
    let columns = [];
    let rows = [];
    try {
      columns = JSON.parse(container.getAttribute('data-columns') || '[]');
      rows = JSON.parse(container.getAttribute('data-rows') || '[]');
    } catch (e) {
      console.error('Error parsing table data:', e);
      return;
    }

    const table = container.querySelector('table');
    if (!table) return;

    // Apply glass-table class if missing
    table.className = 'glass-table';

    let thead = table.querySelector('thead');
    if (!thead) {
      thead = document.createElement('thead');
      table.appendChild(thead);
    }
    let tbody = table.querySelector('tbody');
    if (!tbody) {
      tbody = document.createElement('tbody');
      table.appendChild(tbody);
    }

    thead.innerHTML = `
      <tr>
        ${columns.map(col => `
          <th class="sortable-th" data-key="${col.key}">
            ${col.label} <span class="sort-indicator">↕</span>
          </th>
        `).join('')}
      </tr>
    `;

    tbody.innerHTML = rows.map(row => `
      <tr>
        ${columns.map(col => {
          const val = row[col.key] !== undefined ? row[col.key] : '';
          let content = '';
          
          if (col.type === 'badge') {
            const parts = String(val).split('·');
            const badgeText = parts[0].trim();
            const badgeType = parts[1] ? parts[1].trim() : 'primary';
            content = `<span class="badge-pill pill-${badgeType}">${badgeText}</span>`;
          } else if (col.type === 'code') {
            content = `<span class="code-cell">${val}</span>`;
          } else if (col.type === 'progress') {
            content = `
              <div class="progress-cell-wrapper">
                <div class="progress-cell-bar">
                  <div class="progress-cell-fill" style="width: ${val}%"></div>
                </div>
                <span class="progress-cell-text">${val}%</span>
              </div>
            `;
          } else {
            content = val;
          }

          return `<td>${content}</td>`;
        }).join('')}
      </tr>
    `).join('');

    const rowCountEl = container.querySelector('.table-row-count');
    if (rowCountEl) {
      rowCountEl.textContent = `${rows.length} rows`;
    }

    // Bind sorting on header cells
    thead.querySelectorAll('.sortable-th').forEach(th => {
      let isAsc = true;
      th.addEventListener('click', () => {
        const rowsArray = Array.from(tbody.querySelectorAll('tr'));
        const index = Array.from(th.parentNode.children).indexOf(th);
        
        th.parentNode.querySelectorAll('.sort-indicator').forEach(ind => ind.textContent = '↕');
        isAsc = !th.classList.contains('asc-sort');
        th.parentNode.querySelectorAll('th').forEach(h => h.classList.remove('asc-sort', 'desc-sort'));

        th.classList.add(isAsc ? 'asc-sort' : 'desc-sort');
        th.querySelector('.sort-indicator').textContent = isAsc ? '▲' : '▼';

        rowsArray.sort((a, b) => {
          const aText = a.children[index].textContent.trim();
          const bText = b.children[index].textContent.trim();

          const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
          const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));

          if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? aNum - bNum : bNum - aNum;
          }

          return isAsc 
            ? aText.localeCompare(bText) 
            : bText.localeCompare(aText);
        });

        rowsArray.forEach(row => tbody.appendChild(row));

        // Re-apply table search filter query after sorting
        const searchInput = container.querySelector('.table-search-input');
        if (searchInput && searchInput.value) {
          const query = searchInput.value.toLowerCase().trim();
          rowsArray.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const matches = cells.some(cell => cell.textContent.toLowerCase().includes(query));
            row.style.display = matches ? '' : 'none';
          });
        }
      });
    });
  }

  function initTables() {
    // Render tables initially
    document.querySelectorAll('.table-block-container').forEach(container => {
      renderTableContainer(container);
    });

    // Also render when slide changes
    document.addEventListener('slideChanged', (e) => {
      const activeSlideIndex = e.detail.index;
      const slides = document.querySelectorAll('.slide');
      const activeSlide = slides[activeSlideIndex];
      if (!activeSlide) return;

      activeSlide.querySelectorAll('.table-block-container').forEach(container => {
        renderTableContainer(container);
      });
    });

    // Bind search inputs
    document.querySelectorAll('.table-search-input').forEach(input => {
      input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        const container = input.closest('.table-block-container');
        const rows = container.querySelectorAll('tbody tr');

        let visibleCount = 0;
        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          const matches = cells.some(cell => cell.textContent.toLowerCase().includes(query));
          if (matches) {
            row.style.display = '';
            visibleCount++;
          } else {
            row.style.display = 'none';
          }
        });

        const rowCountEl = container.querySelector('.table-row-count');
        if (rowCountEl) {
          rowCountEl.textContent = `${visibleCount} rows`;
        }
      });
    });
  }

  /* === Bento Grid === */
  function initBento() {
    // CSS-only hover interactions
  }

  /* === Flow / Mindmap === */
  function initFlows() {
    document.querySelectorAll('.flow-block-container').forEach(container => {
      const svg = container.querySelector('.flow-svg-canvas');
      if (!svg) return;

      let nodes = [];
      let connections = [];

      try {
        nodes = JSON.parse(container.dataset.nodes || '[]');
        connections = JSON.parse(container.dataset.connections || '[]');
      } catch (e) {
        console.error('Error parsing flow data:', e);
        return;
      }

      const nodeWidth = 160;
      const nodeHeight = 50;
      const paddingX = 40;
      const rightSafety = 40;
      const spreadWidth = 800 - paddingX - rightSafety - nodeWidth;

      const N = nodes.length;
      nodes.forEach((node, idx) => {
        if (node.x === undefined) {
          node.x = paddingX + idx * (spreadWidth / Math.max(1, N - 1));
        }
        if (node.y === undefined) {
          node.y = 100 + (idx % 2 === 0 ? 0 : 80);
        }
      });

      const defs = svg.querySelector('defs');
      svg.innerHTML = '';
      if (defs) {
        svg.appendChild(defs);
      }

      connections.forEach((conn, connIdx) => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startX = fromNode.x + nodeWidth;
        const startY = fromNode.y + nodeHeight / 2;
        const endX = toNode.x;
        const endY = toNode.y + nodeHeight / 2;

        const dx = endX - startX;
        const cp1x = startX + dx * 0.4;
        const cp1y = startY;
        const cp2x = startX + dx * 0.6;
        const cp2y = endY;

        path.setAttribute('d', `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'var(--color-primary-alpha)');
        path.setAttribute('stroke-width', '2.5');
        path.classList.add('flow-connection-path');
        svg.appendChild(path);

        // SVG line draw animation
        let pathLength = 500;
        try {
          const totalLen = path.getTotalLength();
          if (totalLen > 0) pathLength = totalLen;
        } catch (e) { /* fallback */ }

        path.setAttribute('stroke-dasharray', pathLength);
        path.setAttribute('stroke-dashoffset', pathLength);

        // Staggered draw-in animation
        setTimeout(() => {
          path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
          path.setAttribute('stroke-dashoffset', '0');
        }, 150 + connIdx * 200);
      });

      nodes.forEach(node => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'flow-node-group');
        group.setAttribute('data-id', node.id);
        group.style.cursor = 'pointer';

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', node.x);
        rect.setAttribute('y', node.y);
        rect.setAttribute('width', nodeWidth);
        rect.setAttribute('height', nodeHeight);
        rect.setAttribute('rx', 12);
        rect.setAttribute('fill', 'var(--color-surface)');
        rect.setAttribute('stroke', 'var(--color-border)');
        rect.setAttribute('stroke-width', '2');
        rect.style.transition = 'all var(--transition-base)';

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x + nodeWidth / 2);
        text.setAttribute('y', node.y + nodeHeight / 2 + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'var(--color-text)');
        text.setAttribute('font-weight', '600');
        text.style.pointerEvents = 'none';
        
        const fontSize = nodeWidth < 110 ? 9 : (nodeWidth < 135 ? 10 : 12);
        text.setAttribute('font-size', fontSize);
        
        let labelText = node.label || '';
        const charRatio = fontSize === 9 ? 5.5 : (fontSize === 10 ? 6.5 : 7.5);
        const maxChars = Math.floor(nodeWidth / charRatio);
        if (labelText.length > maxChars && maxChars > 5) {
          labelText = labelText.substring(0, maxChars - 2) + '..';
        }
        text.textContent = labelText;

        group.appendChild(rect);
        group.appendChild(text);
        svg.appendChild(group);

        group.addEventListener('click', (e) => {
          e.stopPropagation();
          
          svg.querySelectorAll('rect').forEach(r => {
            r.setAttribute('fill', 'var(--color-surface)');
            r.setAttribute('stroke', 'var(--color-border)');
          });

          rect.setAttribute('fill', 'var(--color-primary-alpha)');
          rect.setAttribute('stroke', 'var(--color-primary)');

          const defaultMsg = container.querySelector('.flow-detail-default-msg');
          const content = container.querySelector('.flow-detail-content');
          const title = container.querySelector('.flow-detail-title');
          const desc = container.querySelector('.flow-detail-desc');

          if (defaultMsg && content && title && desc) {
            defaultMsg.style.display = 'none';
            content.style.display = 'block';
            title.textContent = node.label;
            desc.textContent = node.details || 'No details specified for this step.';
          }
        });
      });

      // Bind close button resetting
      container.querySelectorAll('.flow-side-panel-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const defaultMsg = container.querySelector('.flow-detail-default-msg');
          const content = container.querySelector('.flow-detail-content');
          const title = container.querySelector('.flow-detail-title');
          const desc = container.querySelector('.flow-detail-desc');

          if (defaultMsg && content && title && desc) {
            defaultMsg.style.display = 'block';
            content.style.display = 'none';
            title.textContent = 'Inspect Element';
            desc.textContent = 'Click any element in the diagram to inspect its detailed specification.';
          }

          svg.querySelectorAll('.flow-node-group rect').forEach(r => {
            r.setAttribute('fill', 'var(--color-surface)');
            r.setAttribute('stroke', 'var(--color-border)');
          });
        });
      });
    });

    // Re-animate flow connections when navigating to a flow slide
    document.addEventListener('slideChanged', (e) => {
      const slideIndex = e.detail.index;
      const allSlides = document.querySelectorAll('.slide');
      const activeSlide = allSlides[slideIndex];
      if (!activeSlide) return;

      activeSlide.querySelectorAll('.flow-connection-path').forEach((path, idx) => {
        let pathLength = 500;
        try {
          const totalLen = path.getTotalLength();
          if (totalLen > 0) pathLength = totalLen;
        } catch (e) { /* fallback */ }

        // Reset
        path.style.transition = 'none';
        path.setAttribute('stroke-dasharray', pathLength);
        path.setAttribute('stroke-dashoffset', pathLength);

        // Re-animate
        setTimeout(() => {
          path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
          path.setAttribute('stroke-dashoffset', '0');
        }, 150 + idx * 200);
      });
    });
  }

  return { init };
})();

window.InteractiveBlocksData = window.InteractiveBlocksData || InteractiveBlocksData;
