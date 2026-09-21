(function () {
  const hero = document.querySelector('.hero.pattern-background');
  if (!hero) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
  const frameInterval = 32;

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
    hero.style.setProperty('--signal-x', x + 'px');
    hero.style.setProperty('--signal-y', y + 'px');
  }

  function updateSignal(time) {
    if (!lastFrame) lastFrame = time;

    if (reducedMotion.matches) {
      lastFrame = time;
      requestAnimationFrame(updateSignal);
      return;
    }

    const heroRect = hero.getBoundingClientRect();
    const heroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    if (!heroVisible || time - lastPaint < frameInterval) {
      requestAnimationFrame(updateSignal);
      return;
    }

    const deltaSec = Math.min(.05, Math.max(.001, (time - lastFrame) / 1000));
    lastFrame = time;
    lastPaint = time;

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
    applySignal(trajectory.x, trajectory.y);
    requestAnimationFrame(updateSignal);
  }

  const initialRect = hero.getBoundingClientRect();
  const initialPoint = getTrajectoryPoint(0, initialRect.width, initialRect.height);
  applySignal(initialPoint.x, initialPoint.y);
  requestAnimationFrame(updateSignal);
})();
