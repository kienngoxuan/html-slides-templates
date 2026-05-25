/**
 * LECTA AI — Presenter Overlay Interactions
 * Drawing Canvas Annotations & Decaying Laser Trails
 */

const PresenterOverlay = (function () {

  let isDrawingActive = false;

  function init() {
    initDrawing();
    initLaserPointerTrails();
  }

  /* === 🖌️ Presenter Canvas Annotation & Scribbling Overlay === */
  function initDrawing() {
    const canvas = document.querySelector('.drawing-canvas-overlay');
    const toolbar = document.querySelector('.drawing-toolbar');
    if (!canvas || !toolbar) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let tool = 'pen'; // 'pen', 'highlighter', 'eraser'
    let color = '#ef4444'; // Red default
    let size = 4;

    function resizeCanvas() {
      const view = document.querySelector('.slides-viewport') || document.body;
      canvas.width = view.clientWidth;
      canvas.height = view.clientHeight;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Toggle overlay and toolbar
    document.addEventListener('toggleDrawingCanvas', () => {
      isDrawingActive = !isDrawingActive;
      if (isDrawingActive) {
        canvas.style.pointerEvents = 'auto';
        toolbar.classList.add('active');
        resizeCanvas();
      } else {
        canvas.style.pointerEvents = 'none';
        toolbar.classList.remove('active');
      }
    });

    // Handle Toolbar Tools Selection
    toolbar.querySelectorAll('.draw-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('draw-clear')) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }
        toolbar.querySelectorAll('.draw-tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tool = btn.dataset.tool;
      });
    });

    // Handle Colors Selection
    toolbar.querySelectorAll('.draw-color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        toolbar.querySelectorAll('.draw-color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        color = dot.dataset.color;
      });
    });

    // Handle Size Range Slider
    const sizeSlider = toolbar.querySelector('.draw-brush-size');
    const sizeIndicator = toolbar.querySelector('.draw-brush-indicator');
    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        size = e.target.value;
        if (sizeIndicator) sizeIndicator.textContent = `Size: ${size}px`;
      });
    }

    // Scribble Drawing Mechanics (Desktop Mouse & Mobile Touch)
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      if (!isDrawingActive) return;
      isDrawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      e.preventDefault();
    }

    function draw(e) {
      if (!isDrawingActive || !isDrawing) return;
      const pos = getPos(e);

      ctx.lineWidth = size;
      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = size * 3; // Wider eraser
      } else if (tool === 'highlighter') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.globalAlpha = 1.0;
      }

      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      e.preventDefault();
    }

    function stopDraw() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);

    // Clear canvas when slides navigate
    document.addEventListener('slideChanged', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  /* === 🎯 Decaying Laser Pointer Particle Trails === */
  function initLaserPointerTrails() {
    document.addEventListener('mousemove', (e) => {
      if (!document.body.classList.contains('laser-pointer')) return;

      const dot = document.createElement('div');
      dot.className = 'laser-trail-particle';
      dot.style.position = 'fixed';
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.backgroundColor = '#ef4444';
      dot.style.borderRadius = '50%';
      dot.style.pointerEvents = 'none';
      dot.style.zIndex = '9999999';
      dot.style.transform = 'translate(-50%, -50%)';
      dot.style.boxShadow = '0 0 10px #ef4444, 0 0 20px #ef4444';
      dot.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      document.body.appendChild(dot);

      setTimeout(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'translate(-50%, -50%) scale(0.2)';
      }, 50);

      setTimeout(() => {
        dot.remove();
      }, 450);
    });
  }

  return { init };
})();

window.PresenterOverlay = window.PresenterOverlay || PresenterOverlay;
