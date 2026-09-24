const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-menu');
const menuLinks = menu.querySelectorAll('a');

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
};

const closeMenu = () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menu.classList.toggle('open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

menuLinks.forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu();
});

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !window.location.search.includes('static')) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

document.querySelector('#current-year').textContent = new Date().getFullYear();
