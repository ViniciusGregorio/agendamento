const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const closeMenu = () => {
  if (!menuToggle || !nav) return;
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
};

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const willOpen = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', willOpen);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const panelId = button.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    const isOpen = button.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-question').forEach((otherButton) => {
      const otherPanelId = otherButton.getAttribute('aria-controls');
      const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
      otherButton.setAttribute('aria-expanded', 'false');
      if (otherPanel) otherPanel.hidden = true;
    });

    if (!isOpen && panel) {
      button.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }
  });
});

const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const subject = String(formData.get('subject') || '').trim();
  const message = String(formData.get('message') || '').trim();

  const whatsappMessage = [
    `Olá, Dr. Nathanael. Meu nome é ${name}.`,
    `Assunto: ${subject}.`,
    `Resumo: ${message}`,
    '',
    'Gostaria de solicitar informações sobre disponibilidade de atendimento.',
  ].join('\n');

  const whatsappUrl = `https://wa.me/5524998259249?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
