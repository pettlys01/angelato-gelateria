/* ==========================================================================
   Carrinho — controlador de DOM

   Depende de catalogo.js e carrinho-regras.js (carregados antes). Toda
   regra de negócio mora lá; aqui só: estado + renderização + eventos +
   localStorage + montagem do link do WhatsApp.
   ========================================================================== */
(function () {
  'use strict';
  if (typeof CATALOGO === 'undefined' || typeof CarrinhoRegras === 'undefined') return;
  var R = CarrinhoRegras;
  var CHAVE = 'angelato-carrinho-v1';

  var ICONE_FECHAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var ICONE_ZAP = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.7 0 1.1Z"/></svg>';

  /* ---------------------------------------------------------------- estado */
  var estadoInicial = { itens: [], modo: 'retirada', nome: '', enderecoEntrega: '', pagamento: 'pix', observacoes: '' };
  var estado = Object.assign({}, estadoInicial);
  var avisos = [];

  function carregar() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) return;
      var salvo = JSON.parse(bruto);
      if (!salvo || !Array.isArray(salvo.itens)) return;
      var r = R.revalidar(salvo.itens);
      estado = Object.assign({}, estadoInicial, salvo, { itens: r.itens });
      avisos = r.avisos;
    } catch (e) { estado = Object.assign({}, estadoInicial); }
  }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {} }

  /* ------------------------------------------------------------------ DOM */
  var el = {};
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function montarEsqueleto() {
    var fundo = document.createElement('div');
    fundo.className = 'carrinho-fundo';
    document.body.appendChild(fundo);

    var gaveta = document.createElement('aside');
    gaveta.className = 'carrinho-gaveta';
    gaveta.setAttribute('role', 'dialog');
    gaveta.setAttribute('aria-label', 'Seu pedido');
    gaveta.innerHTML =
      '<div class="carrinho-gaveta__topo"><h2>Seu pedido</h2>' +
        '<button class="fechar" type="button" aria-label="Fechar carrinho">' + ICONE_FECHAR + '</button></div>' +
      '<div class="carrinho-gaveta__corpo"></div>' +
      '<div class="carrinho-gaveta__rodape"></div>';
    document.body.appendChild(gaveta);

    el.fundo = fundo; el.gaveta = gaveta;
    el.corpo = gaveta.querySelector('.carrinho-gaveta__corpo');
    el.rodape = gaveta.querySelector('.carrinho-gaveta__rodape');
    el.botoes = document.querySelectorAll('[data-abrir-carrinho]');
    el.contagens = document.querySelectorAll('[data-carrinho-contagem]');

    el.botoes.forEach(function (b) { b.addEventListener('click', abrirGaveta); });
    fundo.addEventListener('click', fecharTudo);
    gaveta.querySelector('.fechar').addEventListener('click', fecharTudo);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharTudo(); });
  }

  function abrirGaveta() {
    el.fundo.dataset.aberto = 'true'; el.gaveta.dataset.aberto = 'true';
    document.body.style.overflow = 'hidden';
    renderGaveta();
  }
  function fecharTudo() {
    el.fundo.dataset.aberto = 'false'; el.gaveta.dataset.aberto = 'false';
    if (elModal) elModal.dataset.aberto = 'false';
    document.body.style.overflow = '';
  }

  function atualizarContagem() {
    var n = estado.itens.reduce(function (s, ci) { return s + ci.quantidade; }, 0);
    el.contagens.forEach(function (c) { c.textContent = String(n); });
    el.botoes.forEach(function (b) { b.dataset.vazio = n === 0 ? 'true' : 'false'; });
  }

  /* --------------------------------------------------------------- render */
  function renderGaveta() {
    var banner = avisos.length
      ? '<div class="carrinho-banner">Alguns itens foram atualizados, revise seu pedido:<br>' +
        avisos.map(function (a) { return '· ' + esc(a); }).join('<br>') + '</div>'
      : '';

    if (!estado.itens.length) {
      el.corpo.innerHTML = banner +
        '<div class="carrinho-vazio">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
          '<p>Nada aqui ainda.<br>Escolha um gelato no cardápio e ele aparece aqui.</p>' +
          '<a class="btn btn--dourado" href="#cardapio" data-fechar-gaveta>Ver cardápio</a>' +
        '</div>';
      el.rodape.innerHTML = '';
      el.corpo.querySelector('[data-fechar-gaveta]').addEventListener('click', fecharTudo);
      return;
    }

    el.corpo.innerHTML = banner + estado.itens.map(function (ci, i) {
      var resumo = R.resumoEscolhas(ci);
      return '<div class="carrinho-item">' +
        '<div class="carrinho-item__linha">' +
          '<span class="carrinho-item__nome">' + esc(ci.nome) + '</span>' +
          '<span class="carrinho-item__preco">' + R.formatarReais(R.totalItem(ci)) + '</span>' +
        '</div>' +
        (resumo ? '<span class="carrinho-item__detalhe">' + esc(resumo) + '</span>' : '') +
        '<div class="carrinho-item__acoes">' +
          '<div class="qtd"><button type="button" data-qtd="-1" data-i="' + i + '" aria-label="Diminuir">−</button>' +
            '<span>' + ci.quantidade + '</span>' +
            '<button type="button" data-qtd="1" data-i="' + i + '" aria-label="Aumentar">+</button></div>' +
          '<button class="carrinho-item__remover" type="button" data-remover="' + i + '">Remover</button>' +
        '</div>' +
      '</div>';
    }).join('');

    el.corpo.querySelectorAll('[data-remover]').forEach(function (b) {
      b.addEventListener('click', function () {
        estado.itens.splice(Number(b.dataset.remover), 1);
        salvar(); atualizarContagem(); renderGaveta();
      });
    });
    el.corpo.querySelectorAll('[data-qtd]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ci = estado.itens[Number(b.dataset.i)];
        ci.quantidade = Math.max(1, ci.quantidade + Number(b.dataset.qtd));
        salvar(); atualizarContagem(); renderGaveta();
      });
    });

    var ent = CATALOGO.atendimento.entrega;
    var bloqueio = R.bloqueioMinimo(estado);

    el.rodape.innerHTML =
      '<div class="carrinho-modo" role="radiogroup" aria-label="Retirada ou entrega">' +
        opcaoModo('retirada', 'Retirar na loja', 'sem taxa, sem mínimo') +
        opcaoModo('entrega', 'Receber em casa', R.formatarReais(ent.taxa) + ' · até ' + ent.raioKm + ' km') +
      '</div>' +
      '<div class="carrinho-campos">' +
        '<label>Seu nome<input type="text" id="cNome" autocomplete="name" value="' + esc(estado.nome) + '" placeholder="Como te chamamos?"></label>' +
        (estado.modo === 'entrega'
          ? '<label>Endereço de entrega<input type="text" id="cEndereco" autocomplete="street-address" value="' + esc(estado.enderecoEntrega) + '" placeholder="Rua, número, bairro e complemento"></label>'
          : '') +
        '<label>Pagamento<select id="cPagamento">' +
          CATALOGO.atendimento.pagamento.map(function (p) {
            return '<option value="' + p.id + '"' + (estado.pagamento === p.id ? ' selected' : '') + '>' + esc(p.rotulo) + '</option>';
          }).join('') +
        '</select></label>' +
        '<label>Observações<input type="text" id="cObs" value="' + esc(estado.observacoes) + '" placeholder="Troco, ponto de referência, alergia…"></label>' +
      '</div>' +
      '<div class="carrinho-totais">' +
        '<div><span>Subtotal</span><span>' + R.formatarReais(R.subtotal(estado.itens)) + '</span></div>' +
        (estado.modo === 'entrega' ? '<div><span>Entrega</span><span>' + R.formatarReais(ent.taxa) + '</span></div>' : '') +
        '<div class="carrinho-totais__total"><span>Total</span><span>' + R.formatarReais(R.total(estado)) + '</span></div>' +
      '</div>' +
      (bloqueio ? '<p class="carrinho-aviso" role="alert">' + esc(bloqueio) + '</p>' : '') +
      '<button class="btn btn--zap btn--bloco" id="cEnviar" type="button"' + (bloqueio ? ' disabled' : '') + '>' +
        ICONE_ZAP + 'Enviar pedido no WhatsApp</button>' +
      '<p class="carrinho-nota">O pedido abre pronto na conversa. Você confirma tudo com a gente antes de pagar.</p>';

    el.rodape.querySelectorAll('input[name=cModo]').forEach(function (r) {
      r.addEventListener('change', function () { estado.modo = r.value; salvar(); renderGaveta(); });
    });
    ligarCampo('cNome', 'nome'); ligarCampo('cEndereco', 'enderecoEntrega'); ligarCampo('cObs', 'observacoes');
    var sel = document.getElementById('cPagamento');
    sel.addEventListener('change', function () { estado.pagamento = sel.value; salvar(); });
    document.getElementById('cEnviar').addEventListener('click', enviarPedido);
  }

  function ligarCampo(id, chave) {
    var inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener('input', function () { estado[chave] = inp.value; salvar(); });
  }

  function opcaoModo(valor, rotulo, sub) {
    return '<label class="carrinho-modo__opcao"><input type="radio" name="cModo" value="' + valor + '"' +
      (estado.modo === valor ? ' checked' : '') + '><span><strong>' + rotulo + '</strong><small>' + sub + '</small></span></label>';
  }

  /* ---------------------------------------------------------------- envio */
  function enviarPedido() {
    if (R.bloqueioMinimo(estado)) return;
    var msg = R.montarMensagem(estado);
    console.log('[conversao]', { value: R.total(estado) / 100, currency: 'BRL' }); // ponto de ligação para GA4/Ads
    if (R.mensagemCabeNaUrl(msg)) {
      var url = 'https://wa.me/' + CATALOGO.contato.whatsapp + '?text=' + encodeURIComponent(msg);
      var janela = window.open(url, '_blank', 'noopener');
      mostrarEnviado(url, !janela);
    } else {
      abrirModalMensagemGrande(msg);
    }
  }

  /* Estado pós-envio: a gaveta confirma o que aconteceu e oferece o link
     de novo — bloqueador de popup é comum no celular e, sem isso, o
     cliente clica em "Enviar" e nada acontece. */
  function mostrarEnviado(url, bloqueado) {
    el.corpo.innerHTML =
      '<div class="carrinho-enviado" role="status">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>' +
        '<h3>' + (bloqueado ? 'Seu pedido está pronto' : 'Pedido enviado para o WhatsApp') + '</h3>' +
        '<p>' + (bloqueado
          ? 'O navegador bloqueou a abertura automática. Toque no botão abaixo para abrir a conversa com o pedido já preenchido.'
          : 'Abrimos a conversa com o pedido preenchido. É só confirmar por lá com a gente.') + '</p>' +
        '<a class="btn btn--zap btn--bloco" href="' + esc(url) + '" target="_blank" rel="noopener">' + ICONE_ZAP + (bloqueado ? 'Abrir o WhatsApp' : 'A conversa não abriu? Toque aqui') + '</a>' +
      '</div>';
    el.rodape.innerHTML =
      '<button class="btn btn--contorno-azul btn--bloco" type="button" id="cNovo">Começar outro pedido</button>' +
      '<p class="carrinho-nota">Seu pedido continua salvo aqui até você limpar.</p>';
    document.getElementById('cNovo').addEventListener('click', function () {
      estado.itens = []; estado.observacoes = '';
      salvar(); atualizarContagem(); renderGaveta();
    });
  }

  function abrirModalMensagemGrande(msg) {
    var modal = document.createElement('div');
    modal.className = 'item-modal'; modal.dataset.aberto = 'true';
    modal.innerHTML =
      '<div class="item-modal__topo"><h3>Pedido grande</h3><button class="fechar" type="button" aria-label="Fechar">' + ICONE_FECHAR + '</button></div>' +
      '<div class="item-modal__corpo"><p>Seu pedido é longo e o link direto do WhatsApp pode cortar a mensagem. Copie o texto e cole na conversa que vamos abrir.</p>' +
        '<pre class="mensagem-grande">' + esc(msg) + '</pre></div>' +
      '<div class="item-modal__rodape"><button class="btn btn--zap btn--bloco" id="copiarPedido" type="button">Copiar pedido e abrir WhatsApp</button></div>';
    document.body.appendChild(modal);
    function fechar() { modal.remove(); }
    modal.querySelector('.fechar').addEventListener('click', fechar);
    modal.querySelector('#copiarPedido').addEventListener('click', function () {
      var abrir = function () {
        window.open('https://wa.me/' + CATALOGO.contato.whatsapp + '?text=' + encodeURIComponent('Olá! Fiz um pedido pelo site, vou colar os detalhes aqui.'), '_blank', 'noopener');
        fechar();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(abrir, abrir);
      else abrir();
    });
  }

  /* ------------------------------------------------------ modal de item */
  var elModal = null;
  function abrirModalItem(id) {
    var it = R.item(id);
    var quantidade = 1;
    var escolhas = {};
    (it.opcoes || []).forEach(function (op) { escolhas[op.id] = []; });

    if (elModal) elModal.remove();
    elModal = document.createElement('div');
    elModal.className = 'item-modal';
    document.body.appendChild(elModal);
    el.fundo.dataset.aberto = 'true';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { elModal.dataset.aberto = 'true'; });

    /* Delegação: um listener no elModal (nunca recriado); o innerHTML dos
       filhos muda, o listener sobrevive. */
    elModal.addEventListener('click', aoClicar);
    elModal.addEventListener('change', aoMudar);

    function fechar() {
      elModal.dataset.aberto = 'false';
      if (el.gaveta.dataset.aberto !== 'true') { el.fundo.dataset.aberto = 'false'; document.body.style.overflow = ''; }
    }

    function precoUnit() {
      var extras = 0;
      (it.opcoes || []).forEach(function (op) {
        if (op.tipo === 'extras') escolhas[op.id].forEach(function (n) { extras += R.precoExtra(op, n); });
      });
      return it.preco + extras;
    }

    function renderOpcao(op) {
      var valores = R.valoresDaOpcao(op);
      var tipoInput = (op.tipo === 'escolha' || (op.tipo === 'sabores' && op.max === 1)) ? 'radio' : 'checkbox';
      var ajuda = '';
      if (op.tipo === 'sabores' && op.max > 1) ajuda = 'Escolha de ' + op.min + ' a ' + op.max;
      else if (op.tipo === 'sabores' || op.tipo === 'escolha') ajuda = op.opcional ? 'Opcional' : 'Escolha 1';
      else if (op.tipo === 'multi') ajuda = 'Até ' + op.max + ', sem custo';
      else if (op.tipo === 'extras') ajuda = 'Opcional, cobrado à parte';

      var grupos = op.tipo === 'sabores'
        ? CATALOGO.saboresGelato.map(function (g) { return { titulo: g.grupo, itens: g.sabores }; })
        : [{ titulo: null, itens: valores }];

      return '<fieldset class="opcao" data-opcao="' + op.id + '">' +
        '<legend>' + esc(op.rotulo) + (ajuda ? ' <small>' + ajuda + '</small>' : '') + '</legend>' +
        grupos.map(function (g) {
          return (g.titulo ? '<p class="opcao__grupo">' + esc(g.titulo) + '</p>' : '') +
            '<div class="opcao__lista">' + g.itens.map(function (nome) {
              var preco = op.tipo === 'extras' ? ' <em>+' + R.formatarReais(R.precoExtra(op, nome)) + '</em>' : '';
              return '<label class="opcao__item"><input type="' + tipoInput + '" name="op-' + op.id + '" value="' + esc(nome) + '">' +
                '<span>' + esc(nome) + preco + '</span></label>';
            }).join('') + '</div>';
        }).join('') +
      '</fieldset>';
    }

    function render() {
      elModal.innerHTML =
        '<div class="item-modal__topo"><div><h3>' + esc(it.nome) + '</h3>' +
          '<p class="item-modal__preco">' + R.formatarReais(it.preco) + (it.serve ? ' · serve ' + esc(it.serve) : '') + '</p></div>' +
          '<button class="fechar" type="button" aria-label="Fechar">' + ICONE_FECHAR + '</button></div>' +
        '<div class="item-modal__corpo">' +
          (it.descricao ? '<p class="item-modal__descricao">' + esc(it.descricao) + '</p>' : '') +
          (it.opcoes || []).map(renderOpcao).join('') +
          '<p class="item-modal__erro" data-erro role="alert" hidden></p>' +
        '</div>' +
        '<div class="item-modal__rodape">' +
          '<div class="qtd"><button type="button" data-qtd="-1" aria-label="Diminuir">−</button>' +
            '<span data-qtd-texto>1</span><button type="button" data-qtd="1" aria-label="Aumentar">+</button></div>' +
          '<button class="btn btn--dourado" type="button" id="modalAdicionar">Adicionar ao pedido <span data-preco></span></button>' +
        '</div>';
      atualizarRodape();
    }

    function atualizarRodape() {
      elModal.querySelector('[data-qtd-texto]').textContent = String(quantidade);
      elModal.querySelector('[data-qtd="-1"]').disabled = quantidade <= 1;
      elModal.querySelector('[data-preco]').textContent = R.formatarReais(precoUnit() * quantidade);
      // Trava o checkbox extra quando o máximo foi atingido — feedback imediato
      (it.opcoes || []).forEach(function (op) {
        if (op.tipo !== 'sabores' && op.tipo !== 'multi') return;
        if (!op.max || op.max === 1) return;
        var cheio = escolhas[op.id].length >= op.max;
        elModal.querySelectorAll('[name="op-' + op.id + '"]').forEach(function (inp) {
          inp.disabled = cheio && !inp.checked;
        });
      });
    }

    function mostrarErro(msg) {
      var p = elModal.querySelector('[data-erro]');
      p.textContent = msg || ''; p.hidden = !msg;
      if (msg) p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function aoMudar(e) {
      var inp = e.target;
      if (!inp.name || inp.name.indexOf('op-') !== 0) return;
      var opId = inp.name.slice(3);
      if (inp.type === 'radio') escolhas[opId] = [inp.value];
      else {
        escolhas[opId] = Array.prototype.map.call(
          elModal.querySelectorAll('[name="op-' + opId + '"]:checked'), function (c) { return c.value; });
      }
      mostrarErro('');
      atualizarRodape();
    }

    function aoClicar(e) {
      var t = e.target;
      if (t.closest('.fechar')) { fechar(); return; }
      var btnQtd = t.closest('[data-qtd]');
      if (btnQtd) { quantidade = Math.max(1, quantidade + Number(btnQtd.dataset.qtd)); atualizarRodape(); return; }
      if (t.closest('#modalAdicionar')) {
        var r = R.montarItem({ id: id, quantidade: quantidade, escolhas: escolhas });
        if (!r.ok) { mostrarErro(r.erros[0]); return; }
        estado.itens.push(r.item);
        salvar(); atualizarContagem();
        fechar(); abrirGaveta();
      }
    }

    render();
  }

  /* -------------------------------------------------------------- ligação
     Botão com data-venda="id" abre o modal. Como o cardápio é renderizado
     pelo site.js, usamos delegação no document. */
  function ligarBotoes() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-venda]');
      if (!b) return;
      e.preventDefault();
      try { abrirModalItem(b.dataset.venda); } catch (err) { console.error('carrinho:', err); }
    });
  }

  function iniciar() { carregar(); montarEsqueleto(); atualizarContagem(); ligarBotoes(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
