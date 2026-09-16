/**
 * Auvenda sea-flow
 *
 * Live Black Sea contour animation for brand line surfaces.
 * Canvas 2D + marching squares (same field as the generator), not SVG morph
 * or WebGL: SVG innerHTML per frame is too heavy on Safari, WebGL is overkill
 * for stroked contours and weaker on older iOS.
 *
 * Desktop uses denser grids; hero/mobile drop resolution and frame rate.
 * Slow frames or reduced-motion keep the existing static SVG.
 */
(function () {
  const SEED = 18427;
  const VIEW_W = 842;
  const VIEW_H = 596;
  const STROKE = "rgba(143, 194, 234, 0.58)";
  const SHADOW = "rgba(143, 194, 234, 0.14)";
  const STATE = {
    scale: 1,
    flow: 0.82,
    waves: 0.62,
    whorls: 6,
    whorlStrength: 1.05,
    ecc: 0.48,
    distort: 0.55,
    open: 0.52,
    sea: 0.24
  };
  const TIERS = [
    { nx: 36, ny: 24, density: 5, fps: 16, stroke: 1.35, shadow: false },
    { nx: 52, ny: 36, density: 6, fps: 22, stroke: 1.5, shadow: false },
    { nx: 68, ny: 46, density: 7, fps: 28, stroke: 1.6, shadow: true }
  ];
  const SELECTOR = ".hero.pattern-background, .hero.dark-wave, .pattern-background, .dark-wave";

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function hashNoise(x, y, s) {
    const n = Math.sin(x * 127.1 + y * 311.7 + s * 0.013) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  }

  function smoothNoise(x, y, s) {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    let fx = x - x0;
    let fy = y - y0;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    const a = hashNoise(x0, y0, s);
    const b = hashNoise(x0 + 1, y0, s);
    const c = hashNoise(x0, y0 + 1, s);
    const d = hashNoise(x0 + 1, y0 + 1, s);
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
  }

  function makeCenters(seed) {
    const R = rng(seed);
    const centers = [];
    for (let i = 0; i < Math.round(STATE.whorls); i += 1) {
      centers.push({
        x: 0.08 + R() * 0.84,
        y: 0.1 + R() * 0.8,
        r: 0.07 + R() * 0.13,
        ph: R() * 6.28,
        sg: R() > 0.22 ? 1 : -0.65
      });
    }
    return centers;
  }

  function staticField(x, y, seed, centers) {
    const sc = STATE.scale;
    let v = 0;
    const angle = 0.18 + STATE.flow * 0.18;
    const u = (x * Math.cos(angle) + y * Math.sin(angle)) * sc;
    const q = (-x * Math.sin(angle) + y * Math.cos(angle)) * sc;
    for (const c of centers) {
      const dx = x - c.x;
      const dy = (y - c.y) * (1 + STATE.ecc * 1.5);
      const rr = Math.hypot(dx, dy);
      const a = Math.atan2(dy, dx);
      v += c.sg * STATE.whorlStrength * Math.exp(-rr * rr / (2 * c.r * c.r)) * Math.cos(rr * 28 / c.r * 0.11 + a * 0.35 + c.ph);
      v += 0.32 * STATE.whorlStrength * Math.exp(-rr * rr / (2 * (c.r * 1.65) ** 2));
    }
    v += STATE.distort * (0.45 * smoothNoise(x * 5 * sc, y * 5 * sc, seed) + 0.2 * smoothNoise(x * 11 * sc, y * 11 * sc, seed + 9));
    const bx = (x - 0.52) / 0.46;
    const by = (y - 0.5) / 0.23;
    const seaShape = Math.exp(-(bx * bx + by * by)) * Math.cos((x - 0.5) * 7)
      + 0.45 * Math.exp(-(((x - 0.3) / 0.24) ** 2 + ((y - 0.47) / 0.12) ** 2))
      + 0.4 * Math.exp(-(((x - 0.73) / 0.18) ** 2 + ((y - 0.54) / 0.15) ** 2));
    v += STATE.sea * seaShape;
    v += STATE.open * (x - 0.5) * 0.75;
    return { v, u, q, x, y, sc };
  }

  function timedField(base, t) {
    let v = base.v;
    v += STATE.waves * (0.48 * Math.sin(base.u * 12 + t) + 0.28 * Math.sin(base.q * 8 - base.u * 3 - t * 0.4));
    v += STATE.flow * 0.42 * Math.sin((base.y + 0.16 * Math.sin(base.x * 5)) * 9 * base.sc + t * 0.3);
    return v;
  }

  function interp(a, b, va, vb, level) {
    return a + (b - a) * ((level - va) / (vb - va || 1e-9));
  }

  function contours(vals, nx, ny, levels) {
    const segs = [];
    for (const L of levels) {
      for (let j = 0; j < ny - 1; j += 1) {
        for (let i = 0; i < nx - 1; i += 1) {
          const vs = [vals[j][i], vals[j][i + 1], vals[j + 1][i + 1], vals[j + 1][i]];
          const xy = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
          const pts = [];
          for (let e = 0; e < 4; e += 1) {
            const n = (e + 1) % 4;
            if ((vs[e] < L) !== (vs[n] < L)) {
              pts.push([
                interp(xy[e][0], xy[n][0], vs[e], vs[n], L) * VIEW_W / (nx - 1),
                interp(xy[e][1], xy[n][1], vs[e], vs[n], L) * VIEW_H / (ny - 1)
              ]);
            }
          }
          if (pts.length === 2) segs.push([pts[0], pts[1]]);
          else if (pts.length === 4) segs.push([pts[0], pts[1]], [pts[2], pts[3]]);
        }
      }
    }
    return segs;
  }

  function pathsFromSegments(segs) {
    const key = (p) => `${Math.round(p[0] * 2) / 2},${Math.round(p[1] * 2) / 2}`;
    const map = new Map();
    segs.forEach((s, k) => s.forEach((p) => {
      const z = key(p);
      if (!map.has(z)) map.set(z, []);
      map.get(z).push(k);
    }));
    const used = new Set();
    const paths = [];
    for (let si = 0; si < segs.length; si += 1) {
      if (used.has(si)) continue;
      used.add(si);
      const p = [segs[si][0], segs[si][1]];
      for (const side of [1, 0]) {
        while (true) {
          const end = side ? p[p.length - 1] : p[0];
          const cand = (map.get(key(end)) || []).find((idx) => !used.has(idx));
          if (cand === undefined) break;
          const s = segs[cand];
          used.add(cand);
          const nxt = key(s[0]) === key(end) ? s[1] : s[0];
          if (side) p.push(nxt);
          else p.unshift(nxt);
        }
      }
      if (p.length > 3) paths.push(p);
    }
    return paths;
  }

  function strokePaths(ctx, paths, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (const p of paths) {
      ctx.moveTo(p[0][0], p[0][1]);
      if (p.length < 4) {
        for (let i = 1; i < p.length; i += 1) ctx.lineTo(p[i][0], p[i][1]);
        continue;
      }
      for (let i = 1; i < p.length - 1; i += 1) {
        const mx = (p[i][0] + p[i + 1][0]) / 2;
        const my = (p[i][1] + p[i + 1][1]) / 2;
        ctx.quadraticCurveTo(p[i][0], p[i][1], mx, my);
      }
      const last = p[p.length - 1];
      ctx.lineTo(last[0], last[1]);
    }
    ctx.stroke();
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function isCoarsePointer() {
    return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 800;
  }

  function saveDataEnabled() {
    return Boolean(navigator.connection && navigator.connection.saveData);
  }

  function hasCustomHeroImage(el) {
    const value = getComputedStyle(el).getPropertyValue("--hero-background").trim();
    return Boolean(value) && value !== "none";
  }

  function startingTier(el) {
    if (saveDataEnabled()) return 0;
    const hero = el.classList.contains("hero");
    if (isCoarsePointer()) return hero ? 0 : -1;
    return hero ? 2 : 1;
  }

  function FieldCache(nx, ny, seed, centers) {
    this.nx = nx;
    this.ny = ny;
    this.base = Array.from({ length: ny }, (_, j) => Array.from({ length: nx }, (_, i) => (
      staticField(i / (nx - 1), j / (ny - 1), seed, centers)
    )));
  }

  FieldCache.prototype.valuesAt = function (t) {
    const vals = Array.from({ length: this.ny }, () => Array(this.nx));
    for (let j = 0; j < this.ny; j += 1) {
      for (let i = 0; i < this.nx; i += 1) vals[j][i] = timedField(this.base[j][i], t);
    }
    return vals;
  };

  function Surface(el, centers) {
    this.el = el;
    this.centers = centers;
    this.canvas = document.createElement("canvas");
    this.canvas.className = "sea-flow-canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.tier = startingTier(el);
    this.cache = null;
    this.raf = 0;
    this.visible = false;
    this.running = false;
    this.slow = 0;
    this.last = 0;
    this.start = 0;
    this.ro = null;
    this.io = null;
  }

  Surface.prototype.mount = function () {
    if (this.tier < 0 || prefersReducedMotion() || hasCustomHeroImage(this.el) || !this.ctx) return;
    this.el.prepend(this.canvas);
    this.el.classList.add("is-sea-flowing");
    this.rebuild();
    this.ro = new ResizeObserver(() => this.rebuild());
    this.ro.observe(this.el);
    this.io = new IntersectionObserver((entries) => {
      this.visible = entries.some((entry) => entry.isIntersecting);
      if (this.visible) this.play();
      else this.pause();
    }, { rootMargin: "80px" });
    this.io.observe(this.el);
    const rect = this.el.getBoundingClientRect();
    this.visible = rect.bottom > 0 && rect.top < window.innerHeight;
    if (this.visible) this.play();
  };

  Surface.prototype.rebuild = function () {
    if (this.tier < 0) return;
    const rect = this.el.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, this.tier < 2 ? 1 : 1.5);
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    const scale = Math.max(width / VIEW_W, height / VIEW_H);
    const ox = (width - VIEW_W * scale) / 2;
    const oy = (height - VIEW_H * scale) / 2;
    this.ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
    const spec = TIERS[this.tier];
    this.cache = new FieldCache(spec.nx, spec.ny, SEED, this.centers);
  };

  Surface.prototype.draw = function (t) {
    const spec = TIERS[this.tier];
    if (!spec || !this.cache) return;
    const levels = Array.from({ length: spec.density }, (_, i) => -1.7 + i * 3.4 / (spec.density - 1));
    const paths = pathsFromSegments(contours(this.cache.valuesAt(t), spec.nx, spec.ny, levels));
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
    if (spec.shadow) strokePaths(this.ctx, paths, SHADOW, spec.stroke + 4.5);
    strokePaths(this.ctx, paths, STROKE, spec.stroke);
  };

  Surface.prototype.tick = function (now) {
    if (!this.running) return;
    const spec = TIERS[this.tier];
    const minDelta = 1000 / spec.fps;
    if (now - this.last < minDelta) {
      this.raf = requestAnimationFrame((time) => this.tick(time));
      return;
    }
    const frame = now - this.last || minDelta;
    this.last = now;
    this.draw((now - this.start) / 1800);
    if (frame > minDelta * 1.8) this.slow += 1;
    else this.slow = Math.max(0, this.slow - 1);
    if (this.slow > 10) this.degrade();
    this.raf = requestAnimationFrame((time) => this.tick(time));
  };

  Surface.prototype.degrade = function () {
    this.slow = 0;
    if (this.tier > 0) {
      this.tier -= 1;
      this.rebuild();
      return;
    }
    this.stop(true);
  };

  Surface.prototype.play = function () {
    if (this.running || this.tier < 0 || document.hidden || !this.visible) return;
    this.running = true;
    this.start = performance.now() - (this.last ? (this.last - this.start) : 0);
    this.last = 0;
    this.raf = requestAnimationFrame((time) => this.tick(time));
  };

  Surface.prototype.pause = function () {
    this.running = false;
    cancelAnimationFrame(this.raf);
  };

  Surface.prototype.stop = function (fallback) {
    this.pause();
    this.tier = -1;
    this.el.classList.remove("is-sea-flowing");
    if (fallback && this.canvas.parentNode) this.canvas.remove();
    if (this.ro) this.ro.disconnect();
    if (this.io) this.io.disconnect();
  };

  function uniqueSurfaces() {
    return [...new Set([...document.querySelectorAll(SELECTOR)])];
  }

  function boot() {
    if (prefersReducedMotion()) return;
    const centers = makeCenters(SEED);
    const surfaces = uniqueSurfaces()
      .filter((el) => !hasCustomHeroImage(el))
      .map((el) => new Surface(el, centers));
    surfaces.forEach((surface) => surface.mount());
    document.addEventListener("visibilitychange", () => {
      surfaces.forEach((surface) => {
        if (document.hidden) surface.pause();
        else if (surface.visible) surface.play();
      });
    });
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (event) => {
      if (event.matches) surfaces.forEach((surface) => surface.stop(true));
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
