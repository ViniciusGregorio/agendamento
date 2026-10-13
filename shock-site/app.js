(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  let suggestedText = '';
  document.querySelectorAll('[data-category]').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('#category').value = link.dataset.category;
      const materials = document.querySelector('#materials-list');
      if (link.dataset.request && (!materials.value.trim() || materials.value === suggestedText)) {
        materials.value = link.dataset.request;
        suggestedText = link.dataset.request;
      }
    });
  });
  const gallery = document.querySelector('#product-gallery');
  const photoButtons = Array.from(document.querySelectorAll('.product-grid [data-photo-index]'));
  const photos = photoButtons.map(button => {
    const card = button.closest('.product-card');
    const image = button.querySelector('img');
    const quote = card.querySelector('[data-category]');
    return { src: image.src, alt: image.alt, title: card.querySelector('h3').textContent, quote };
  });
  let photoIndex = 0;
  function displayPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    const photo = photos[photoIndex];
    const image = document.querySelector('#gallery-image');
    image.src = photo.src;
    image.alt = photo.alt;
    document.querySelector('#photo-title').textContent = photo.title;
    document.querySelector('#photo-counter').textContent = `FOTO DA LOJA · ${String(photoIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  }
  document.querySelectorAll('[data-photo-index]').forEach(button => {
    button.addEventListener('click', () => {
      displayPhoto(Number(button.dataset.photoIndex));
      gallery.showModal();
      document.documentElement.classList.add('gallery-open');
    });
  });
  function closeGallery() {
    gallery.close();
    document.documentElement.classList.remove('gallery-open');
  }
  document.querySelector('.gallery-close').addEventListener('click', closeGallery);
  document.querySelector('.gallery-prev').addEventListener('click', () => displayPhoto(photoIndex - 1));
  document.querySelector('.gallery-next').addEventListener('click', () => displayPhoto(photoIndex + 1));
  gallery.addEventListener('close', () => {
    if (!gallery.open) document.documentElement.classList.remove('gallery-open');
  });
  gallery.addEventListener('click', event => {
    if (event.target !== gallery) return;
    const box = gallery.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeGallery();
  });
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      displayPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  document.querySelector('#gallery-quote').addEventListener('click', event => {
    event.preventDefault();
    closeGallery();
    photos[photoIndex].quote.click();
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
  document.querySelector('#quote-form').addEventListener('submit', event => {
    event.preventDefault();
    const name = document.querySelector('#customer').value.trim();
    const materials = document.querySelector('#materials-list');
    const list = materials.value.trim();
    if (list.length < 3) {
      materials.setCustomValidity('Descreva os materiais ou a dúvida em pelo menos 3 caracteres.');
      materials.reportValidity();
      return;
    }
    materials.setCustomValidity('');
    const category = document.querySelector('#category').value;
    const location = document.querySelector('#neighborhood').value.trim();
    const message = ['Olá, Shock! Vim pelo site e gostaria de consultar um orçamento.', name ? `Meu nome: ${name}` : null, `Assunto: ${category}`, `Minha lista / dúvida:\n${list}`, location ? `Bairro / cidade: ${location}` : null].filter(Boolean).join('\n\n');
    const url = `https://wa.me/5512992198687?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    const status = document.querySelector('#form-status');
    status.replaceChildren();
    status.append('Seu pedido está pronto. ');
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.textContent = 'Abrir conversa no WhatsApp';
    status.append(fallback);
  });
  document.querySelector('#materials-list').addEventListener('input', event => event.target.setCustomValidity(''));
})();
