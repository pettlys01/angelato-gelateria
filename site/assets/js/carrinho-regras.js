/* ==========================================================================
   Regras de negócio do carrinho — Gelateria Angelato

   Puro: nenhuma função aqui toca o DOM, localStorage ou WhatsApp. Só recebe
   dados e devolve dados — é o que permite testar (carrinho-regras.test.js)
   sem abrir navegador.

   Publica em `window.CarrinhoRegras` para o site e via `module.exports`
   para o Node.
   ========================================================================== */
(function (global) {
  'use strict';

  var CATALOGO = (typeof require === 'function' && typeof module !== 'undefined')
    ? require('./catalogo.js') : global.CATALOGO;

  /* --------------------------------------------------------------- lookup */
  function item(id) {
    var it = CATALOGO.itens.find(function (x) { return x.id === id; });
    if (!it) throw new Error('item inexistente no catalogo.js: ' + id);
    return it;
  }

  function categoria(id) {
    return CATALOGO.categorias.find(function (c) { return c.id === id; });
  }

  function todosSabores() {
    return CATALOGO.saboresGelato.reduce(function (acc, g) { return acc.concat(g.sabores); }, []);
  }

  /* Lista de valores válidos de uma opção. 'sabores' vem da grade de
     sabores de gelato; as outras apontam por nome para CATALOGO.listas. */
  function valoresDaOpcao(op) {
    if (op.tipo === 'sabores') return todosSabores();
    var lista = CATALOGO.listas[op.lista];
    if (!lista) throw new Error('lista inexistente: ' + op.lista);
    return op.tipo === 'extras' ? lista.map(function (e) { return e.nome; }) : lista;
  }

  function precoExtra(op, nome) {
    var e = CATALOGO.listas[op.lista].find(function (x) { return x.nome === nome; });
    return e ? e.preco : 0;
  }

  /* ------------------------------------------------------------ validação
     escolhas = { [opcaoId]: [valores...] } — sempre array, mesmo para
     'escolha' (1 valor). Devolve null quando válido ou a mensagem de erro. */
  function validarOpcao(op, valores) {
    valores = valores || [];
    var validos = valoresDaOpcao(op);
    for (var i = 0; i < valores.length; i++) {
      if (validos.indexOf(valores[i]) === -1) return 'Opção inválida em ' + op.rotulo + ': ' + valores[i];
    }
    var unicos = valores.filter(function (v, i) { return valores.indexOf(v) === i; });
    if (unicos.length !== valores.length) return 'Opção repetida em ' + op.rotulo + '.';

    if (op.tipo === 'escolha') {
      if (valores.length === 0) return op.opcional ? null : 'Falta escolher: ' + op.rotulo.toLowerCase() + '. Toque em uma das opções para continuar.';
      if (valores.length > 1) return 'Só dá para escolher 1 em ' + op.rotulo.toLowerCase() + '. Desmarque uma para trocar.';
      return null;
    }
    if (op.tipo === 'sabores' || op.tipo === 'multi') {
      var min = op.min || 0, max = op.max || Infinity;
      if (valores.length < min) return (op.tipo === 'sabores' ? 'Falta escolher o sabor. ' : 'Falta escolher: ' + op.rotulo.toLowerCase() + '. ') + 'Toque em ' + (min > 1 ? 'pelo menos ' + min + ' opções' : 'uma opção') + ' para continuar.';
      if (valores.length > max) return 'Só cabem ' + max + ' em ' + op.rotulo.toLowerCase() + '. Desmarque uma para trocar.';
      return null;
    }
    return null; // extras: qualquer quantidade
  }

  /* --------------------------------------------------------- monta item
     Única porta de entrada para criar um item de carrinho. */
  function montarItem(input) {
    var it = item(input.id);
    var qtd = Number(input.quantidade) || 1;
    var erros = [];
    if (qtd < 1 || qtd !== Math.round(qtd)) erros.push('Quantidade inválida.');

    var escolhas = {};
    var extrasCentavos = 0;
    (it.opcoes || []).forEach(function (op) {
      var valores = (input.escolhas && input.escolhas[op.id]) || [];
      var erro = validarOpcao(op, valores);
      if (erro) erros.push(erro);
      escolhas[op.id] = valores.slice();
      if (op.tipo === 'extras') {
        valores.forEach(function (n) { extrasCentavos += precoExtra(op, n); });
      }
    });

    if (erros.length) return { ok: false, erros: erros };

    return { ok: true, item: {
      id: it.id,
      nome: it.nome,
      categoria: it.categoria,
      quantidade: qtd,
      precoUnitario: it.preco + extrasCentavos, // preço base + extras, por unidade
      escolhas: escolhas
    } };
  }

  /* --------------------------------------------------------------- total */
  function totalItem(ci) { return ci.precoUnitario * ci.quantidade; }
  function subtotal(itens) { return itens.reduce(function (n, ci) { return n + totalItem(ci); }, 0); }

  function taxaEntrega(modo) {
    return modo === 'entrega' ? CATALOGO.atendimento.entrega.taxa : 0;
  }

  function total(estado) { return subtotal(estado.itens) + taxaEntrega(estado.modo); }

  /* Pedido mínimo vale só para entrega — retirada não tem mínimo. Devolve
     null quando pode enviar ou a mensagem explicando o que falta. */
  function bloqueioMinimo(estado) {
    if (estado.modo !== 'entrega') return null;
    var min = CATALOGO.atendimento.entrega.pedidoMinimo;
    var sub = subtotal(estado.itens);
    if (sub >= min) return null;
    return 'Para entrega, o pedido mínimo é ' + formatarReais(min) + '. Faltam ' + formatarReais(min - sub) + ': adicione mais um item ou escolha retirar na loja, que não tem mínimo.';
  }

  /* ----------------------------------------------------- revalidação
     Ao carregar um carrinho salvo, cada item é conferido contra o catálogo
     ATUAL. Preço mudou ou item sumiu → marcado, nunca corrigido em
     silêncio: quem decide se aceita é o cliente, olhando o aviso. */
  function revalidar(itens) {
    var avisos = [];
    var atualizados = itens.map(function (ci) {
      var it = CATALOGO.itens.find(function (x) { return x.id === ci.id; });
      if (!it) { avisos.push(ci.nome + ' não existe mais no cardápio.'); return null; }
      var r = montarItem({ id: ci.id, quantidade: ci.quantidade, escolhas: ci.escolhas });
      if (!r.ok) { avisos.push(ci.nome + ': ' + r.erros[0]); return null; }
      if (r.item.precoUnitario !== ci.precoUnitario) {
        avisos.push(ci.nome + ': preço atualizado de ' + formatarReais(ci.precoUnitario) +
                    ' para ' + formatarReais(r.item.precoUnitario) + '.');
      }
      return r.item;
    }).filter(Boolean);
    return { itens: atualizados, avisos: avisos };
  }

  /* ------------------------------------------------------------- formato */
  function formatarReais(centavos) {
    return 'R$ ' + (centavos / 100).toFixed(2).replace('.', ',');
  }

  /* Resumo das escolhas de um item, na ordem das opções do catálogo:
       "Pistache, Morango · calda Chocolate · + Nutella, Paçoca" */
  function resumoEscolhas(ci) {
    var it = item(ci.id);
    var partes = [];
    (it.opcoes || []).forEach(function (op) {
      var v = ci.escolhas[op.id] || [];
      if (!v.length) return;
      if (op.tipo === 'extras') partes.push('+ ' + v.join(', '));
      else if (op.id === 'calda') partes.push('calda ' + v.join(', '));
      else partes.push(v.join(', '));
    });
    return partes.join(' · ');
  }

  /* Uma linha do pedido:
       2x Pote de gelato 800ml · Pistache, Morango — R$ 219,80 */
  function linhaItem(ci) {
    var resumo = resumoEscolhas(ci);
    return ci.quantidade + 'x ' + ci.nome + (resumo ? ' · ' + resumo : '') + ' — ' + formatarReais(totalItem(ci));
  }

  var ROTULO_PAGAMENTO = {};
  CATALOGO.atendimento.pagamento.forEach(function (p) { ROTULO_PAGAMENTO[p.id] = p.rotulo; });

  /* Mensagem completa enviada ao WhatsApp. Determinística: mesma entrada,
     mesma saída. */
  function montarMensagem(estado) {
    var linhas = ['*PEDIDO PELO SITE — Gelateria Angelato*', ''];
    estado.itens.forEach(function (ci) { linhas.push(linhaItem(ci)); });
    linhas.push('');
    linhas.push('Subtotal: ' + formatarReais(subtotal(estado.itens)));
    if (estado.modo === 'entrega') {
      linhas.push('Entrega: ' + formatarReais(taxaEntrega('entrega')));
      linhas.push('*Total: ' + formatarReais(total(estado)) + '*');
      linhas.push('');
      linhas.push('Entrega em: ' + (estado.enderecoEntrega || '(endereço não informado)'));
    } else {
      linhas.push('*Total: ' + formatarReais(total(estado)) + '*');
      linhas.push('');
      linhas.push('Retirada na loja');
    }
    if (estado.nome) linhas.push('Nome: ' + estado.nome);
    linhas.push('Pagamento: ' + (ROTULO_PAGAMENTO[estado.pagamento] || estado.pagamento || 'a combinar'));
    if (estado.observacoes) linhas.push('Obs.: ' + estado.observacoes);
    return linhas.join('\n');
  }

  /* Tamanho real da URL, não da string crua: acentos e pontuação viram %XX
     em encodeURIComponent, e é isso que o wa.me recebe. */
  function comprimentoUrl(msg) { return encodeURIComponent(msg).length; }
  function mensagemCabeNaUrl(msg) { return comprimentoUrl(msg) <= CATALOGO.LIMITE_MENSAGEM; }

  var API = {
    item: item, categoria: categoria, todosSabores: todosSabores, valoresDaOpcao: valoresDaOpcao,
    precoExtra: precoExtra, validarOpcao: validarOpcao, montarItem: montarItem,
    totalItem: totalItem, subtotal: subtotal, taxaEntrega: taxaEntrega, total: total,
    bloqueioMinimo: bloqueioMinimo, revalidar: revalidar,
    formatarReais: formatarReais, resumoEscolhas: resumoEscolhas, linhaItem: linhaItem,
    montarMensagem: montarMensagem, comprimentoUrl: comprimentoUrl, mensagemCabeNaUrl: mensagemCabeNaUrl
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (typeof window !== 'undefined') window.CarrinhoRegras = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
