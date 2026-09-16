/* Testes das regras do carrinho — rodar com: node site/assets/js/carrinho-regras.test.js */
var assert = require('assert');
var C = require('./catalogo.js');
var R = require('./carrinho-regras.js');

function ok(nome, fn) { try { fn(); console.log('✓', nome); } catch (e) { console.log('✗', nome, '\n  ', e.message); process.exitCode = 1; } }

ok('catálogo: ids únicos e preços inteiros em centavos', function () {
  var ids = {};
  C.itens.forEach(function (it) {
    assert(!ids[it.id], 'id repetido: ' + it.id); ids[it.id] = 1;
    assert(Number.isInteger(it.preco) && it.preco > 0, 'preço inválido: ' + it.id);
    assert(C.categorias.some(function (c) { return c.id === it.categoria; }), 'categoria inexistente: ' + it.id);
    (it.opcoes || []).forEach(function (op) { R.valoresDaOpcao(op); }); // lança se lista não existe
  });
});

ok('pote 800ml: até 4 sabores, 5 é erro', function () {
  var r = R.montarItem({ id: 'pote-800', quantidade: 1, escolhas: { sabor: ['Pistache', 'Morango', 'Nutella', 'Coco'] } });
  assert(r.ok, r.erros); assert.equal(r.item.precoUnitario, 10990);
  var r2 = R.montarItem({ id: 'pote-800', quantidade: 1, escolhas: { sabor: ['Pistache', 'Morango', 'Nutella', 'Coco', 'Manga'] } });
  assert(!r2.ok);
  var r3 = R.montarItem({ id: 'pote-800', quantidade: 1, escolhas: { sabor: [] } });
  assert(!r3.ok, 'sem sabor deve falhar');
});

ok('sabor inexistente é rejeitado', function () {
  var r = R.montarItem({ id: 'pote-350', quantidade: 1, escolhas: { sabor: ['Chiclete'] } });
  assert(!r.ok);
});

ok('milk shake exige sabor e calda', function () {
  assert(!R.montarItem({ id: 'milkshake', quantidade: 1, escolhas: { sabor: ['Baunilha'] } }).ok);
  assert(R.montarItem({ id: 'milkshake', quantidade: 1, escolhas: { sabor: ['Baunilha'], calda: ['Morango'] } }).ok);
});

ok('açaí: extras somam ao preço unitário; grátis limitado a 4', function () {
  var r = R.montarItem({ id: 'acai-500', quantidade: 2, escolhas: { gratis: ['Granola', 'Banana'], extras: ['Nutella', 'Paçoca'] } });
  assert(r.ok, r.erros); assert.equal(r.item.precoUnitario, 3290 + 400 + 300);
  assert.equal(R.totalItem(r.item), (3290 + 700) * 2);
  assert(!R.montarItem({ id: 'acai-500', quantidade: 1, escolhas: { gratis: ['Granola', 'Banana', 'Morango', 'Leite condensado', 'Granola'] } }).ok);
});

ok('item sem opções entra direto', function () {
  var r = R.montarItem({ id: 'canjica', quantidade: 3 });
  assert(r.ok); assert.equal(R.totalItem(r.item), 5070);
});

ok('caixa de cassatas: sabor é opcional', function () {
  assert(R.montarItem({ id: 'caixa-cassatas', quantidade: 1, escolhas: { montagem: ['Sortida (vários sabores)'] } }).ok);
  assert(!R.montarItem({ id: 'caixa-cassatas', quantidade: 1, escolhas: {} }).ok);
});

ok('pedido mínimo só para entrega', function () {
  var it = R.montarItem({ id: 'agua', quantidade: 1 }).item;
  assert.equal(R.bloqueioMinimo({ itens: [it], modo: 'retirada' }), null);
  assert(R.bloqueioMinimo({ itens: [it], modo: 'entrega' }));
});

ok('mensagem: formato e total com taxa', function () {
  var a = R.montarItem({ id: 'pote-800', quantidade: 1, escolhas: { sabor: ['Pistache', 'Morango'] } }).item;
  var b = R.montarItem({ id: 'acai-300', quantidade: 2, escolhas: { gratis: ['Granola'], extras: ['Nutella'] } }).item;
  var msg = R.montarMensagem({ itens: [a, b], modo: 'entrega', enderecoEntrega: 'Rua X, 10', nome: 'Ana', pagamento: 'pix' });
  assert(msg.indexOf('1x Pote de gelato 800ml · Pistache, Morango — R$ 109,90') > -1, msg);
  assert(msg.indexOf('2x Açaí premium 300ml · Granola · + Nutella — R$ 63,80') > -1, msg);
  assert(msg.indexOf('Subtotal: R$ 173,70') > -1, msg);
  assert(msg.indexOf('Entrega: R$ 8,90') > -1, msg);
  assert(msg.indexOf('*Total: R$ 182,60*') > -1, msg);
  assert(msg.indexOf('Pagamento: Pix') > -1, msg);
  assert(R.mensagemCabeNaUrl(msg));
});

ok('revalidar: item removido do catálogo vira aviso', function () {
  var r = R.revalidar([{ id: 'nao-existe', nome: 'Fantasma', quantidade: 1, precoUnitario: 100, escolhas: {} }]);
  assert.equal(r.itens.length, 0); assert.equal(r.avisos.length, 1);
});
