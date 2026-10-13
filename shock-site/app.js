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
