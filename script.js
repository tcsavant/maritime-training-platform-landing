const SOURCE_API = 'https://tcsavant.com/wp-json/wp/v2/courses';
const DEFAULT_TITLE = document.title;
const PAGE_SIZE = 12;

const directionDefinitions = [
  {
    slug: 'officers_navigation',
    label: 'Training for Officers (Deck)',
    labels: { ru: 'Подготовка для лиц командного состава судна (Судоводители)', uk: 'Підготовка для командного складу судна (Судноводії)' },
    description: 'Professional training for deck officers and navigation watch personnel.',
    sourceSlugs: 'ship-security-officer designated-security-duties-of-shipboard-personnel security-awarness-training advanced-fire-fighting medical-first-aid-on-board-ship training-for-proficiency-in-survival-craft-and-rescue-boats-other-than-fast-rescue-boats medical-care-on-board-ship radar-navigation-arpa-bridge-teamwork-and-search-and-rescue-management-level safety-familiarization-basic-training-and-instruction ship-safety-officer-sso global-maritime-distress-and-safety-system-restricted-operators-certificate-gmdss-roc training-and-refresh-training-of-gmdss-operators-general-operators-certificate radar-navigation-radar-plotting-and-use-of-arpa-operational-level ship-handling-and-maneuvering-shm bridge-resource-management-management-level-operational-level okazanie-pervoy-meditsinskoy-pomoschi-na-bortu-sudna meditsinskiy-uhod-na-bortu-sudna radarnaya-navigatsiya-sarp-komandnaya-rabota-na-mostike-poisk-i-spasenie-uroven-upravleniya ofitser-po-bezopasnosti-sudna globalnaya-morskaya-sistema-svyazi-pri-bedstvii-gmssb-ogranichennyy-diplom-operatora operator-gmssb-dlya-polucheniya-ili-podtverzhdeniya-obschego-diploma sudovozhdenie-s-ispolzovaniem-radiolokatora-radiolokatsionnoy-prokladki-i-ispolzovaniem-arpa-uroven-ekspluatatsii upravlenie-sostavom-navigatsionnoy-vahty-na-mostike-uroven-upravleniya-i-ekspluatatsii medychnyy-doglyad-na-bortu-sudna sudnovodinnya-z-vykorystannyam-radiolokatora-zarp-robota-v-komandi-na-mistku-ta-poshuk-i-poryatunok-riven-upravlinnya nadannya-pershoy-medichnoy-dopomogy ofitser-z-bezpeky-sudna hlobalna-morska-systema-zvyazku-pid-chas-lykha-ta-dlya-zabezpechennya-bezpeky-moreplavstva-hmzlb-obmezhenyy-dyplom-operatora operator-gmzlb-na-otrymannya-abo-pidtverdzhennya-zagalnogo-dyplomu sudnovodinnya-z-vykorystannyam-radiolokatora-radiolokatsiynoyi-prokladky-ta-vykorystannyam-zarp-riven-ekspluatatsiyi upravlinnya-skladom-navigatsiynoy-vahty-na-mistku-riven-upravlinnya-i-ekspluatatsiyi'.split(' ')
  },
  {
    slug: 'officers_engineers',
    label: 'Training for Officers (Engine)',
    labels: { ru: 'Подготовка для лиц командного состава судна (Механики)', uk: 'Підготовка для командного складу судна (Механіки)' },
    description: 'Professional training for engineering officers and engine-room watch personnel.',
    sourceSlugs: 'operation-and-maintenance-of-electrical-systems-with-voltage-over-1000-volts ship-security-officer designated-security-duties-of-shipboard-personnel security-awarness-training advanced-fire-fighting medical-first-aid-on-board-ship training-for-proficiency-in-survival-craft-and-rescue-boats-other-than-fast-rescue-boats medical-care-on-board-ship safety-familiarization-basic-training-and-instruction engine-room okazanie-pervoy-meditsinskoy-pomoschi-na-bortu-sudna meditsinskiy-uhod-na-bortu-sudna medychnyy-doglyad-na-bortu-sudna nadannya-pershoy-medichnoy-dopomogy ekspluatacziya-ta-obslugovuvannya-elektrychnyh-system-s-naprugoyu-ponad-1000-volt'.split(' ')
  },
  {
    slug: 'ratings',
    label: 'Training for Ratings',
    labels: { ru: 'Подготовка для рядового состава судна', uk: 'Підготовка для рядового складу судна' },
    description: 'Core safety and professional training for vessel ratings.',
    sourceSlugs: 'designated-security-duties-of-shipboard-personnel security-awarness-training advanced-fire-fighting medical-first-aid-on-board-ship training-for-proficiency-in-survival-craft-and-rescue-boats-other-than-fast-rescue-boats safety-familiarization-basic-training-and-instruction okazanie-pervoy-meditsinskoy-pomoschi-na-bortu-sudna zalyshannya-potopayuchogo-gelikoptera nadannya-pershoy-medichnoy-dopomogy'.split(' ')
  },
  {
    slug: 'ship_types',
    label: 'Special training for certain types of ships',
    labels: { ru: 'Специальная подготовка для определенных типов судов', uk: 'Спеціальна підготовка за певними типами суден' },
    description: 'Specialised preparation for tanker, gas carrier, polar and dangerous-goods operations.',
    sourceSlugs: 'advanced-training-for-ships-operating-in-polar-waters liquefied-gas-tanker-cargo-operation chemical-tanker-cargo-operations-advanced-level-atct-atctco-chemco basic-training-polar-waters advanced-training-igf-code basic-training-igf-code liquefied-gas-tanker-cargo-operations-advanced-level-gasco-atlgtco oil-tanker-cargo-operations-advanced-level-atctco-tasco basic-training-tankr-operations cargo-operations-on-ships-carrying-dangerous-goods-in-solid-form-in-bulk-and-packaged-form-imdg-hazmat-handling rasshirennaya-podgotovka-dlya-sudov-v-polyarnykh-vodakh gruzovye-operatsii-na-tankerah-himovozah-prodvinutyy-uroven gruzovye-operatsii-na-tankerah-gazovozah-prodvinutyy-uroven gruzovye-operatsii-na-neftyanyh-tankerah-prodvinutyy-uroven basic-training-tanker-operations gruzovye-operatsii-na-sudah-perevozyaschih-opasnye-gruzy-v-tverdoy-forme-navalom-i-v-upakovke sudna-shcho-pratsyuyut-u-polyarnykh-vodakh-rozshyrena-pidhotovka-polyarni-vody vantazhni-operatsiyi-na-tankerakh-khimovozakh-rozshyrenyy-riven vantazhni-operatsiyi-na-tankerakh-hazovozakh-rozshyrenyy-riven vantazhni-operatsiyi-na-naftovykh-tankerakh-rozshyrenyy-riven pidhotovka-osib-komandnoho-ta-ryadovoho-skladu-yaki-vidpovidayut-za-vantazhni-operatsiyi-na-sudnakh-shcho-perevozyat-nebezpechni-rechovyny-navalom-ta-v-upakovtsi'.split(' ')
  },
  {
    slug: 'passenger',
    label: 'Training for the crew of passenger ships',
    labels: { ru: 'Подготовка персонала пассажирских судов', uk: 'Підготовка персоналу пасажирських суден' },
    description: 'Safety, service and crisis-management training for passenger ship personnel.',
    sourceSlugs: 'ships-cook-category-iv ships-waiter-category-iv english-language ship-steward crisis-management-and-human-behavior-cmhb passenger-safety-cargo-safety crowd-management-training-cmt safety-training-for-personnel-providing-direct-service-to-passengers-in-passenger-spaces podgotovka-po-upravleniyu-krizisnymi-situatsiyami-i-povedeniyu-lyudey podgotovka-po-upravleniyu-neorganizovannymi-massami-lyudey-obuchenie-upravleniyu-tolpoy podgotovka-po-voprosam-bezopasnosti-dlya-personala-obespechivayuschego-neposredstvennoe-obsluzhivanie-passazhirov-v-passazhirskih-pomescheniyah english-courses styuard oficziant-sudnovyj-chetvertogo-rozryadu kuhar-sudnovyj-chetvertogo-rozryadu pidhotovka-z-upravlinnya-ta-povedinky-lyudey-u-kryzovykh-sytuatsiyakh pidhotovka-z-upravlinnya-neorhanizovanymy-masamy-lyudey pidgotovka-z-pytan-bezpeky-dlya-personalu-yakyy-zabezpechue-bezposeredne-obslugovuvannya-pasazhyriv-u-pasazhyrskyh-prymischennyah'.split(' ')
  },
  {
    slug: 'professional_technical',
    label: 'Professional Technical Education',
    labels: { ru: 'Профессионально-техническое образование', uk: 'Професійно-технічна освіта' },
    description: 'Long-form vocational preparation for maritime technical and service roles.',
    sourceSlugs: 'ship-electrician-second-class ship-electric-gas-welder-fourth-grade ship-electrician-first-class motorman-machinist-second-class seaman-first-class seaman-second-class motorman-machinist-first-class ships-cook-category-iv motoryst-mashynyst-vtorogo-klassa matros-pervogo-klassa matros-vtorogo-klassa motoryst-mashynyst-pervogo-klassa motoryst-mashynist-pershogo-klasu motoryst-mashynist-drugogo-klasu matros-pershogo-klasu matros-drugogo-klasu kuhar-sudnovyj-chetvertogo-rozryadu elektrogazozvarnyk-sudnovyj-chetvertogo-rozryadu elektryk-sudnovyj-pershogo-klasu elektryk-sudnovyj-drugogo-klasu'.split(' ')
  },
  {
    slug: 'competence_upgrade',
    label: 'Increasing the level of competence',
    labels: { ru: 'Повышение уровня компетентности', uk: 'Підвищення рівня компетентності' },
    description: 'Short specialist courses for competence maintenance and professional development.',
    sourceSlugs: 'inert-gas-system sash ship-to-ship combating-maritime-cybersecurity-threats-cyber-risks-en ship-crane-operator-training helmsman-training automatic-identification-systems-ais scba-use-of-isolated-breathing-apparatus-with-compressed-air maintenance-of-electrical-and-electronic-equipment tank-cleaning-with-crude-oil ballast-system-and-use-of-ballast-system liquid-cargo-handling-simulator cargo-pump-systems-and-use-of-pump-systems safe-food-system-on-board-ship international-labour-convention-in-maritime-shipping-mlc tank-inspection safety-management-system-ism pollution-prevention-and-protection-of-marine-environment-marpol abandonment-of-sinking-helicopter automatic-external-defibrillator-defibrillators-saver-one-svo-v0001 hazards-associated-with-h2s-gas planned-system-maintenance-amos-for-windows entry-into-enclosed-spaces-premises-on-board-ships leadership-and-teamwork-human-factor en-liquefied-petroleum-gas-lpg-tanker-cargo-and-ballast-handling-operations combating-maritime-cybersecurity-threats-cyber-risks inert-gas-system-ru borba-s-ugrozamy-morskoy-kyberbezop ballastnaya-systema-y-yspolzovanye-b proverka-tankov systema-bezopasnogo-pytanyya-na-sudne mezhdunarodnaya-konventsyya-o-trude-v-mor systema-upravlenyya-bezopasnostyu-mk predotvrashhenye-zagryaznenyya-y-zashhyta ostavlenye-tonushhego-vertoleta avtomatycheskyy-vneshnyy-defybryllyato opasnost-svyazannaya-s-gazom-h2s planovoe-tehnycheskoe-obsluzhyvanye-s lyderstvo-y-rabota-v-komande-cheloveche ru-liquefied-petroleum-gas-lpg-tanker-cargo-and-ballast-handling-operations borba-s-ugrozami-morskoj-kiberbezopasnosti-kiberriski inert-gas-system-uk liquefied-petroleum-gas-lpg-tanker-cargo-and-ballast-handling-operations lyderstvo-y-rabota-v-komande-chelovecheskyj-faktor vhid-do-zamknutyh-prostoriv-prymishhen-na-bortu-suden derzhavnyj-portovyj-kontrol avtomatychnyj-zovnishnij-defibrylyator-defibrylyatory-saver-one-svo-v0001 nebezpeka-povyazana-z-gazom-h2s planove-tehnichne-obslugovuvannya-systemy-amos-for-windows systema-upravlinnya-bezpekoyu-mkub zapobigannya-zabrudnennya-ta-zahyst-morskogo-otochuyuchogo-seredovyshha-marpol zalyshannya-potopayuchogo-gelikoptera systema-bezpechnogo-harchuvannya-na-sudni mizhnarodna-konvencziya-z-praczi-u-morskomu-sudnoplavstvi-mop perevirka-tankiv vantazhni-nasosni-systemy balastna-systema myttya-syroyu-naftoyu asv-vykorystannya-izolovanyh-dyhalnyh-aparativ-iz-stysnutym-povitryam obslugovuvannya-elektrychnogo-ta-elektronnogo-obladnannya pidgotovka-z-upravlinnya-kranamy pidgotovka-rulovyh avtomatychni-identyfikaczijni-systemy-aic borotba-z-pogrozamy-morskoyi-kiberbezpeky-kiberryzyky'.split(' ')
  }
];

const languageNames = { en: 'English', ru: 'Russian', uk: 'Ukrainian' };

const fallbackCourses = [
  ['officers_navigation', 'Bridge Resource Management'],
  ['officers_engineers', 'Engine Room Watchkeeping'],
  ['ratings', 'Basic Safety Training'],
  ['ship_types', 'Specialised Tanker Operations'],
  ['passenger', 'Passenger Ship Crew Training'],
  ['professional_technical', 'Maritime Technical Education'],
  ['competence_upgrade', 'Professional Competence Development']
].map((course, index) => ({
  id: `placeholder-${index}`,
  slug: `placeholder-${index}`,
  directions: [course[0]],
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

function directionBySlug(slug) {
  return directionDefinitions.find(direction => direction.slug === slug);
}

function directionLabel(direction, language = state.currentLanguage) {
  return direction && direction.labels && direction.labels[language]
    ? direction.labels[language]
    : direction.label;
}

function normalizeDirections(value) {
  if (!value) return null;
  const candidates = Array.isArray(value) ? value : [value];
  const normalized = candidates.map(candidate => {
    const raw = typeof candidate === 'object'
      ? candidate.slug || candidate.value || candidate.name || candidate.label
      : candidate;
    if (!raw) return null;
    const slug = String(raw).toLowerCase().replace(/[\s-]+/g, '_');
    return directionBySlug(slug) ? slug : null;
  }).filter(Boolean);
  return normalized.length ? [...new Set(normalized)] : null;
}

function exposedDirections(course) {
  const candidates = [
    course.course_directions,
    course.course_direction,
    course.direction,
    course.acf && (course.acf.course_directions || course.acf.course_direction || course.acf.directions),
    course.meta && (course.meta.course_directions || course.meta.course_direction || course.meta.directions)
  ];
  return candidates.map(normalizeDirections).find(Boolean) || null;
}

function sourceDirections(course) {
  const fromApi = exposedDirections(course);
  if (fromApi) return fromApi;
  return directionDefinitions
    .filter(direction => direction.sourceSlugs.includes(course.slug))
    .map(direction => direction.slug);
}

function sourceFieldsUrl(language) {
  const params = new URLSearchParams({
    per_page: '100',
    lang: language,
    _fields: 'id,slug,link,title,acf,meta,direction,directions,course_direction,course_directions'
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
        directions: sourceDirections(course),
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

function directionCount(slug) {
  return state.courses.filter(course => course.directions.includes(slug)).length;
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
  page.categoryGrid.innerHTML = directionDefinitions.map((direction, index) => {
    const count = directionCount(direction.slug);
    return `
      <button class="category-card" type="button" data-category="${direction.slug}">
        <span class="category-number">${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHtml(directionLabel(direction))}</strong>
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
      return [field[0], field[1], ['Select a course direction', ...directionDefinitions.map(direction => directionLabel(direction))]];
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
    : state.courses.filter(course => course.directions.includes(state.currentCategory));
}

function catalogueDefinition() {
  return state.currentCategory === 'all'
    ? { label: 'All Training', description: 'Explore the complete prototype course catalogue sourced from tcsavant.com.' }
    : { ...directionBySlug(state.currentCategory), label: directionLabel(directionBySlug(state.currentCategory)) };
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
    ${directionDefinitions.map(direction => `
      <button type="button" data-catalogue-category="${direction.slug}" class="catalogue-category-button ${state.currentCategory === direction.slug ? 'active' : ''}">
        <span>${escapeHtml(directionLabel(direction))}</span><small>${directionCount(direction.slug)}</small>
      </button>`).join('')}`;
  page.courseResultsGrid.innerHTML = visible.length ? visible.map((course, index) => {
    const selectedDirection = state.currentCategory === 'all' ? course.directions[0] : state.currentCategory;
    const direction = directionBySlug(selectedDirection);
    return `<article class="catalogue-course-card">
      <div class="course-card-topline"><span>${course.placeholder ? 'PROTOTYPE COURSE' : 'TCSAVANT.COM SOURCE'}</span><span>${String(index + 1).padStart(2, '0')}</span></div>
      <h3>${escapeHtml(course.title)}</h3>
      <p>Course details, delivery options and provider availability will be mapped into the future marketplace.</p>
      <div class="catalogue-course-meta"><span>Course direction<strong>${escapeHtml(direction ? directionLabel(direction) : 'Direction pending')}</strong></span><span>Source language<strong>${escapeHtml(languageNames[state.currentLanguage])}</strong></span></div>
      <div class="catalogue-course-actions">
        <a href="${escapeHtml(course.link)}" target="_blank" rel="noopener">Source details ↗</a>
        <button type="button" data-course-enquire="${escapeHtml(course.title)}" data-course-direction="${selectedDirection || ''}">Request guidance</button>
      </div>
    </article>`;
  }).join('') : '<div class="catalogue-empty"><strong>No matched courses yet.</strong><p>This direction remains visible because it is part of the source catalogue structure. Titles will appear when the source data is updated.</p></div>';
  page.catalogueMore.hidden = state.visibleCount >= results.length;
  page.catalogueMore.textContent = `Show more courses (${Math.max(0, results.length - state.visibleCount)})`;
  document.title = `${definition.label} Courses — Maritime Training Platform`;
}

function routeForCategory(slug) {
  return `#courses/${encodeURIComponent(slug)}`;
}

function openCatalogue(slug = 'all', updateHistory = true) {
  state.currentCategory = slug === 'all' || directionBySlug(slug) ? slug : 'all';
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

function selectAudience(audience, shouldScroll = true, directionSlug = '') {
  renderForm(audience);
  if (shouldScroll) scrollToSection('contact');
  if (audience === 'seafarer' && directionSlug) {
    const select = page.dynamicFields.querySelector('select');
    const direction = directionBySlug(directionSlug);
    if (select && direction) select.value = directionLabel(direction);
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
  if (courseEnquiry) selectAudience('seafarer', true, courseEnquiry.dataset.courseDirection);
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
