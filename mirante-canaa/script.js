// Funcionalidade de Envio do Formulário para o WhatsApp
const form = document.getElementById('bookingForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = form.querySelectorAll('input')[0].value;
  const data = form.querySelectorAll('input')[1].value;
  const hora = form.querySelectorAll('input')[2].value;
  const pessoas = form.querySelectorAll('input')[3].value;
  const obs = form.querySelector('textarea').value;

  // Formata a data para o padrão Brasileiro (Opcional, mas melhora a leitura)
  const dataFormatada = data.split('-').reverse().join('/');

  const mensagem = `Olá! Gostaria de fazer uma reserva no Mirante Canaã.%0A%0A` +
                   `*Nome:* ${nome}%0A` +
                   `*Data:* ${dataFormatada}%0A` +
                   `*Hora:* ${hora}%0A` +
                   `*Pessoas:* ${pessoas}%0A` +
                   `*Obs:* ${obs ? obs : 'Nenhuma'}`;

  // Substitua o número abaixo pelo WhatsApp real do restaurante (apenas números)
  const numeroWhatsApp = '5500000000000'; 

  window.open(
    `https://wa.me/${numeroWhatsApp}?text=${mensagem}`,
    '_blank'
  );
});