# Site da Academia Ariônia

Landing page estática, responsiva e focada em gerar conversas qualificadas no WhatsApp.

## Visualizar localmente

```bash
python3 -m http.server 8080
```

Depois, abra `http://localhost:8080`.

## Antes de publicar

- Confirmar o WhatsApp comercial usado em todos os botões: `(12) 98891-1301`.
- Confirmar o endereço exibido: `Rua Dr. Celestino, 520 — Centro, Cruzeiro/SP`.
- Confirmar horários: segunda a sexta, 5h–22h; sábado, 7h–12h.
- Trocar a marca tipográfica provisória pelo logotipo oficial, se houver arquivo em boa resolução.
- Instalar Google Analytics 4 e Meta Pixel e configurar os eventos `generate_lead` e `whatsapp_click`.
- Publicar uma política de privacidade se novos campos de contato forem adicionados ao formulário.

## Estrutura

- `index.html`: conteúdo, SEO local e dados estruturados.
- `styles.css`: identidade visual e responsividade.
- `script.js`: menu, animações, FAQ e geração da mensagem de WhatsApp.
- `assets/hero-arionia.webp`: imagem hero otimizada para web.
- `estrategia-negociacao.md`: plano comercial e roteiro de atendimento.
