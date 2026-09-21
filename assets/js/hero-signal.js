(function () {
  const hero = document.querySelector('.hero.pattern-background');
  if (!hero) return;

  const cursorToggle = document.querySelector('.cursor-toggle');
  const cursorOrb = document.querySelector('.cursor-orb');
  const cursorOrbShape = cursorOrb ? cursorOrb.querySelector('.cursor-orb-shape') : null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const trajectoryPoints = [
    [.10, .13],
    [.105, .22],
    [.115, .34],
    [.135, .45],
    [.165, .54],
    [.22, .61],
    [.29, .69],
    [.36, .74],
    [.45, .735],
    [.54, .74],
    [.62, .755],
    [.68, .73],
    [.73, .67],
    [.775, .60],
    [.81, .52],
    [.835, .43],
    [.855, .34],
    [.875, .25],
    [.89, .18]
  ];
  const speed = 330;

  let cursorMode = false;
  let pointerInside = false;
  let targetPointerX = window.innerWidth * .5;
  let targetPointerY = window.innerHeight * .5;
  let jellyX = targetPointerX;
  let jellyY = targetPointerY;
  let signalX = 0;
  let signalY = 0;
  let lastPaint = 0;
  let lastFrame = 0;
  let pathDistance = 0;
  let pathDirection = 1;
  let trajectoryCache = null;

  function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return [
      .5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
      .5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
    ];
  }

  function buildTrajectory(width, height) {
    const samples = [];
    const steps = 24;
    let total = 0;
    let previous = null;

    for (let i = 0; i < trajectoryPoints.length - 1; i++) {
      const p0 = trajectoryPoints[Math.max(0, i - 1)];
      const p1 = trajectoryPoints[i];
      const p2 = trajectoryPoints[i + 1];
      const p3 = trajectoryPoints[Math.min(trajectoryPoints.length - 1, i + 2)];

      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const point = catmullRom(p0, p1, p2, p3, t);
        const x = Math.max(width * .05, Math.min(width * .95, point[0] * width));
        const y = Math.max(height * .05, Math.min(height * .95, point[1] * height));

        if (previous) total += Math.hypot(x - previous.x, y - previous.y);
        const sample = { x, y, d: total };
        samples.push(sample);
        previous = sample;
      }
    }

    const last = trajectoryPoints[trajectoryPoints.length - 1];
    const lastX = Math.max(width * .05, Math.min(width * .95, last[0] * width));
    const lastY = Math.max(height * .05, Math.min(height * .95, last[1] * height));
    total += Math.hypot(lastX - previous.x, lastY - previous.y);
    samples.push({ x: lastX, y: lastY, d: total });

    return { width, height, total, samples };
  }

  function getTrajectoryPoint(distance, width, height) {
    if (!trajectoryCache || trajectoryCache.width !== width || trajectoryCache.height !== height) {
      trajectoryCache = buildTrajectory(width, height);
      pathDistance = Math.max(0, Math.min(pathDistance, trajectoryCache.total));
    }

    const total = trajectoryCache.total;
    const d = Math.max(0, Math.min(distance, total));
    const samples = trajectoryCache.samples;
    let low = 0;
    let high = samples.length - 1;

    while (low < high) {
      const mid = (low + high) >> 1;
      if (samples[mid].d < d) low = mid + 1;
      else high = mid;
    }

    const next = samples[Math.max(1, low)];
    const prev = samples[Math.max(0, low - 1)];
    const span = Math.max(.0001, next.d - prev.d);
    const mix = (d - prev.d) / span;

    return {
      x: prev.x + (next.x - prev.x) * mix,
      y: prev.y + (next.y - prev.y) * mix
    };
  }

  function applySignal(x, y) {
    signalX = x;
    signalY = y;
    hero.style.setProperty('--signal-x', signalX + 'px');
    hero.style.setProperty('--signal-y', signalY + 'px');
  }

  function setCursorMode(enabled) {
    cursorMode = enabled && finePointer.matches && !reducedMotion.matches;
    document.body.classList.toggle('cursor-glow-enabled', cursorMode);
    if (!cursorToggle) return;
    cursorToggle.setAttribute('aria-pressed', String(cursorMode));
    cursorToggle.setAttribute('aria-label', cursorMode ? 'Disable cursor glow' : 'Enable cursor glow');
    cursorToggle.textContent = cursorMode ? 'Auto glow' : 'Cursor glow';
    if (!cursorOrb) return;
    if (!cursorMode) cursorOrb.classList.remove('is-visible');
    else if (pointerInside) cursorOrb.classList.add('is-visible');
  }

  if (cursorToggle) {
    cursorToggle.addEventListener('click', () => setCursorMode(!cursorMode));
  }

  hero.addEventListener('pointerenter', (event) => {
    pointerInside = true;
    targetPointerX = event.clientX;
    targetPointerY = event.clientY;
    if (cursorMode && cursorOrb) cursorOrb.classList.add('is-visible');
  });

  hero.addEventListener('pointermove', (event) => {
    pointerInside = true;
    targetPointerX = event.clientX;
    targetPointerY = event.clientY;
    if (cursorMode && cursorOrb) cursorOrb.classList.add('is-visible');
  });

  hero.addEventListener('pointerleave', () => {
    pointerInside = false;
    if (cursorOrb) cursorOrb.classList.remove('is-visible');
  });

  function updateSignal(time) {
    if (!lastFrame) lastFrame = time;

    if (reducedMotion.matches) {
      lastFrame = time;
      requestAnimationFrame(updateSignal);
      return;
    }

    const heroRect = hero.getBoundingClientRect();
    const frameInterval = cursorMode ? 16 : 32;
    const heroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    if (!heroVisible || time - lastPaint < frameInterval) {
      requestAnimationFrame(updateSignal);
      return;
    }

    const deltaSec = Math.min(.05, Math.max(.001, (time - lastFrame) / 1000));
    lastFrame = time;
    lastPaint = time;
    let targetX;
    let targetY;

    if (cursorMode && pointerInside) {
      targetX = Math.max(0, Math.min(heroRect.width, targetPointerX - heroRect.left));
      targetY = Math.max(0, Math.min(heroRect.height, targetPointerY - heroRect.top));
    } else {
      getTrajectoryPoint(pathDistance, heroRect.width, heroRect.height);
      pathDistance += speed * deltaSec * pathDirection;
      const total = trajectoryCache.total;

      if (pathDistance >= total) {
        pathDistance = total - (pathDistance - total);
        if (pathDistance < 0) pathDistance = 0;
        pathDirection = -1;
      } else if (pathDistance <= 0) {
        pathDistance = -pathDistance;
        pathDirection = 1;
      }

      const trajectory = getTrajectoryPoint(pathDistance, heroRect.width, heroRect.height);
      targetX = trajectory.x;
      targetY = trajectory.y;
    }

    if (cursorMode) {
      applySignal(signalX + (targetX - signalX) * .095, signalY + (targetY - signalY) * .095);
    } else {
      applySignal(targetX, targetY);
    }

    if (cursorMode && pointerInside && cursorOrb && cursorOrbShape) {
      jellyX += (targetPointerX - jellyX) * .11;
      jellyY += (targetPointerY - jellyY) * .11;

      const dx = targetPointerX - jellyX;
      const dy = targetPointerY - jellyY;
      const cursorSpeed = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const stretch = Math.min(1.26, 1 + cursorSpeed * .009);
      const squash = Math.max(.82, 1 - cursorSpeed * .0045);
      const directionX = cursorSpeed ? dx / cursorSpeed : 0;
      const directionY = cursorSpeed ? dy / cursorSpeed : 0;
      const inertia = Math.min(10, cursorSpeed * .16);
      const shiftX = -directionX * inertia;
      const shiftY = -directionY * inertia;

      cursorOrb.style.transform = 'translate3d(' + (jellyX - 36) + 'px,' + (jellyY - 36) + 'px,0)';
      cursorOrbShape.style.setProperty('--orb-shift-x', shiftX + 'px');
      cursorOrbShape.style.setProperty('--orb-shift-y', shiftY + 'px');
      cursorOrbShape.style.transform = 'translate(calc(-50% + ' + shiftX + 'px),calc(-50% + ' + shiftY + 'px)) rotate(' + angle + 'deg) scale(' + stretch + ',' + squash + ')';
    }

    requestAnimationFrame(updateSignal);
  }

  finePointer.addEventListener('change', () => setCursorMode(cursorMode));
  reducedMotion.addEventListener('change', () => setCursorMode(cursorMode));

  setCursorMode(false);
  const initialRect = hero.getBoundingClientRect();
  const initialPoint = getTrajectoryPoint(0, initialRect.width, initialRect.height);
  applySignal(initialPoint.x, initialPoint.y);
  requestAnimationFrame(updateSignal);
})();
