# Gelateria Angelato — site V1 (demonstração)

Site estático, sem framework e sem build, no mesmo modelo do
`confeitaria-template`: o cliente monta o pedido no site e envia formatado
para o WhatsApp da loja.

```
docs/
  index.html                 página única (hero scroll-driven → manifesto → sabores → cardápio em lista → a casa → depoimentos → onde estamos → footer)
  assets/css/estilo.css      sistema de design (custom properties em :root)
  assets/js/catalogo.js      FONTE ÚNICA de dados: itens, preços (centavos), opções, contato, horário
  assets/js/carrinho-regras.js  regras puras (validação, totais, mensagem) — testáveis em Node
  assets/js/carrinho-regras.test.js
  assets/js/carrinho.js      gaveta do pedido + modal de item + envio ao WhatsApp
  assets/js/site.js          renderiza cardápio/sabores/depoimentos a partir do catálogo, menu mobile
  assets/img/                logo (extraída do print), fundo-*.webp (flat-lay 1920/900), cone-*.webp (transparentes)
  assets/fontes/             (não usada na V2 — tipografia é Bricolage Grotesque via Google Fonts)
servidor.py                  python3 servidor.py → http://127.0.0.1:4189
PENDENTES.md                 lista do que é placeholder e precisa de dado real
```

Rodar local: `python3 servidor.py`. Testes: `node docs/assets/js/carrinho-regras.test.js`.
Ao alterar CSS/JS, incrementar o `?v=N` no `index.html`.
