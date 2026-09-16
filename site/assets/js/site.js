/* ==========================================================================
   site.js — renderização do cardápio (lista), sabores (colunas) e
   depoimentos a partir do CATALOGO; menu mobile; header ao rolar;
   crossfade do hero; entradas por IntersectionObserver. Sem regra de negócio.
   ========================================================================== */
(function () {
  'use strict';
  if (typeof CATALOGO === 'undefined') return;
  var C = CATALOGO;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function reais(c) { return 'R$ ' + (c / 100).toFixed(2).replace('.', ','); }

  /* Rótulo do botão diz o que vai acontecer: escolher sabor, escolher uma
     opção, ou adicionar direto. */
  function rotuloBotao(it) {
    var ops = it.opcoes || [];
    if (ops.some(function (o) { return o.tipo === 'sabores'; })) return 'Escolher sabores';
    if (ops.length) return 'Escolher opções';
    return 'Adicionar';
  }

  /* ------------------------------------------------------------- lista
     Cardápio em linhas (nome · descrição · preço · ação), não em cards. */
  function linha(it) {
    return '<li class="item">' +
      '<div class="item__texto">' +
        '<span class="item__nome">' + esc(it.nome) + (it.destaque ? ' <span class="item__selo">mais pedido</span>' : '') + '</span>' +
        (it.descricao ? '<p class="item__desc">' + esc(it.descricao) + '</p>' : '') +
        (it.serve ? '<span class="item__serve">serve ' + esc(it.serve) + '</span>' : '') +
      '</div>' +
      '<span class="item__preco">' + reais(it.preco) + '</span>' +
      '<button class="btn btn--pequeno btn--azul item__acao" type="button" data-venda="' + esc(it.id) + '" aria-label="' + esc(rotuloBotao(it) + ': ' + it.nome) + '">' + rotuloBotao(it) + '</button>' +
    '</li>';
  }

  function renderCardapio() {
    var abas = document.getElementById('cardapioAbas');
    var painel = document.getElementById('cardapioPainel');
    if (!abas || !painel) return;

    abas.innerHTML = C.categorias.map(function (c, i) {
      return '<button type="button" role="tab" data-cat="' + c.id + '" aria-selected="' + (i === 0) + '">' + esc(c.nome) + '</button>';
    }).join('');

    function mostrar(catId) {
      var cat = C.categorias.find(function (c) { return c.id === catId; });
      abas.querySelectorAll('[role=tab]').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.cat === catId); });
      painel.innerHTML =
        '<p class="cardapio__descricao">' + esc(cat.descricao) + '</p>' +
        '<ul class="lista">' +
          C.itens.filter(function (it) { return it.categoria === catId; }).map(linha).join('') +
        '</ul>';
      observarReveal(painel);
    }
    abas.addEventListener('click', function (e) {
      var b = e.target.closest('[role=tab]');
      if (b) mostrar(b.dataset.cat);
    });
    /* Links #cardapio-<categoria> (rodapé) trocam a aba e rolam até a
       seção — o id composto não existe no DOM, então o navegador sozinho
       não rolaria. */
    function porHash() {
      var cat = (location.hash.match(/^#cardapio-(\w+)/) || [])[1];
      if (!C.categorias.some(function (c) { return c.id === cat; })) return false;
      mostrar(cat);
      document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }
    window.addEventListener('hashchange', porHash);
    if (!porHash()) mostrar(C.categorias[0].id);
  }

  function renderSabores() {
    var alvo = document.getElementById('saboresGrade');
    if (!alvo) return;
    alvo.innerHTML = C.saboresGelato.map(function (g) {
      return '<div><h3>' + esc(g.grupo) + '</h3><ul>' + g.sabores.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    }).join('');
  }

  function renderDepoimentos() {
    var alvo = document.getElementById('depoimentosGrade');
    if (!alvo) return;
    alvo.innerHTML = C.depoimentos.map(function (d) {
      return '<blockquote class="depoimento">' +
        '<p>“' + esc(d.texto) + '”</p>' +
        '<footer><strong>' + esc(d.nome) + '</strong><span>' + esc(d.bairro) + '</span></footer>' +
      '</blockquote>';
    }).join('');
  }

  function renderHorario() {
    var alvo = document.getElementById('horarioTabela');
    if (!alvo) return;
    alvo.innerHTML = C.atendimento.horario.map(function (h) {
      return '<div><span>' + esc(h.dia) + '</span><span>' + esc(h.horas) + '</span></div>';
    }).join('');
  }

  /* ------------------------------------------------------------ header */
  function menuMobile() {
    var btn = document.querySelector('.hamburguer');
    var menu = document.getElementById('menu');
    if (!btn || !menu) return;
    function abrir(v) { menu.dataset.aberto = v ? 'true' : 'false'; btn.setAttribute('aria-expanded', v); document.body.style.overflow = v ? 'hidden' : ''; }
    btn.addEventListener('click', function () { abrir(menu.dataset.aberto !== 'true'); });
    menu.querySelectorAll('a, .menu__fechar').forEach(function (a) { a.addEventListener('click', function () { abrir(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrir(false); });
  }

  function headerRolagem() {
    var topo = document.querySelector('.topo');
    if (!topo) return;
    function tick() { topo.dataset.rolado = window.scrollY > 40 ? 'true' : 'false'; }
    window.addEventListener('scroll', tick, { passive: true }); tick();
  }

  /* ------------------------------------------------------------ hero
     Crossfade lento entre as fotos (só opacity). O encolher/marquee é CSS
     scroll-driven. Em reduced-motion fica na primeira foto. */
  function heroFotos() {
    var raiz = document.querySelector('[data-hero-fotos]');
    if (!raiz) return;
    var fotos = raiz.querySelectorAll('.hero__img');
    if (fotos.length < 2) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    /* esconde o botão flutuante do WhatsApp enquanto o hero está na tela
       (ele cobria o nome monumental no celular) */
    var hero = raiz.closest('.hero');
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        document.body.dataset.heroVisivel = es[0].isIntersecting ? 'true' : 'false';
      }, { threshold: 0.15 }).observe(hero);
    }
    var i = 0;
    setInterval(function () {
      fotos[i].classList.remove('ativa');
      i = (i + 1) % fotos.length;
      fotos[i].classList.add('ativa');
    }, 6000);
  }

  /* ------------------------------------------------------------ entradas
     IntersectionObserver marca .in; os filhos entram em sequência (CSS).
     Depois da entrada, .feito zera os delays para o hover não atrasar. */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      setTimeout(function () { e.target.classList.add('feito'); }, 1200);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -4% 0px', threshold: 0 }) : null;

  function observarReveal(raiz) {
    (raiz || document).querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      if (io) io.observe(el); else el.classList.add('in', 'feito');
    });
  }

  function iniciar() {
    renderSabores(); renderCardapio(); renderDepoimentos(); renderHorario();
    menuMobile(); headerRolagem(); heroFotos(); observarReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
