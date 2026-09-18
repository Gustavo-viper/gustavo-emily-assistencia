/* =====================================================
   GUSTAVO & EMILY - TABELA DE PREÇOS
===================================================== */

const tabelaPrecos = [
  {
    id: 1,
    categoria: "Celulares",
    aparelho: "iPhone 13",
    servico: "Troca de tela",
    preco: 450
  },
  {
    id: 2,
    categoria: "Celulares",
    aparelho: "iPhone 13",
    servico: "Troca de bateria",
    preco: 250
  },
  {
    id: 3,
    categoria: "Celulares",
    aparelho: "Samsung Galaxy A54",
    servico: "Troca de tela",
    preco: 380
  },
  {
    id: 4,
    categoria: "Celulares",
    aparelho: "Samsung Galaxy A54",
    servico: "Troca de bateria",
    preco: 220
  },
  {
    id: 5,
    categoria: "Computadores",
    aparelho: "Notebook",
    servico: "Formatação",
    preco: 120
  },
  {
    id: 6,
    categoria: "Computadores",
    aparelho: "Notebook",
    servico: "Limpeza interna",
    preco: 150
  },
  {
    id: 7,
    categoria: "Computadores",
    aparelho: "Desktop",
    servico: "Formatação",
    preco: 120
  },
  {
    id: 8,
    categoria: "Computadores",
    aparelho: "Desktop",
    servico: "Limpeza interna",
    preco: 150
  }
];

/* =====================================================
   DISPONIBILIZAR PARA O APP.JS
===================================================== */

window.tabelaPrecos = tabelaPrecos;


/* =====================================================
   BUSCAR SERVIÇO
===================================================== */

function buscarPreco(aparelho, servico) {

  if (!aparelho || !servico) {
    return null;
  }

  return tabelaPrecos.find((item) =>
    item.aparelho.trim().toLowerCase() === aparelho.trim().toLowerCase() &&
    item.servico.trim().toLowerCase() === servico.trim().toLowerCase()
  ) || null;
}


/* =====================================================
   CALCULAR ORÇAMENTO
   50% SINAL + 50% NA ENTREGA
===================================================== */

function calcularOrcamento(aparelho, servico) {

  const item = buscarPreco(aparelho, servico);

  if (!item) {

    return {
      encontrado: false,
      mensagem: "Serviço não encontrado na tabela de preços."
    };

  }

  const total = Number(item.preco);

  const sinal = total * 0.5;

  const restante = total * 0.5;

  return {

    encontrado: true,

    aparelho: item.aparelho,

    servico: item.servico,

    total: total,

    sinal: sinal,

    restante: restante

  };

}


/* =====================================================
   DISPONIBILIZAR FUNÇÕES PARA O APP.JS
===================================================== */

window.buscarPreco = buscarPreco;

window.calcularOrcamento = calcularOrcamento;


/* =====================================================
   TESTE
===================================================== */

console.log(
  "Tabela de preços carregada:",
  tabelaPrecos
);

console.log(
  "Teste de orçamento:",
  calcularOrcamento(
    "iPhone 13",
    "Troca de tela"
  )
);