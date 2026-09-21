(function () {
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)');
  const NARROW = window.matchMedia('(max-width:900px)');
  const SRC = 'assets/auvenida/pattern.svg';

  function applyFit(svg) {
    svg.setAttribute('preserveAspectRatio', NARROW.matches ? 'none' : 'xMidYMid slice');
  }

  function mountFlow(hero, svg) {
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('hero-pattern-svg');
    applyFit(svg);

    svg.querySelectorAll('path').forEach((path, index) => {
      const line = path.cloneNode();
      line.removeAttribute('fill');
      line.removeAttribute('fill-opacity');
      line.removeAttribute('style');
      line.setAttribute('class', 'hero-flow-core hero-flow-line--' + index);
      path.parentNode.appendChild(line);

      if (index === 0) {
        const glow = path.cloneNode();
        glow.removeAttribute('fill');
        glow.removeAttribute('fill-opacity');
        glow.removeAttribute('style');
        glow.setAttribute('class', 'hero-flow-glow hero-flow-line--' + index);
        path.parentNode.insertBefore(glow, line);
      }
    });

    const wrap = document.createElement('div');
    wrap.className = 'hero-pattern-flow';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.appendChild(svg);
    hero.prepend(wrap);
    NARROW.addEventListener('change', () => applyFit(svg));
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => hero.classList.add('hero-effects-ready'));
    });
  }

  function start() {
    const hero = document.querySelector('.hero.pattern-background');
    if (!hero || REDUCE.matches) return;

    window.fetch(SRC).then((response) => {
      if (!response.ok) throw new Error('pattern missing');
      return response.text();
    }).then((markup) => {
      const parsed = new DOMParser().parseFromString(markup, 'image/svg+xml');
      const svg = parsed.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== 'svg') return;
      mountFlow(hero, document.importNode(svg, true));
    }).catch(() => {});
  }

  if (document.readyState === 'complete') window.setTimeout(start, 400);
  else window.addEventListener('load', () => window.setTimeout(start, 400), { once: true });
})();
