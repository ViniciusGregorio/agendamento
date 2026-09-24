const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const floatingWhatsApp = document.querySelector('.floating-whatsapp');

function closeMenu() {
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

function updateScrollUi() {
  const pastHeroTop = window.scrollY > 120;
  header?.classList.toggle('is-sticky', pastHeroTop);
  floatingWhatsApp?.classList.toggle('is-visible', window.scrollY > 520);
}

window.addEventListener('scroll', updateScrollUi, { passive: true });
updateScrollUi();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px' },
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

function getSaoPauloTime() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function updateOpenStatus() {
  const status = document.querySelector('[data-open-status]');
  if (!status) return;

  const time = getSaoPauloTime();
  const minutes = Number(time.hour) * 60 + Number(time.minute);
  const weekend = time.weekday === 'Sat' || time.weekday === 'Sun';
  const afterOpening = minutes >= 19 * 60;
  const beforeClosing = weekend ? minutes < 23 * 60 + 30 : true;
  // Entre 0h e 2h, vale o horário do dia anterior (terça a sábado).
  const openAfterMidnight = minutes < 2 * 60 && ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(time.weekday);
  const isOpen = (afterOpening && beforeClosing) || openAfterMidnight;

  status.classList.toggle('is-open', isOpen);
  status.classList.toggle('is-closed', !isOpen);
  status.querySelector('b').textContent = isOpen ? 'Aberto agora' : 'Fechado agora';
}

updateOpenStatus();
document.querySelector('[data-year]').textContent = new Date().getFullYear();

// Hooks simples para mensuração quando Google Analytics/GTM for instalado.
document.querySelectorAll('.js-whatsapp').forEach((link) => {
  link.addEventListener('click', () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'whatsapp_click', cta_location: link.dataset.cta });
  });
});
