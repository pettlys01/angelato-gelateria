# Design — Gelateria Angelato

## Visual theme
Gelateria de bairro, italiana, azul-marinho comprometido. Superfícies claras em off-white neutro (não bege), azul da marca em blocos grandes, dourado só em CTA/foco/ênfase, terracota como voz de apoio (script, texto secundário quente).

## Color
| Token | Valor | Uso |
|---|---|---|
| --azul | #224371 | header, hero, sobre, footer, botões secundários |
| --azul-escuro | #17304f | texto sobre dourado, footer base |
| --terracota | #976c4d | sobrelinhas em script, "serve X", CTA final |
| --dourado | #c8b976 | CTA primário, foco, selos, estrelas |
| --creme | #f7f1e6 | fundo de página (legado — ver polish) |
| --texto | #1e2a3a | corpo |
| --texto-suave | #5b6675 | apoio (≥4.5:1 sobre creme) |

## Typography
- **Uma família só: Bricolage Grotesque** (Google Fonts, `opsz 12..96`, pesos 400/600/800). Nenhuma fonte da pasta é usada (decisão de 15/09/2026, redesign V2).
- Monumental (`.monumental`, nome no hero e no rodapé): 800, opsz 96, tracking −0,035em, `clamp(56px, 11vw, 150px)`; nome do hero `clamp(88px, 21.5vw, 330px)`, cortado pela dobra.
- Títulos, preços, botões: 600–800. Corpo: 400, 16–17px.

## Layout (V2 — referências Alfredo / Mr. Pops / Luccianos)
Blocos de cor inteiros, em sequência: **foto** (hero) → **azul** (manifesto + pilares 01–04) → **off-white** (sabores: faixa de cones + lista tipográfica) → **branco** (cardápio em lista, não cards) → **azul-escuro** (a casa: colagem sobreposta + como pedir) → **off-white** (depoimentos em citações + onde estamos em tabela) → **dourado** (rodapé com ANGELATO monumental).
Muito espaço vazio; nenhuma seção de cards iguais — os únicos "tiles" são os 5 cones de sabor.

## Motion
- Hero: trilho de 170vh com palco sticky; a foto **encolhe até virar um card** e o **marquee** azul aparece atrás — `animation-timeline: scroll(root)` (CSS scroll-driven, sem JS por frame). Sem suporte → hero estático de 100vh.
- Fotos do hero em crossfade (opacity) a cada 6 s.
- Entradas por IntersectionObserver; colagem entra sobreposta de lados diferentes.
- Só `transform`/`opacity`; `prefers-reduced-motion` desliga tudo, inclusive o hero e o marquee.

## Exceção documentada — Hero (V2)
O hero é a foto full-bleed do sabor (protagonista), não mais um painel na cor do sabor; o azul da marca aparece no encolher (fundo do card) e no bloco seguinte. Substitui as opções B/C anteriores.
