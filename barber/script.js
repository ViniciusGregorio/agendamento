const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const menuLinks = menu.querySelectorAll('a');

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
};

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menu.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.querySelector('[data-year]').textContent = new Date().getFullYear();
