const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const header = document.querySelector('.site-header');

const closeMenu = () => {
  document.body.classList.remove('menu-open');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  menuButton.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
  window.lucide?.createIcons();
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    closeMenu();
    return;
  }

  document.body.classList.add('menu-open');
  mobileMenu.style.top = Math.max(0, header.getBoundingClientRect().bottom) + "px";
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Fechar menu');
  menuButton.innerHTML = '<i data-lucide="x" aria-hidden="true"></i>';
  window.lucide?.createIcons();
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', () => {
  header.classList.toggle('is-sticky', window.scrollY > 110);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const newsletterForm = document.querySelector('#newsletter-form');
const formMessage = document.querySelector('.form-message');

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = new FormData(newsletterForm).get('email');

  formMessage.textContent = email
    ? 'Obrigada! Seu e-mail foi recebido.'
    : 'Digite um e-mail válido para continuar.';

  if (email) newsletterForm.reset();
});

document.querySelector('#year').textContent = new Date().getFullYear();
window.lucide?.createIcons();
