const SOURCE_API = 'https://tcsavant.com/wp-json/wp/v2/courses';
const DEFAULT_TITLE = document.title;
const PAGE_SIZE = 12;

const categoryDefinitions = [
  { slug: 'security', label: 'Security & Safety', description: 'Safety, security, firefighting, survival and emergency-response training.', keywords: ['security', 'safety', 'fire', 'survival', 'rescue', 'lifesaving', 'cyber', 'emergency', 'crowd', 'dangerous goods', 'охорон', 'безпек', 'безопас', 'пожар', 'пожеж', 'спас', 'авар'] },
  { slug: 'medical', label: 'Medical Care', description: 'First aid, medical care and health-related maritime training.', keywords: ['medical', 'medicine', 'first aid', 'медицин', 'медич', 'перша допомога', 'первая помощь'] },
  { slug: 'navigation', label: 'Navigation', description: 'Bridge operations, navigation systems and ship-handling training.', keywords: ['navigation', 'radar', 'arpa', 'bridge', 'compass', 'gmdss', 'helmsman', 'manoeuv', 'навигац', 'навігац', 'радар', 'компас', 'судовожд'] },
  { slug: 'engineering', label: 'Engineering', description: 'Marine engineering, electrical systems and technical maintenance.', keywords: ['engineer', 'engine room', 'engine', 'electrical', 'electrician', 'high voltage', 'machinery', 'maintenance', 'механик', 'механік', 'електр', 'электр', 'двигун', 'двигател'] },
  { slug: 'passenger_ships', label: 'Passenger Ships', description: 'Passenger, cruise and hospitality-focused vessel training.', keywords: ['passenger', 'cruise', 'steward', 'waiter', 'cook', 'пасажир', 'пассажир', 'стюард', 'офіціант', 'официант', 'повар', 'кухар'] },
  { slug: 'tanker_ships', label: 'Tanker Ships', description: 'Tanker, gas carrier and liquid-cargo operations training.', keywords: ['tanker', 'cargo', 'ballast', 'gas carrier', 'chemical', 'oil tanker', 'inert gas', 'tank cleaning', 'танкер', 'вантаж', 'груз', 'баласт', 'балласт', 'газовоз', 'нафтов', 'нефт'] },
  { slug: 'language', label: 'Languages', description: 'Professional and maritime language development.', keywords: ['language', 'english', 'maritime english', 'англ', 'мова', 'язык'] },
  { slug: 'other', label: 'Other', description: 'Additional specialist and professional-development courses.', keywords: [] }
];

const languageNames = { en: 'English', ru: 'Russian', uk: 'Ukrainian' };

const fallbackCourses = [
  ['security', 'Basic Safety Training'],
  ['medical', 'Medical First Aid on Board Ship'],
  ['navigation', 'Radar Navigation and ARPA'],
  ['engineering', 'Marine Engineering Fundamentals'],
  ['passenger_ships', 'Passenger Ship Safety Training'],
  ['tanker_ships', 'Basic Training for Oil and Chemical Tanker Cargo Operations'],
  ['language', 'Maritime English'],
  ['other', 'Professional Competence Development']
].map((course, index) => ({
  id: `placeholder-${index}`,
  slug: `placeholder-${index}`,
  category: course[0],
  title: course[1],
  link: 'https://tcsavant.com/en/page-courses/',
  placeholder: true
}));

const page = {
  menuButton: document.querySelector('.menu-button'),
  navigation: document.querySelector('.desktop-nav'),
  leadForm: document.querySelector('#lead-form'),
  dynamicFields: document.querySelector('#dynamic-fields'),
  formKicker: document.querySelector('#form-kicker'),
  formTitle: document.querySelector('#form-title'),
  formSubmit: document.querySelector('#form-submit'),
  categoryGrid: document.querySelector('#category-grid'),
  sourceStatus: document.querySelector('#source-status'),
  cataloguePage: document.querySelector('#catalogue-page'),
  catalogueTitle: document.querySelector('#catalogue-title'),
  catalogueDescription: document.querySelector('#catalogue-description'),
  catalogueCount: document.querySelector('#catalogue-count'),
  catalogueSourceLabel: document.querySelector('#catalogue-source-label'),
  catalogueBreadcrumbCurrent: document.querySelector('#catalogue-breadcrumb-current'),
  catalogueCategoryNav: document.querySelector('#catalogue-category-nav'),
  catalogueResultsKicker: document.querySelector('#catalogue-results-kicker'),
  catalogueResultsTitle: document.querySelector('#catalogue-results-title'),
  courseResultsGrid: document.querySelector('#course-results-grid'),
  catalogueMore: document.querySelector('#catalogue-more'),
  courseDialog: document.querySelector('#course-dialog'),
  dialogKicker: document.querySelector('#dialog-kicker'),
  dialogTitle: document.querySelector('#dialog-title'),
  dialogBody: document.querySelector('#dialog-body'),
  dialogEnquiry: document.querySelector('#dialog-enquiry'),
  dialogAudience: 'seafarer',
  toast: document.querySelector('.toast')
};

const state = {
  currentLanguage: 'en',
  currentCategory: 'all',
  visibleCount: PAGE_SIZE,
  courses: [],
  sourceMode: 'loading',
  cache: new Map()
};

const formDefinitions = {
  seafarer: {
    kicker: 'Seafarer enquiry',
    title: 'Find suitable training',
    submit: 'Request Training Guidance →',
    fields: [
      ['Full Name', 'text', 'e.g. Alex Martin'],
      ['Email', 'email', 'name@email.com'],
      ['Phone / WhatsApp', 'tel', '+00 ...'],
      ['Country / Region', 'text', 'e.g. Poland'],
      ['Current Rank / Role', 'text', 'e.g. Third Officer'],
      ['Course Interest', 'select', ['Select a course area']],
      ['Preferred Training Location', 'text', 'Country, city or online'],
      ['Message', 'textarea', 'Tell us which certificate or role you are working toward.']
    ]
  },
  provider: {
    kicker: 'Training provider enquiry',
    title: 'Discuss joining the platform',
    submit: 'Become a Training Partner →',
    fields: [
      ['Contact Name', 'text', 'Your full name'],
      ['Training Centre Name', 'text', 'Centre name'],
      ['Email', 'email', 'name@centre.com'],
      ['Phone / WhatsApp', 'tel', '+00 ...'],
      ['Country / Region', 'text', 'Country or region'],
      ['Website', 'url', 'https://'],
      ['Approximate Number of Courses', 'number', 'e.g. 12'],
      ['Message', 'textarea', 'Tell us about your centre and training portfolio.']
    ]
  },
  company: {
    kicker: 'Shipping company enquiry',
    title: 'Discuss crew training',
    submit: 'Discuss Corporate Training →',
    fields: [
      ['Contact Name', 'text', 'Your full name'],
      ['Company', 'text', 'Company name'],
      ['Email', 'email', 'name@company.com'],
      ['Phone / WhatsApp', 'tel', '+00 ...'],
      ['Country / Region', 'text', 'Country or region'],
      ['Approximate Crew Size', 'number', 'e.g. 150'],
      ['Training Requirements', 'text', 'Course areas or certification needs'],
      ['Message', 'textarea', 'Tell us about your crew training priorities.']
    ]
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function decodeHtml(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value || '';
  return textarea.value.trim();
}

function categoryBySlug(slug) {
  return categoryDefinitions.find(category => category.slug === slug);
}

function normalizeCategory(value) {
  if (!value) return null;
  const candidate = Array.isArray(value) ? value[0] : value;
  const raw = typeof candidate === 'object'
    ? candidate.slug || candidate.value || candidate.name || candidate.label
    : candidate;
  if (!raw) return null;
  const normalized = String(raw).toLowerCase().replace(/&/g, 'and').replace(/[\s-]+/g, '_');
  const aliases = {
    security_and_safety: 'security',
    medical_care: 'medical',
    passenger_ships: 'passenger_ships',
    tanker_ships: 'tanker_ships',
    languages: 'language'
  };
  const slug = aliases[normalized] || normalized;
  return categoryBySlug(slug) ? slug : null;
}

function exposedCategory(course) {
  const candidates = [
    course.course_category,
    course.category,
    course.acf && (course.acf.course_category || course.acf.category || course.acf.course_categories),
    course.meta && (course.meta.course_category || course.meta.category)
  ];
  return candidates.map(normalizeCategory).find(Boolean) || null;
}

function inferCategory(title) {
  const normalizedTitle = title.toLocaleLowerCase();
  const ordered = ['language', 'medical', 'passenger_ships', 'tanker_ships', 'engineering', 'security', 'navigation'];
  for (const slug of ordered) {
    const definition = categoryBySlug(slug);
    if (definition.keywords.some(keyword => normalizedTitle.includes(keyword))) return slug;
  }
  return 'other';
}

function sourceFieldsUrl(language) {
  const params = new URLSearchParams({
    per_page: '100',
    lang: language,
    _fields: 'id,slug,link,title,acf,meta,category,course_category'
  });
  return `${SOURCE_API}?${params}`;
}

async function fetchCourses(language) {
  if (state.cache.has(language)) return state.cache.get(language);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(sourceFieldsUrl(language), { signal: controller.signal });
    if (!response.ok) throw new Error(`Course source returned ${response.status}`);
    const sourceCourses = await response.json();
    if (!Array.isArray(sourceCourses) || !sourceCourses.length) throw new Error('Course source is empty');
    const normalized = sourceCourses.map(course => {
      const title = decodeHtml(course.title && course.title.rendered);
      return {
        id: course.id,
        slug: course.slug,
        title: title || 'Course title pending',
        link: course.link || 'https://tcsavant.com/en/page-courses/',
        category: exposedCategory(course) || inferCategory(title),
        placeholder: false
      };
    });
    const result = { courses: normalized, sourceMode: 'live' };
    state.cache.set(language, result);
    return result;
  } catch (error) {
    console.warn('The live course source is unavailable; prototype placeholders are being used.', error);
    return { courses: fallbackCourses, sourceMode: 'fallback' };
  } finally {
    clearTimeout(timeout);
  }
}

function categoryCount(slug) {
  return state.courses.filter(course => course.category === slug).length;
}

function renderSourceStatus() {
  const live = state.sourceMode === 'live';
  page.sourceStatus.classList.toggle('is-live', live);
  page.sourceStatus.classList.toggle('is-fallback', !live);
  page.sourceStatus.innerHTML = `<span class="status-dot"></span><span>${live
    ? `Live catalogue source · ${state.courses.length} courses · tcsavant.com · ${escapeHtml(languageNames[state.currentLanguage])}`
    : 'Catalogue source unavailable · prototype placeholders shown'}</span>`;
}

function renderLandingCategories() {
  page.categoryGrid.innerHTML = categoryDefinitions.map((category, index) => {
    const count = categoryCount(category.slug);
    return `
      <button class="category-card" type="button" data-category="${category.slug}">
        <span class="category-number">${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHtml(category.label)}</strong>
        <small>${count} course${count === 1 ? '' : 's'}</small>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </button>`;
  }).join('');
  page.categoryGrid.setAttribute('aria-busy', 'false');
  renderSourceStatus();
}

function fieldMarkup([label, type, content], index) {
  const id = `lead-field-${index}`;
  const safeLabel = escapeHtml(label);
  const fullClass = type === 'textarea' ? ' field-full' : '';
  if (type === 'select') {
    const options = content.map((option, optionIndex) =>
      `<option value="${optionIndex ? escapeHtml(option) : ''}" ${optionIndex ? '' : 'disabled selected'}>${escapeHtml(option)}</option>`
    ).join('');
    return `<label class="field${fullClass}" for="${id}"><span>${safeLabel}</span><select id="${id}" name="${safeLabel}" required>${options}</select></label>`;
  }
  if (type === 'textarea') {
    return `<label class="field${fullClass}" for="${id}"><span>${safeLabel}</span><textarea id="${id}" name="${safeLabel}" rows="4" placeholder="${escapeHtml(content)}" required></textarea></label>`;
  }
  return `<label class="field${fullClass}" for="${id}"><span>${safeLabel}</span><input id="${id}" name="${safeLabel}" type="${type}" placeholder="${escapeHtml(content)}" required></label>`;
}

function renderForm(audience = 'seafarer') {
  const definition = formDefinitions[audience];
  const fields = definition.fields.map(field => {
    if (audience === 'seafarer' && field[0] === 'Course Interest') {
      return [field[0], field[1], ['Select a course area', ...categoryDefinitions.map(category => category.label)]];
    }
    return field;
  });
  page.formKicker.textContent = definition.kicker;
  page.formTitle.textContent = definition.title;
  page.formSubmit.textContent = definition.submit;
  const indexedFields = fields.map((field, index) => ({ field, index }));
  const regularFields = indexedFields.filter(item => item.field[1] !== 'textarea');
  const fullFields = indexedFields.filter(item => item.field[1] === 'textarea');
  page.dynamicFields.innerHTML = `<div class="form-grid">${regularFields.map(item => fieldMarkup(item.field, item.index)).join('')}</div>${fullFields.map(item => fieldMarkup(item.field, item.index)).join('')}`;
  document.querySelectorAll('[data-form-audience]').forEach(button => {
    const active = button.dataset.formAudience === audience;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  page.leadForm.dataset.formState = audience;
}

function filteredCourses() {
  return state.currentCategory === 'all'
    ? state.courses
    : state.courses.filter(course => course.category === state.currentCategory);
}

function catalogueDefinition() {
  return state.currentCategory === 'all'
    ? { label: 'All Training', description: 'Explore the complete prototype course catalogue sourced from tcsavant.com.' }
    : categoryBySlug(state.currentCategory);
}

function renderCatalogue() {
  const definition = catalogueDefinition();
  const results = filteredCourses();
  const visible = results.slice(0, state.visibleCount);
  const liveLabel = state.sourceMode === 'live' ? 'LIVE SOURCE' : 'PLACEHOLDER DATA';
  page.catalogueTitle.textContent = definition.label;
  page.catalogueDescription.textContent = definition.description;
  page.catalogueCount.textContent = `${results.length} course${results.length === 1 ? '' : 's'}`;
  page.catalogueSourceLabel.textContent = `${liveLabel} · ${languageNames[state.currentLanguage]} · TCSAVANT.COM`;
  page.catalogueBreadcrumbCurrent.textContent = definition.label;
  page.catalogueResultsKicker.textContent = `${definition.label.toUpperCase()} · ${languageNames[state.currentLanguage].toUpperCase()}`;
  page.catalogueResultsTitle.textContent = results.length ? 'Available course titles' : 'Courses are being mapped';
  page.catalogueCategoryNav.innerHTML = `
    <button type="button" data-catalogue-category="all" class="catalogue-category-button ${state.currentCategory === 'all' ? 'active' : ''}"><span>All Training</span><small>${state.courses.length}</small></button>
    ${categoryDefinitions.map(category => `
      <button type="button" data-catalogue-category="${category.slug}" class="catalogue-category-button ${state.currentCategory === category.slug ? 'active' : ''}">
        <span>${escapeHtml(category.label)}</span><small>${categoryCount(category.slug)}</small>
      </button>`).join('')}`;
  page.courseResultsGrid.innerHTML = visible.length ? visible.map((course, index) => {
    const category = categoryBySlug(course.category) || categoryBySlug('other');
    return `<article class="catalogue-course-card">
      <div class="course-card-topline"><span>${course.placeholder ? 'PROTOTYPE COURSE' : 'TCSAVANT.COM SOURCE'}</span><span>${String(index + 1).padStart(2, '0')}</span></div>
      <h3>${escapeHtml(course.title)}</h3>
      <p>Course details, delivery options and provider availability will be mapped into the future marketplace.</p>
      <div class="catalogue-course-meta"><span>Category<strong>${escapeHtml(category.label)}</strong></span><span>Source language<strong>${escapeHtml(languageNames[state.currentLanguage])}</strong></span></div>
      <div class="catalogue-course-actions">
        <a href="${escapeHtml(course.link)}" target="_blank" rel="noopener">Source details ↗</a>
        <button type="button" data-course-enquire="${escapeHtml(course.title)}" data-course-category="${course.category}">Request guidance</button>
      </div>
    </article>`;
  }).join('') : '<div class="catalogue-empty"><strong>No matched courses yet.</strong><p>This category remains visible because it is part of the source catalogue structure. Titles will appear when the public data exposes or matches them.</p></div>';
  page.catalogueMore.hidden = state.visibleCount >= results.length;
  page.catalogueMore.textContent = `Show more courses (${Math.max(0, results.length - state.visibleCount)})`;
  document.title = `${definition.label} Courses — Maritime Training Platform`;
}

function routeForCategory(slug) {
  return `#courses/${encodeURIComponent(slug)}`;
}

function openCatalogue(slug = 'all', updateHistory = true) {
  state.currentCategory = slug === 'all' || categoryBySlug(slug) ? slug : 'all';
  state.visibleCount = PAGE_SIZE;
  page.cataloguePage.hidden = false;
  document.body.classList.add('catalogue-open');
  renderCatalogue();
  if (updateHistory) history.pushState({ view: 'catalogue', category: state.currentCategory }, '', routeForCategory(state.currentCategory));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeCatalogue(updateHistory = true, targetHash = 'courses') {
  page.cataloguePage.hidden = true;
  document.body.classList.remove('catalogue-open');
  document.title = DEFAULT_TITLE;
  if (updateHistory) history.pushState({ view: 'landing' }, '', `${location.pathname}${location.search}#${targetHash}`);
}

function scrollToSection(id) {
  if (document.body.classList.contains('catalogue-open')) closeCatalogue(true, id);
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  page.navigation.classList.remove('mobile-open');
  page.menuButton.setAttribute('aria-expanded', 'false');
}

function selectAudience(audience, shouldScroll = true, categorySlug = '') {
  renderForm(audience);
  if (shouldScroll) scrollToSection('contact');
  if (audience === 'seafarer' && categorySlug) {
    const select = page.dynamicFields.querySelector('select');
    const category = categoryBySlug(categorySlug);
    if (select && category) select.value = category.label;
  }
}

let toastTimer;
function showToast(message) {
  page.toast.textContent = message;
  page.toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => page.toast.classList.remove('visible'), 3000);
}

async function setLanguage(language, showConfirmation = true) {
  if (!languageNames[language]) return;
  state.currentLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-language]').forEach(button => {
    const active = button.dataset.language === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  page.categoryGrid.setAttribute('aria-busy', 'true');
  page.sourceStatus.innerHTML = '<span class="status-dot"></span><span>Loading course titles from tcsavant.com…</span>';
  const result = await fetchCourses(language);
  if (state.currentLanguage !== language) return;
  state.courses = result.courses;
  state.sourceMode = result.sourceMode;
  renderLandingCategories();
  if (document.body.classList.contains('catalogue-open')) renderCatalogue();
  if (showConfirmation) showToast(`${languageNames[language]} course catalogue loaded.`);
}

function applyLocationRoute() {
  const match = location.hash.match(/^#courses\/([^/?#]+)/);
  if (match) openCatalogue(decodeURIComponent(match[1]), false);
  else if (document.body.classList.contains('catalogue-open')) closeCatalogue(false);
}

document.addEventListener('click', event => {
  const scrollControl = event.target.closest('[data-scroll]');
  if (scrollControl) scrollToSection(scrollControl.dataset.scroll);
  const audienceControl = event.target.closest('[data-audience]');
  if (audienceControl) selectAudience(audienceControl.dataset.audience);
  const formAudienceControl = event.target.closest('[data-form-audience]');
  if (formAudienceControl) renderForm(formAudienceControl.dataset.formAudience);
  const categoryControl = event.target.closest('[data-category]');
  if (categoryControl) openCatalogue(categoryControl.dataset.category);
  const catalogueCategory = event.target.closest('[data-catalogue-category]');
  if (catalogueCategory) openCatalogue(catalogueCategory.dataset.catalogueCategory);
  if (event.target.closest('[data-catalogue-home]')) {
    closeCatalogue(true, 'hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (event.target.closest('[data-catalogue-close]')) scrollToSection('courses');
  if (event.target.closest('[data-catalogue-all]')) openCatalogue('all');
  const courseEnquiry = event.target.closest('[data-course-enquire]');
  if (courseEnquiry) selectAudience('seafarer', true, courseEnquiry.dataset.courseCategory);
  const providerControl = event.target.closest('[data-provider]');
  if (providerControl) {
    page.dialogKicker.textContent = 'EDUCATIONAL PROVIDER · PROFILE CONCEPT';
    page.dialogTitle.textContent = providerControl.dataset.provider;
    page.dialogBody.textContent = 'This placeholder demonstrates how a future provider profile may present specialisms, delivery formats and planned courses. No provider partnership or course availability is implied.';
    page.dialogEnquiry.textContent = 'Discuss Provider Partnership →';
    page.dialogAudience = 'provider';
    page.courseDialog.showModal();
  }
  if (event.target.closest('[data-close-dialog]')) page.courseDialog.close();
  if (event.target.closest('[data-dialog-enquiry]')) {
    page.courseDialog.close();
    selectAudience(page.dialogAudience);
  }
  const languageControl = event.target.closest('[data-language]');
  if (languageControl) setLanguage(languageControl.dataset.language);
  if (event.target.closest('#catalogue-more')) {
    state.visibleCount += PAGE_SIZE;
    renderCatalogue();
  }
});

document.querySelectorAll('.audience-card').forEach(card => {
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectAudience(card.dataset.audience);
    }
  });
});

document.querySelectorAll('.provider-directory-card').forEach(card => {
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      card.querySelector('[data-provider]').click();
    }
  });
});

page.menuButton.addEventListener('click', () => {
  const open = !page.navigation.classList.contains('mobile-open');
  page.navigation.classList.toggle('mobile-open', open);
  page.menuButton.setAttribute('aria-expanded', String(open));
});

page.leadForm.addEventListener('submit', event => {
  event.preventDefault();
  const definition = formDefinitions[page.leadForm.dataset.formState || 'seafarer'];
  page.leadForm.innerHTML = `<div class="success-panel"><div class="success-mark">✓</div><h3>Prototype enquiry complete</h3><p>Your ${escapeHtml(definition.kicker.toLowerCase())} has been demonstrated successfully. No information has been sent or stored.</p><button class="button button-light" type="button" data-restart-form>Start another enquiry</button></div>`;
  page.leadForm.querySelector('[data-restart-form]').addEventListener('click', () => location.reload());
});

const observedSections = ['courses', 'education-providers', 'companies', 'about']
  .map(id => document.getElementById(id))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    document.querySelectorAll('.desktop-nav [data-scroll]').forEach(button => {
      button.classList.toggle('active', button.dataset.scroll === visible.target.id);
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .2, .5] });
  observedSections.forEach(section => observer.observe(section));
}

window.addEventListener('popstate', applyLocationRoute);
renderForm('seafarer');
setLanguage('en', false).then(applyLocationRoute);
