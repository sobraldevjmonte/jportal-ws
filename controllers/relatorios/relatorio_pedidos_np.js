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
    [
      { text: "NP", style: "titulo_corpo" },
      { text: "DATA VENDA", style: "titulo_corpo" },
      { text: "ST", style: "titulo_corpo" },
      { text: "VALOR NP", style: "titulo_corpo" },
      { text: "PROFISSIONAL", style: "titulo_corpo" },
    ],
  ];

  pedidos.forEach((pedido) => {
    body.push([
      { text: pedido.numero_np, style: "corpo" },
      { text: pedido.data_venda, style: "corpo" },
      { text: pedido.status, style: "corpo" },
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

  const docDefinition = {
    content: [
      { text: `Relatório de Pedidos(Profissionais) - Quant.: ${quantidade}`, style: "header" },

      // Tabela dinâmica com os pedidos
      {
        table: {
          headerRows: 1,
          widths: [40, 50, 20,80, '*'],
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
  console.log("================================ chegou aqui documento PDF================================")
  return printer.createPdfKitDocument(docDefinition);
}

module.exports = criarRelatorioPdfPedidosNp;
