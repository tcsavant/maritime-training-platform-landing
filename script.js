const page = {
  menuButton: document.querySelector('.menu-button'),
  navigation: document.querySelector('.desktop-nav'),
  leadForm: document.querySelector('#lead-form'),
  dynamicFields: document.querySelector('#dynamic-fields'),
  formKicker: document.querySelector('#form-kicker'),
  formTitle: document.querySelector('#form-title'),
  formSubmit: document.querySelector('#form-submit'),
  courseDialog: document.querySelector('#course-dialog'),
  dialogTitle: document.querySelector('#dialog-title'),
  toast: document.querySelector('.toast')
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
      ['Country / Region', 'text', 'e.g. Singapore'],
      ['Current Rank / Role', 'text', 'e.g. Third Officer'],
      ['Course Interest', 'select', ['Select a course area', 'Safety & STCW', 'Navigation', 'Engineering', 'Tanker Operations', 'GMDSS', 'Security']],
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
  page.formKicker.textContent = definition.kicker;
  page.formTitle.textContent = definition.title;
  page.formSubmit.textContent = definition.submit;
  const indexedFields = definition.fields.map((field, index) => ({ field, index }));
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

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  page.navigation.classList.remove('mobile-open');
  page.menuButton.setAttribute('aria-expanded', 'false');
}

function selectAudience(audience, shouldScroll = true) {
  renderForm(audience);
  if (shouldScroll) scrollToSection('contact');
}

let toastTimer;
function showToast(message) {
  page.toast.textContent = message;
  page.toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => page.toast.classList.remove('visible'), 3000);
}

document.addEventListener('click', event => {
  const scrollControl = event.target.closest('[data-scroll]');
  if (scrollControl) scrollToSection(scrollControl.dataset.scroll);

  const audienceControl = event.target.closest('[data-audience]');
  if (audienceControl) selectAudience(audienceControl.dataset.audience);

  const formAudienceControl = event.target.closest('[data-form-audience]');
  if (formAudienceControl) renderForm(formAudienceControl.dataset.formAudience);

  const categoryControl = event.target.closest('[data-category]');
  if (categoryControl) {
    page.dialogTitle.textContent = categoryControl.dataset.category;
    page.courseDialog.showModal();
  }

  if (event.target.closest('[data-close-dialog]')) page.courseDialog.close();
  if (event.target.closest('[data-dialog-enquiry]')) {
    page.courseDialog.close();
    selectAudience('seafarer');
  }

  const languageControl = event.target.closest('[data-language]');
  if (languageControl) {
    document.querySelectorAll('[data-language]').forEach(button => {
      const active = button === languageControl;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    showToast(languageControl.dataset.language === 'EN' ? 'English selected.' : 'Translation is planned for a future prototype version.');
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

const observedSections = ['courses', 'providers', 'companies', 'about']
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

renderForm('seafarer');
