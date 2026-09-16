/* ==========================================================================
   Gelateria Angelato — fonte única de dados do site (V1 DEMO)

   Todo texto de negócio e todo preço saem daqui. O cardápio na página é
   renderizado a partir deste arquivo (site.js) e o carrinho lê os mesmos
   dados — nunca existe preço duplicado em HTML.

   Carregado pelo navegador (window.CATALOGO) e pelo Node (module.exports)
   para os testes de carrinho-regras.test.js.

   Preços em CENTAVOS e inteiros — ponto flutuante acumula erro na soma e
   um centavo de diferença entre o site e o WhatsApp destrói a confiança
   no pedido. Formata-se para "R$ 36,90" só na hora de exibir.

   ⚠️  MARCAÇÃO DE PLACEHOLDER
   Tudo que está marcado com "PLACEHOLDER" abaixo é dado FICTÍCIO da demo e
   precisa ser trocado pelo dado real antes do lançamento. A lista
   consolidada está em PENDENTES.md na raiz do projeto.
   ========================================================================== */
var CATALOGO = {

  /* ------------------------------------------------------------ contato
     Dados REAIS (print do WhatsApp e do iFood, 14/09/2026). */
  contato: {
    nome: 'Gelateria Angelato',
    whatsapp: '551125347781',                 // real — +55 11 2534-7781
    whatsappExibicao: '(11) 2534-7781',
    instagram: 'gelateria.angelato',          // real
    instagramUrl: 'https://www.instagram.com/gelateria.angelato/',
    linktree: 'https://linktr.ee/gelateria.angelato',
    ifoodUrl: 'https://www.ifood.com.br/delivery/sao-bernardo-do-campo-sp/gelateria-angelato-centro/3ed09a91-4556-40b9-8d5f-98351cb94676',
    email: 'contato@gelateriaangelato.com.br', // PLACEHOLDER — e-mail fictício
    endereco: {
      rua: 'Av. Barão de Mauá, 401',
      bairro: 'Centro',                       // real (iFood); o Instagram diz "Chácara Inglesa"
      cidade: 'São Bernardo do Campo - SP',
      cep: 'CEP 09726-000'
    },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Bar%C3%A3o+de+Mau%C3%A1%2C+401+-+S%C3%A3o+Bernardo+do+Campo+-+SP',
    cnpj: '40.954.698/0001-07'                // real (iFood)
  },

  /* -------------------------------------------------------- atendimento */
  atendimento: {
    /* Horário REAL — extraído do iFood em 14/09/2026. O da loja física
       pode diferir; confirmar com o cliente antes do lançamento. */
    horario: [
      { dia: 'Segunda', horas: '11h às 23h30' },
      { dia: 'Terça',   horas: '11h às 23h30' },
      { dia: 'Quarta',  horas: '11h às 23h45' },
      { dia: 'Quinta',  horas: '11h às 23h59' },
      { dia: 'Sexta',   horas: '11h às 23h59' },
      { dia: 'Sábado',  horas: '11h às 23h59' },
      { dia: 'Domingo', horas: '10h às 23h30' }
    ],
    horarioCurto: 'Todos os dias, das 11h às 23h30 (domingo abre às 10h)',

    /* PLACEHOLDER — regras de entrega fictícias da demo. */
    entrega: {
      raioKm: 5,
      taxa: 890,          // R$ 8,90
      pedidoMinimo: 2500, // R$ 25,00 — só para entrega; retirada não tem mínimo
      texto: 'Entregamos num raio de 5 km da loja. Taxa de R$ 8,90 e pedido mínimo de R$ 25. Retirada na loja sem taxa e sem mínimo.'
    },

    /* Bandeiras de cartão são REAIS (iFood). Pix e dinheiro são
       PLACEHOLDER — confirmar o que a loja aceita no balcão/entrega. */
    pagamento: [
      { id: 'pix',      rotulo: 'Pix' },
      { id: 'debito',   rotulo: 'Cartão de débito' },
      { id: 'credito',  rotulo: 'Cartão de crédito' },
      { id: 'dinheiro', rotulo: 'Dinheiro' }
    ],
    bandeiras: 'Visa, Mastercard, Elo, Amex e Hipercard'
  },

  /* ------------------------------------------------------------ sabores
     PLACEHOLDER — o cardápio real fala em "mais de 50 sabores" (iFood) e
     "76 sabores" (milk shake), mas a lista nunca foi enviada. Os 24
     abaixo são fictícios e existem só para a demo funcionar. */
  saboresGelato: [
    { grupo: 'Cremosos',  cor: '#f1e4cf', sabores: ['Baunilha', 'Chocolate ao Leite', 'Chocolate Belga 70%', 'Doce de Leite', 'Ninho com Nutella', 'Pistache', 'Zabaione'] },
    { grupo: 'Frutas',    cor: '#e9c7b3', sabores: ['Morango', 'Manga', 'Maracujá', 'Limão Siciliano', 'Coco', 'Frutas Vermelhas', 'Abacaxi com Hortelã'] },
    { grupo: 'Especiais', cor: '#c8b976', sabores: ['Tiramisù', 'Nutella', 'Cookies & Cream', 'Ovomaltine', 'Brigadeiro', 'Beijinho', 'Paçoca'] },
    { grupo: 'Sorbets',   cor: '#a9c3d9', sabores: ['Sorbet de Manga', 'Sorbet de Frutas Vermelhas', 'Sorbet de Limão'] }
  ],

  /* Listas auxiliares de opções (PLACEHOLDER, exceto onde indicado). */
  listas: {
    caldas: ['Chocolate', 'Morango', 'Caramelo', 'Doce de Leite'],                 // PLACEHOLDER (iFood cita choc/morango/caramelo)
    acaiGratis: ['Granola', 'Leite condensado', 'Banana', 'Morango'],             // PLACEHOLDER
    acaiExtras: [                                                                  // PLACEHOLDER
      { nome: 'Nutella', preco: 400 },
      { nome: 'Leite Ninho', preco: 300 },
      { nome: 'Paçoca', preco: 300 },
      { nome: 'Amendoim', preco: 300 }
    ],
    cassata: ['Baunilha', 'Chocolate', 'Morango', 'Pistache', 'Doce de Leite', 'Coco', 'Maracujá', 'Café', 'Avelã', 'Frutas Vermelhas'], // PLACEHOLDER
    bolo: ['Chocolate', 'Baunilha', 'Morango', 'Doce de Leite', 'Pistache'],       // PLACEHOLDER
    tartufo: ['Coco', 'Chocolate'],                                                // real (iFood)
    fondueFrutas: ['Uva', 'Morango', 'Banana'],                                    // real (iFood)
    esfiha: ['Carne', 'Frango']                                                    // real (iFood)
  },

  /* ---------------------------------------------------------- categorias */
  categorias: [
    { id: 'gelatos',    nome: 'Gelatos',              descricao: 'Potes para levar, milk shake e combos com bola de gelato.' },
    { id: 'sobremesas', nome: 'Sobremesas',           descricao: 'Sobremesas premium individuais, bolos e cassatas.' },
    { id: 'casquinhas', nome: 'Casquinhas & Cestões', descricao: 'Casquinha italiana artesanal para montar em casa.' },
    { id: 'acai',       nome: 'Açaí & Cupuaçu',       descricao: 'Açaí premium com acompanhamentos e creme de cupuaçu.' },
    { id: 'extras',     nome: 'Salgados & Bebidas',   descricao: 'Para acompanhar o pedido.' }
  ],

  /* ---------------------------------------------------------------- itens
     Nomes e preços REAIS do iFood (14/09/2026), sem markup, com a menção
     "100% Damp" removida dos nomes exibidos. Único descarte: a duplicata
     do Bolo de Gelato (ficou só a versão "Delprincipe").

     opcoes[] descreve o que o cliente escolhe no modal:
       tipo 'sabores'  → escolhe de 1 até max sabores da lista de gelatos
       tipo 'escolha'  → escolhe exatamente 1 da lista
       tipo 'multi'    → escolhe de min até max da lista (grátis)
       tipo 'extras'   → adicionais pagos, quantos quiser
     Sem opcoes[] → item entra direto no carrinho. */
  itens: [
    /* ---------------------------------------------------------- gelatos */
    { id: 'milkshake', categoria: 'gelatos', destaque: true, ilustracao: 'milkshake',
      nome: 'Milk shake 400ml',
      descricao: 'Gelato italiano batido com o sabor que você escolher, calda e chantilly.',
      preco: 3690,
      opcoes: [
        { id: 'sabor', rotulo: 'Sabor do gelato', tipo: 'sabores', min: 1, max: 1 },
        { id: 'calda', rotulo: 'Calda', tipo: 'escolha', lista: 'caldas' }
      ] },
    { id: 'pote-350', categoria: 'gelatos', ilustracao: 'pote',
      nome: 'Pote de gelato 350ml',
      descricao: 'Até 2 sabores. Ideal para 1 pessoa.',
      serve: '1 pessoa', preco: 4490,
      opcoes: [{ id: 'sabor', rotulo: 'Sabores', tipo: 'sabores', min: 1, max: 2 }] },
    { id: 'pote-800', categoria: 'gelatos', destaque: true, ilustracao: 'pote',
      nome: 'Pote de gelato 800ml',
      descricao: 'Até 4 sabores. Embalagem ideal para compartilhar.',
      serve: 'até 5 pessoas', preco: 10990,
      opcoes: [{ id: 'sabor', rotulo: 'Sabores', tipo: 'sabores', min: 1, max: 4 }] },
    { id: 'pote-1500', categoria: 'gelatos', ilustracao: 'pote',
      nome: 'Pote de gelato 1500ml',
      descricao: 'Até 5 sabores. Para a família inteira.',
      serve: 'até 9 pessoas', preco: 17690,
      opcoes: [{ id: 'sabor', rotulo: 'Sabores', tipo: 'sabores', min: 1, max: 5 }] },
    { id: 'combo-bambino', categoria: 'gelatos', ilustracao: 'taca',
      nome: 'Combo Premium Bambino + bola de gelato',
      descricao: 'Bambino + 1 bola de gelato à sua escolha + biju crocante + calda.',
      serve: '2 pessoas', preco: 3690,
      opcoes: [
        { id: 'sabor', rotulo: 'Sabor da bola de gelato', tipo: 'sabores', min: 1, max: 1 },
        { id: 'calda', rotulo: 'Calda', tipo: 'escolha', lista: 'caldas' }
      ] },
    { id: 'canjica', categoria: 'gelatos', ilustracao: 'pote',
      nome: 'Canjica cremosa 250ml',
      descricao: 'Direto do Nordeste para o ABC: canjica extremamente cremosa.',
      serve: 'até 2 pessoas', preco: 1690 },

    /* ------------------------------------------------------- sobremesas */
    { id: 'bambino', categoria: 'sobremesas', destaque: true, ilustracao: 'fatia',
      nome: 'Sobremesa Premium Bambino',
      descricao: 'Gelato de doce de leite e brigadeiro, cobertura de chocolate e granulado.',
      preco: 2690 },
    { id: 'dampino', categoria: 'sobremesas', ilustracao: 'fatia',
      nome: 'Sobremesa Premium Dampino',
      descricao: 'Gelato de creme e chocolate com cereja e cobertura de chocolate.',
      serve: '1 pessoa', preco: 2690 },
    { id: 'cassata-fatia', categoria: 'sobremesas', ilustracao: 'fatia',
      nome: 'Sobremesa Premium Cassata (fatia)',
      descricao: 'Fatia de gelato compactado, com calda de chocolate, morango ou caramelo.',
      preco: 2690,
      opcoes: [
        { id: 'sabor', rotulo: 'Sabor da cassata', tipo: 'escolha', lista: 'cassata' },
        { id: 'calda', rotulo: 'Calda', tipo: 'escolha', lista: 'caldas' }
      ] },
    { id: 'tartufo', categoria: 'sobremesas', ilustracao: 'tartufo',
      nome: 'Sobremesa Premium Tartufo',
      descricao: 'Gelato em forma de bolinha, coberto de chocolate.',
      preco: 2750,
      opcoes: [{ id: 'sabor', rotulo: 'Sabor', tipo: 'escolha', lista: 'tartufo' }] },
    { id: 'icebrownie', categoria: 'sobremesas', ilustracao: 'brownie',
      nome: 'Sobremesa Premium Icebrownie',
      descricao: 'Brownie + 1 bola de gelato + biju crocante + calda à sua escolha.',
      preco: 3490,
      opcoes: [
        { id: 'sabor', rotulo: 'Sabor da bola de gelato', tipo: 'sabores', min: 1, max: 1 },
        { id: 'calda', rotulo: 'Calda', tipo: 'escolha', lista: 'caldas' }
      ] },
    { id: 'petit-gateau', categoria: 'sobremesas', destaque: true, ilustracao: 'brownie',
      nome: 'Petit gateau + bola de gelato',
      descricao: 'Petit gateau quentinho com 1 bola de gelato, calda e biju crocante.',
      serve: '2 pessoas', preco: 3590,
      opcoes: [
        { id: 'sabor', rotulo: 'Sabor da bola de gelato', tipo: 'sabores', min: 1, max: 1 },
        { id: 'calda', rotulo: 'Calda', tipo: 'escolha', lista: 'caldas' }
      ] },
    { id: 'combo-cassata', categoria: 'sobremesas', ilustracao: 'fatia',
      nome: 'Combo Premium Cassata + bola de gelato',
      descricao: '1 cassata (10 sabores à escolha) + bola de gelato + biju crocante + calda.',
      preco: 3590,
      opcoes: [
        { id: 'cassata', rotulo: 'Sabor da cassata', tipo: 'escolha', lista: 'cassata' },
        { id: 'sabor', rotulo: 'Sabor da bola de gelato', tipo: 'sabores', min: 1, max: 1 },
        { id: 'calda', rotulo: 'Calda', tipo: 'escolha', lista: 'caldas' }
      ] },
    { id: 'combo-dampino', categoria: 'sobremesas', ilustracao: 'fatia',
      nome: 'Combo Dampino + bola de gelato',
      descricao: 'Dampino (gelato de creme com chocolate e cereja) + 1 bola de gelato.',
      preco: 3590,
      opcoes: [{ id: 'sabor', rotulo: 'Sabor da bola de gelato', tipo: 'sabores', min: 1, max: 1 }] },
    { id: 'combo-tartufo', categoria: 'sobremesas', ilustracao: 'tartufo',
      nome: 'Combo Premium Tartufo + bola de gelato',
      descricao: 'Tartufo de coco ou chocolate + 1 bola de gelato + biju crocante + calda.',
      preco: 3690,
      opcoes: [
        { id: 'tartufo', rotulo: 'Tartufo', tipo: 'escolha', lista: 'tartufo' },
        { id: 'sabor', rotulo: 'Sabor da bola de gelato', tipo: 'sabores', min: 1, max: 1 },
        { id: 'calda', rotulo: 'Calda', tipo: 'escolha', lista: 'caldas' }
      ] },
    { id: 'fondue', categoria: 'sobremesas', ilustracao: 'fondue',
      nome: 'Fondue de chocolate Nobre 250ml',
      descricao: 'Pote de 250ml de chocolate com frutas: uva, morango e banana.',
      preco: 3690 },
    { id: 'banana-split', categoria: 'sobremesas', ilustracao: 'taca',
      nome: 'Banana split',
      descricao: 'Produzido com os melhores produtos do mercado. Serve até 3 pessoas.',
      serve: 'até 3 pessoas', preco: 7290 },
    { id: 'chocolate-quente', categoria: 'sobremesas', ilustracao: 'xicara',
      nome: 'Chocolate quente cremoso suíço 180ml',
      descricao: 'Sucesso na loja física: requinte e sabor de um verdadeiro chocolate quente.',
      preco: 3200 },
    { id: 'bolo-gelato', categoria: 'sobremesas', destaque: true, ilustracao: 'bolo',
      nome: 'Bolo de gelato 1,4kg',
      descricao: 'Lançamento Delprincipe: gelato de chocolate branco + creme de avelã com cereja. 5 sabores disponíveis, serve 14 pessoas.',
      serve: 'até 14 pessoas', preco: 18590,
      opcoes: [{ id: 'sabor', rotulo: 'Sabor do bolo', tipo: 'escolha', lista: 'bolo' }] },
    { id: 'caixa-cassatas', categoria: 'sobremesas', ilustracao: 'fatia',
      nome: 'Caixa de cassatas (12 unidades)',
      descricao: '12 fatias de cassata, sortidas ou de um único sabor.',
      preco: 22890,
      opcoes: [
        { id: 'montagem', rotulo: 'Montagem', tipo: 'escolha', lista: 'caixaCassata' },
        { id: 'sabor', rotulo: 'Sabor (se for de um único sabor)', tipo: 'escolha', lista: 'cassata', opcional: true }
      ] },

    /* ------------------------------------------------------- casquinhas */
    { id: 'cone-5', categoria: 'casquinhas', ilustracao: 'cone',
      nome: 'Cone crocante — 5 unidades (M)',
      descricao: 'Nossa casquinha italiana artesanal, pacote com 5.',
      preco: 2300 },
    { id: 'casquinha-10', categoria: 'casquinhas', ilustracao: 'cone',
      nome: 'Casquinha crocante — 10 unidades (M)',
      descricao: 'Pacote com 10 cones crocantes tamanho M.',
      preco: 3490 },
    { id: 'cestao-5', categoria: 'casquinhas', ilustracao: 'cestao',
      nome: 'Cestão crocante — 5 unidades',
      descricao: 'Cestinha crocante, pacote com 5 unidades.',
      preco: 2090 },
    { id: 'cestao-10', categoria: 'casquinhas', ilustracao: 'cestao',
      nome: 'Cestão crocante — 10 unidades (M)',
      descricao: 'Cestinha crocante, pacote com 10 unidades tamanho M.',
      preco: 3470 },

    /* ------------------------------------------------------------- açaí */
    { id: 'acai-300', categoria: 'acai', ilustracao: 'acai',
      nome: 'Açaí premium 300ml',
      descricao: '4 acompanhamentos grátis.',
      serve: '1 pessoa', preco: 2790,
      opcoes: [
        { id: 'gratis', rotulo: 'Acompanhamentos grátis', tipo: 'multi', lista: 'acaiGratis', min: 0, max: 4 },
        { id: 'extras', rotulo: 'Extras', tipo: 'extras', lista: 'acaiExtras' }
      ] },
    { id: 'acai-500', categoria: 'acai', destaque: true, ilustracao: 'acai',
      nome: 'Açaí premium 500ml',
      descricao: '4 acompanhamentos grátis.',
      preco: 3290,
      opcoes: [
        { id: 'gratis', rotulo: 'Acompanhamentos grátis', tipo: 'multi', lista: 'acaiGratis', min: 0, max: 4 },
        { id: 'extras', rotulo: 'Extras', tipo: 'extras', lista: 'acaiExtras' }
      ] },
    { id: 'acai-700', categoria: 'acai', ilustracao: 'acai',
      nome: 'Açaí premium 700ml',
      descricao: '4 acompanhamentos grátis.',
      serve: 'até 3 pessoas', preco: 4490,
      opcoes: [
        { id: 'gratis', rotulo: 'Acompanhamentos grátis', tipo: 'multi', lista: 'acaiGratis', min: 0, max: 4 },
        { id: 'extras', rotulo: 'Extras', tipo: 'extras', lista: 'acaiExtras' }
      ] },
    { id: 'barca-900', categoria: 'acai', ilustracao: 'barca',
      nome: 'Barca de açaí premium 900ml',
      descricao: '4 acompanhamentos grátis.',
      serve: 'até 4 pessoas', preco: 7290,
      opcoes: [
        { id: 'gratis', rotulo: 'Acompanhamentos grátis', tipo: 'multi', lista: 'acaiGratis', min: 0, max: 4 },
        { id: 'extras', rotulo: 'Extras', tipo: 'extras', lista: 'acaiExtras' }
      ] },
    { id: 'barca-1450', categoria: 'acai', ilustracao: 'barca',
      nome: 'Barca de açaí premium Family 1.450ml',
      descricao: 'Cerca de 1,2 kg de polpa pura de açaí cremoso. 4 acompanhamentos grátis.',
      serve: 'até 6 pessoas', preco: 11590,
      opcoes: [
        { id: 'gratis', rotulo: 'Acompanhamentos grátis', tipo: 'multi', lista: 'acaiGratis', min: 0, max: 4 },
        { id: 'extras', rotulo: 'Extras', tipo: 'extras', lista: 'acaiExtras' }
      ] },
    { id: 'cupuacu-300', categoria: 'acai', ilustracao: 'pote',
      nome: 'Creme de cupuaçu premium 300ml',
      descricao: 'Selecionado por vários especialistas — e nossa casa fez parte do processo.',
      preco: 3100 },
    { id: 'cupuacu-500', categoria: 'acai', ilustracao: 'pote',
      nome: 'Creme de cupuaçu premium 500ml',
      descricao: 'A versão maior do creme de cupuaçu, serve até 2 pessoas.',
      serve: 'até 2 pessoas', preco: 3580 },

    /* ----------------------------------------------------------- extras */
    { id: 'esfiha', categoria: 'extras', ilustracao: 'esfiha',
      nome: 'Esfiha de carne ou frango (G)',
      descricao: 'Esfiha árabe, sucesso na loja física. Tamanho G, cerca de 220g.',
      preco: 1790,
      opcoes: [{ id: 'recheio', rotulo: 'Recheio', tipo: 'escolha', lista: 'esfiha' }] },
    { id: 'agua', categoria: 'extras', ilustracao: 'garrafa',
      nome: 'Água 500ml', descricao: 'Garrafa 500ml.', preco: 650 },
    { id: 'agua-gas', categoria: 'extras', ilustracao: 'garrafa',
      nome: 'Água com gás 350ml', descricao: 'Garrafa 350ml.', preco: 750 },
    { id: 'monster', categoria: 'extras', ilustracao: 'lata',
      nome: 'Energético Monster Energy 473ml', descricao: 'Lata 473ml.', preco: 1690 }
  ],

  /* ------------------------------------------------------ depoimentos
     PLACEHOLDER — depoimentos e nomes FICTÍCIOS. Nunca publicar como
     reais: trocar por avaliações verdadeiras (Google/iFood) com
     autorização. */
  depoimentos: [
    { nome: 'Mariana T.', bairro: 'Centro, SBC', texto: 'O pistache é o melhor que já comi fora da Itália. Peço o pote de 800ml toda sexta e a família briga pelo último pedaço.' },
    { nome: 'Rodrigo A.', bairro: 'Rudge Ramos', texto: 'Levei o bolo de gelato pro aniversário da minha filha e sobrou nada. Chegou gelado, bem embalado e no horário combinado.' },
    { nome: 'Camila F.', bairro: 'Jardim do Mar', texto: 'Pedir pelo WhatsApp é rápido: escolhi os sabores no site, mandei e em 40 minutos estava aqui. O petit gateau chega quentinho.' }
  ],

  /* Limite prático do link wa.me — acima disso a URL é cortada em alguns
     aparelhos. Medido no COMPRIMENTO CODIFICADO (encodeURIComponent). */
  LIMITE_MENSAGEM: 1800
};

/* Lista derivada: usada pela opção "montagem" da caixa de cassatas. */
CATALOGO.listas.caixaCassata = ['Sortida (vários sabores)', 'Um único sabor'];

if (typeof module !== 'undefined' && module.exports) module.exports = CATALOGO;
