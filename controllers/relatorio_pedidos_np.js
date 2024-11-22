const PdfPrinter = require("pdfmake");

// Fontes necessárias para o pdfmake
const fonts = {
  Roboto: {
    normal: "node_modules/pdfmake/fonts/Roboto-Regular.ttf",
    bold: "node_modules/pdfmake/fonts/Roboto-Bold.ttf",
    italics: "node_modules/pdfmake/fonts/Roboto-Italic.ttf",
    bolditalics: "node_modules/pdfmake/fonts/Roboto-BoldItalic.ttf",
  },
  Consolas: {
    normal: "node_modules/pdfmake/fonts/consola.ttf",
  },
  Georgia: {
    normal: "node_modules/pdfmake/fonts/georgia.ttf",
  },
  Calibri: {
    normal: "node_modules/pdfmake/fonts/calibri.ttf",
    bold: "node_modules/pdfmake/fonts/calibrib.ttf",
  },
};

const printer = new PdfPrinter(fonts);

/**
 * Função para criar o relatório em PDF
 * @param {Array} pedidos - Array de pedidos do banco de dados
 * @returns {Object} - Documento PDF gerado
 */
function criarRelatorioPdfPedidosNp(pedidos) {
  let quantidade = 0

  const body = [
    // Cabeçalho da tabela com o estilo aplicado
    [
      { text: "NP", style: "titulo_corpo" },
      { text: "DATA VENDA", style: "titulo_corpo" },
      { text: "VALOR NP", style: "titulo_corpo" },
      { text: "PROFISSIONAL", style: "titulo_corpo" },
    ],
  ];

  pedidos.forEach((pedido) => {
    body.push([
      { text: pedido.numero_np, style: "corpo" },
      { text: pedido.data_venda, style: "corpo" },
      {
        text: `R$ ${Number(pedido.valor_np).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        style: "corpo",
      },
      { text: pedido.profissional, style: "corpo" },
    ]);
    quantidade++
  });
  // body.push([
  //   { text: "Total de Registros", style: "corpo", colSpan: 3 },
  //   {}, // Célula vazia para alinhamento
  //   { text: pedidos.length, style: "corpo" }, // Exibe a quantidade de pedidos
  // ])

  const docDefinition = {
    content: [
      { text: `Relatório de Pedidos(Profissionais) - Quant.: ${quantidade}`, style: "header" },

      // Tabela dinâmica com os pedidos
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],
          body,
        },
        margin: [0, 10],
      },
    ],
    
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 0],
      },
      subheader: {
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 5],
      },
      corpo: {
        fontSize: 9,
        bold: false,
        margin: [0, 0, 0, 0],
        font: "Calibri",
      },
      titulo_corpo: {
        fontSize: 9,
        bold: true,
        margin: [0, 0, 0, 0],
        font: "Calibri",
      },
    },
  };

  // Retorna o documento PDF
  return printer.createPdfKitDocument(docDefinition);
}

module.exports = criarRelatorioPdfPedidosNp;
