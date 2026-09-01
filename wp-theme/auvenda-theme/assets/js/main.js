document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.primary-menu');
  let mobileMenuScrollPosition = 0;
  if (menuToggle && menu) menuToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menu.classList.toggle('mobile-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('mobile-menu-open', open);
    if (open) {
      mobileMenuScrollPosition = window.scrollY;
      document.body.style.top = `-${mobileMenuScrollPosition}px`;
    } else {
      document.body.style.top = '';
      window.scrollTo(0, mobileMenuScrollPosition);
    }
  });
  if (menu) menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open', 'mobile-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-menu-open');
    document.body.style.top = '';
    window.scrollTo(0, mobileMenuScrollPosition);
  }));

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
