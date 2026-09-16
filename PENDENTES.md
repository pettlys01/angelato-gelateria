# PENDENTES — Gelateria Angelato (site V1 demo)

Tudo abaixo é dado FICTÍCIO ou provisório da demonstração. Trocar pelo dado
real antes do lançamento. Onde mexer: `docs/assets/js/catalogo.js` (dados) e
`docs/index.html` (textos marcados com comentário `PLACEHOLDER`).

## Bloqueadores (o carrinho depende disso)
1. **Lista real dos sabores de gelato** (iFood diz "mais de 50", milk shake diz "76") — hoje são 24 fictícios em `catalogo.js → saboresGelato`.
2. **Regras de montagem:** acompanhamentos grátis e extras do açaí (com preço), caldas disponíveis, 10 sabores da cassata, 5 sabores do bolo de gelato — `catalogo.js → listas`.
3. **Regras de entrega:** raio, taxa, pedido mínimo, se há entrega própria — `catalogo.js → atendimento.entrega` e barra de aviso no `index.html`.
4. **Formas de pagamento no balcão/entrega:** Pix e dinheiro são placeholder (bandeiras de cartão são reais, do iFood).

## Conteúdo
5. **Fotos de produto em alta** — nenhuma recebida. Hoje cada item usa uma ilustração SVG (`site.js → ILUSTRACOES`); ao receber fotos, trocar a função `ilustracao()` por `<img>`.
6. **Foto do hero** (cone/taça grande) — hoje é SVG desenhado.
7. **Fotos da loja** para o mosaico da seção "Sobre" (fachada, balcão, carrinho de eventos).
8. **Texto "Sobre"** — escrito para a demo a partir do Instagram; validar com o cliente.
9. **Depoimentos** — os 3 são fictícios (`catalogo.js → depoimentos`). Trocar por avaliações reais com autorização.
10. **E-mail de contato** — `contato@gelateriaangelato.com.br` é fictício.
11. **Horário** — extraído do iFood; confirmar horário da loja física.
12. **Bairro** — iFood diz "Centro", Instagram diz "Chácara Inglesa"; site usa Centro.

## Identidade
13. **Logo em vetor (SVG) ou PNG grande** — a atual foi extraída de um print de 316 px (`docs/assets/img/`). Serve para header/footer, não para impressão ou hero.
14. **Fonte de corpo de texto** — não foi fornecida; o site usa a pilha do sistema (`estilo.css → --f-corpo`).

## Infra
15. Domínio, hospedagem e e-mail.
16. Selo "Site de demonstração" no rodapé e etiquetas `.demo-tag` — remover no lançamento.
17. Ponto de conversão (`carrinho.js → console.log('[conversao]')`) — ligar em GA4/Ads quando houver.

## Polish aplicado com skills (15/09/2026)
- `impeccable` (v3.5.0; v4.3.1 disponível via `npx impeccable skills update`): PRODUCT.md e DESIGN.md escritos; corrigidos fundo creme → off-white neutro, sobrelinha só em 3 seções, variação de esqueleto entre seções, raios da logo como assinatura, entradas com stagger, skip link, `role=alert`, alvos 44px em toque.
- `ui-ux-pro-max`: checklist de entrega (touch, contraste, focus, reduced-motion) aplicado.
- `10k-websites`: usado só o padrão de engenharia (motion transform/opacity, reduced-motion completo, self-test). O fluxo de vídeo-hero/Higgsfield/Hostinger não se aplica.
- `design:ux-copy`: microcopy do carrinho (botões "Escolher sabores", erros o-que+como-resolver, estado pós-envio com fallback para popup bloqueado).
- Ainda NÃO rodadas, por decisão: `marketing:seo-audit`, `marketing:draft-content` — usar após validação da estrutura.

## V2 (redesign 15/09/2026)
- **Fotos do hero e da colagem são geradas por IA** (`fundo-*.webp`, `cone-*.webp`) — placeholders até as fotos reais do balcão/loja.
- **Fonte via Google Fonts** (Bricolage Grotesque): se quiser self-host, baixar os .woff2 e trocar o `<link>` por `@font-face`.
- Textos dos cones ("belga 70%", "torrado na casa"…), pilares 01–04 e "A casa" são copy da demo — validar.
- Backup da V1 (hero slider "Yummy Ice") em `/private/tmp/.../scratchpad/v1-backup` só durante esta sessão; a versão anterior de referência ficou registrada no DESIGN.md.
