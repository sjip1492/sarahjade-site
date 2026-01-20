(() => {
  const DURATION_MS = 10_000;
  const RADIUS_PX = 50;
  const HARDNESS = 0.35;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  
  function initBlurWipe() {
    document.querySelectorAll(".blur").forEach(el => new BlurWipe(el));
  }

  // Best: wait until CSS/images/fonts/layout are settled
  window.addEventListener("load", () => {
    initBlurWipe();
  });

  class BlurWipe {
    constructor(root) {
      this.root = root;
      this.bg = root.querySelector(".blur-bg");
      if (!this.bg) return;

      this.canvas = document.createElement("canvas");
      this.canvas.className = "blur-reveal-canvas";
      this.ctx = this.canvas.getContext("2d");

      root.appendChild(this.canvas);

      this.stamps = [];
      this.needsResize = true;

      this.pointerInside = false;
      root.addEventListener("pointerenter", () => this.pointerInside = true);
      root.addEventListener("pointerleave", () => this.pointerInside = false);
      root.addEventListener("pointermove", (e) => this.onMove(e));

      this.ro = new ResizeObserver(() => this.needsResize = true);
      this.ro.observe(root);

      this.lastMaskUpdate = 0;
      this.raf = requestAnimationFrame((t) => this.frame(t));
    }

    resizeIfNeeded() {
      if (!this.needsResize) return;
      this.needsResize = false;

      const rect = this.root.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    onMove(e) {
      if (!this.pointerInside) return;

      const rect = this.root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.stamps.push({ x, y, t: performance.now() });
      if (this.stamps.length > 1500) this.stamps.splice(0, this.stamps.length - 1500);
    }

    drawMask(now) {
      const ctx = this.ctx;
      const w = this.root.clientWidth;
      const h = this.root.clientHeight;

      // Mask convention: white/opaque = visible, transparent = hidden (masked out)
      // We want the BLUR BG visible everywhere except the wiped path.
      // So we start opaque, then punch transparent holes.
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(220,220,220,0.19)";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "destination-out";

      const cutoff = now - DURATION_MS;
      let i = 0;
      while (i < this.stamps.length && this.stamps[i].t < cutoff) i++;
      if (i > 0) this.stamps.splice(0, i);

      for (const s of this.stamps) {
        const life = Math.min(1, Math.max(0, (now - s.t) / DURATION_MS));
        const fade = 1 - easeOutCubic(life); // 1 -> 0 over duration

        const r = RADIUS_PX;
        const inner = r * HARDNESS;
        const g = ctx.createRadialGradient(s.x, s.y, inner, s.x, s.y, r);
        g.addColorStop(0, `rgba(0,0,0,${0.95 * fade})`);
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    }

    applyMask(now) {
      // Throttle expensive toDataURL calls
      if (now - this.lastMaskUpdate < 60) return;
      this.lastMaskUpdate = now;

      const url = this.canvas.toDataURL("image/png");
      this.bg.style.webkitMaskImage = `url(${url})`;
      this.bg.style.maskImage = `url(${url})`;
      this.bg.style.webkitMaskSize = "100% 100%";
      this.bg.style.maskSize = "100% 100%";
      this.bg.style.webkitMaskRepeat = "no-repeat";
      this.bg.style.maskRepeat = "no-repeat";
    }

    frame(now) {
      this.resizeIfNeeded();
      this.drawMask(now);
      this.applyMask(now);
      this.raf = requestAnimationFrame((t) => this.frame(t));
    }
  }

  document.querySelectorAll(".blur").forEach(el => new BlurWipe(el));
})();
