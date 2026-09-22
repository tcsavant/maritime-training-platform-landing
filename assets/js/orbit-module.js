(function () {
  const SOURCE = "assets/auvenida/module.svg";
  const sections = [...document.querySelectorAll(".journey.orbit-pattern")];
  if (!sections.length) return;

  fetch(SOURCE)
    .then((response) => response.text())
    .then((markup) => {
      const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
      const sourceSvg = parsed.documentElement;
      if (!sourceSvg || sourceSvg.nodeName.toLowerCase() !== "svg") return;

      sections.forEach((section) => {
        const container = section.querySelector(":scope > .container");
        if (!container || container.querySelector(":scope > .orbit-graphic")) return;
        const graphic = document.createElement("div");
        graphic.className = "orbit-graphic";
        graphic.setAttribute("aria-hidden", "true");
        const svg = document.importNode(sourceSvg, true);
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.querySelectorAll("path").forEach((path) => {
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", "currentColor");
        });
        graphic.appendChild(svg);
        container.insertBefore(graphic, container.firstChild);
      });
    })
    .catch(() => {});
})();
