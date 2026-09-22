(function () {
  const SOURCE = "assets/auvenida/module.svg";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sections = [...document.querySelectorAll(".orbit-pattern")];
  if (!sections.length) return;

  const viewCenter = { x: 125.095, y: 125.725 };

  function wrapRings(svg) {
    const ns = "http://www.w3.org/2000/svg";
    const paths = [...svg.querySelectorAll("path")];
    paths.forEach((path, index) => {
      const group = document.createElementNS(ns, "g");
      group.classList.add("orbit-ring");
      group.style.setProperty("--i", String(index));
      group.setAttribute("transform-origin", `${viewCenter.x} ${viewCenter.y}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.parentNode.insertBefore(group, path);
      group.appendChild(path);
    });
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
  }

  function inflate(rect, gap) {
    return {
      left: rect.left - gap,
      right: rect.right + gap,
      top: rect.top - gap,
      bottom: rect.bottom + gap
    };
  }

  function overlap(a, b) {
    const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return { x, y, hits: x > 0 && y > 0 };
  }

  function contentBoxes(section) {
    const container = section.querySelector(":scope > .container");
    if (!container) return [];
    return [...container.children]
      .map((el) => el.getBoundingClientRect())
      .filter((rect) => rect.width > 8 && rect.height > 8);
  }

  function applyClearance(section) {
    const graphic = section.querySelector(":scope > .orbit-graphic");
    if (!graphic) return;

    graphic.style.translate = "0px 0px";
    const gap = parseFloat(getComputedStyle(section).getPropertyValue("--orbit-clearance")) || 72;
    const boxes = contentBoxes(section);
    const sectionBox = section.getBoundingClientRect();
    const raw = graphic.getBoundingClientRect();
    const minVisible = Math.min(raw.width, raw.height) * 0.42;
    let dx = 0;
    let dy = 0;

    for (let step = 0; step < 8; step += 1) {
      const g = {
        left: raw.left + dx,
        right: raw.right + dx,
        top: raw.top + dy,
        bottom: raw.bottom + dy
      };
      let moved = false;

      boxes.forEach((box) => {
        const hit = overlap(g, inflate(box, gap));
        if (!hit.hits) return;
        dy -= hit.y;
        g.top -= hit.y;
        g.bottom -= hit.y;
        moved = true;
      });

      if (!moved) break;
    }

    const maxDx = sectionBox.right - minVisible - raw.left;
    const minDy = sectionBox.top + minVisible - raw.bottom;
    dx = Math.min(Math.max(0, dx), Math.max(0, maxDx));
    dy = Math.max(dy, Math.min(0, minDy));
    graphic.style.translate = `${Math.round(dx)}px ${Math.round(dy)}px`;
  }

  function watchVisibility(graphic) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-in-view", entry.isIntersecting && !reducedMotion.matches);
      });
    }, { rootMargin: "12% 0px", threshold: 0.12 });
    io.observe(graphic);
  }

  function layoutAll() {
    sections.forEach(applyClearance);
  }

  fetch(SOURCE)
    .then((response) => response.text())
    .then((markup) => {
      const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
      const sourceSvg = parsed.documentElement;
      if (!sourceSvg || sourceSvg.nodeName.toLowerCase() !== "svg") return;

      sections.forEach((section) => {
        if (section.querySelector(":scope > .orbit-graphic")) return;
        const graphic = document.createElement("div");
        graphic.className = "orbit-graphic";
        graphic.setAttribute("aria-hidden", "true");
        const svg = document.importNode(sourceSvg, true);
        wrapRings(svg);
        graphic.appendChild(svg);
        section.insertBefore(graphic, section.firstChild);
        watchVisibility(graphic);
      });

      layoutAll();
    })
    .catch(() => {});

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layoutAll, 80);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layoutAll).catch(() => {});
  }
  reducedMotion.addEventListener("change", layoutAll);
})();
