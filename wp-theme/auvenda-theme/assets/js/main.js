document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.primary-menu');
  if (menuToggle && menu) menuToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menu.classList.toggle('mobile-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('mobile-menu-open', open);
  });

  const language = document.querySelector('.language-switcher');
  const languageToggle = document.querySelector('.language-toggle');
  if (language && languageToggle) languageToggle.addEventListener('click', () => {
    const open = language.classList.toggle('is-open');
    languageToggle.setAttribute('aria-expanded', String(open));
  });

  const filter = document.querySelector('.catalogue-filter');
  const filterToggle = document.querySelector('.catalogue-filter-toggle');
  if (filter && filterToggle) {
    filterToggle.addEventListener('click', () => {
      const open = filter.classList.toggle('is-open');
      filterToggle.setAttribute('aria-expanded', String(open));
    });
    filter.querySelectorAll('.catalogue-category-button').forEach(link => link.addEventListener('click', () => {
      filter.classList.remove('is-open');
      filterToggle.setAttribute('aria-expanded', 'false');
    }));
  }
});
