(() => {
  const DURATION_MS  = 9_000;
  const RADIUS_PX    = 50;
  const HARDNESS     = 0.75;
  const STEP_PX      = 6;
  const MAX_STAMPS   = 2000;
  // Render the mask canvas at a fraction of the element's CSS size.
  // Blur masks don't need pixel-perfect resolution; the smaller canvas makes
  // toDataURL cheap enough to call every frame without throttling.
  const MASK_SCALE   = 0.5;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  window.initBlurWipe = function initBlurWipe(root = document) {
    root.querySelectorAll('.blur').forEach(el => {
      if (el.dataset.wipeInit === '1') return;
      el.dataset.wipeInit = '1';
      new BlurWipe(el);
    });
  };

  window.addEventListener('load', () => window.initBlurWipe());

  class BlurWipe {
    constructor(root) {
      this.root = root;
      this.bg   = root.querySelector('.blur-bg');
      if (!this.bg) return;

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'blur-reveal-canvas';
      this.ctx = this.canvas.getContext('2d');
      root.appendChild(this.canvas);

      this.stamps        = [];
      this.needsResize   = true;
      this.pointerInside = false;
      this.lastPt        = null;

      root.addEventListener('pointerenter', () => { this.pointerInside = true; });
      root.addEventListener('pointerleave', () => { this.pointerInside = false; this.lastPt = null; });
      root.addEventListener('pointermove',  (e) => this.onMove(e));

      this.ro = new ResizeObserver(() => { this.needsResize = true; });
      this.ro.observe(root);

      requestAnimationFrame((t) => this.frame(t));
    }

    resizeIfNeeded() {
      if (!this.needsResize) return;
      this.needsResize = false;
      const rect = this.root.getBoundingClientRect();
      // Low-res canvas — sufficient for a gradient mask, much faster to serialise
      this.canvas.width  = Math.max(1, Math.floor(rect.width  * MASK_SCALE));
      this.canvas.height = Math.max(1, Math.floor(rect.height * MASK_SCALE));
      this.ctx.setTransform(MASK_SCALE, 0, 0, MASK_SCALE, 0, 0);
    }

    onMove(e) {
      if (!this.pointerInside) return;
      const rect = this.root.getBoundingClientRect();

      // getCoalescedEvents gives every sampled position between two dispatched
      // events — critical for accurate paths during fast movement.
      const pts = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];

      for (const ce of pts) {
        this.addPoint(
          ce.clientX - rect.left,
          ce.clientY - rect.top,
          ce.timeStamp,          // use the sample's own timestamp, not Date.now()
        );
      }
    }

    addPoint(x, y, now) {
      if (!this.lastPt) {
        this.stamps.push({ x, y, t: now });
        this.lastPt = { x, y, t: now };
        return;
      }

      const { x: x0, y: y0, t: t0 } = this.lastPt;
      const dx   = x - x0;
      const dy   = y - y0;
      const dist = Math.hypot(dx, dy);

      if (dist < 0.001) {
        this.stamps.push({ x, y, t: now });
        return;
      }

      const steps = Math.ceil(dist / STEP_PX);
      for (let i = 1; i <= steps; i++) {
        const frac = i / steps;
        this.stamps.push({
          x: x0 + dx * frac,
          y: y0 + dy * frac,
          // Spread timestamps along the segment: the trailing end (near lastPt)
          // gets the older time t0; the leading tip gets the newer time now.
          // This means the tail fades before the tip, producing a natural streak.
          t: t0 + (now - t0) * frac,
        });
      }

      this.lastPt = { x, y, t: now };

      if (this.stamps.length > MAX_STAMPS) {
        this.stamps.splice(0, this.stamps.length - MAX_STAMPS);
      }
    }

    drawMask(now) {
      const ctx = this.ctx;
      const w   = this.root.clientWidth;
      const h   = this.root.clientHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(250,250,250,0.65)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'destination-out';

      // Evict expired stamps
      const cutoff = now - DURATION_MS;
      let i = 0;
      while (i < this.stamps.length && this.stamps[i].t < cutoff) i++;
      if (i > 0) this.stamps.splice(0, i);

      for (const s of this.stamps) {
        const life = Math.min(1, Math.max(0, (now - s.t) / DURATION_MS));
        const fade = 1 - easeOutCubic(life);

        const r     = RADIUS_PX;
        const inner = r * HARDNESS;
        const g     = ctx.createRadialGradient(s.x, s.y, inner, s.x, s.y, r);
        g.addColorStop(0, `rgba(0,0,0,${0.95 * fade})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    applyMask() {
      // No throttle needed — MASK_SCALE keeps toDataURL fast.
      const url = this.canvas.toDataURL('image/png');
      this.bg.style.webkitMaskImage  = `url(${url})`;
      this.bg.style.maskImage        = `url(${url})`;
      this.bg.style.webkitMaskSize   = '100% 100%';
      this.bg.style.maskSize         = '100% 100%';
      this.bg.style.webkitMaskRepeat = 'no-repeat';
      this.bg.style.maskRepeat       = 'no-repeat';
    }

    frame(now) {
      this.resizeIfNeeded();
      this.drawMask(now);
      this.applyMask();
      requestAnimationFrame((t) => this.frame(t));
    }
  }

  // Initialise any .blur elements already in the DOM at parse time
  document.querySelectorAll('.blur').forEach(el => {
    if (el.dataset.wipeInit === '1') return;
    el.dataset.wipeInit = '1';
    new BlurWipe(el);
  });
})();
