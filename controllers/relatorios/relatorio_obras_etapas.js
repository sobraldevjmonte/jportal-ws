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
function criarRelatorioPdfObras(pedidos) {
  let quantidade = 0;

  const body = [
    [
      { text: "ID CLIENTE", style: "titulo_corpo" },
      { text: "CLIENTE", style: "titulo_corpo" },
      { text: "ID LOJA", style: "titulo_corpo" },
      { text: "LOJA", style: "titulo_corpo" },
      { text: "COD. VEND.", style: "titulo_corpo" },
      { text: "VENDEDOR", style: "titulo_corpo" },
    ],
  ];

  pedidos.forEach((pedido) => {
    body.push([
      { text: pedido.idcliente, style: "corpo" },
      { text: pedido.nome_cliente, style: "corpo" },
      { text: pedido.idLoja, style: "corpo" },
      { text: pedido.fantasia, style: "corpo" },
      { text: pedido.codigoVendedor, style: "corpo" },
      { text: pedido.nomeUsuario, style: "corpo" },
    ]);
    quantidade++;
  });

  const docDefinition = {
    pageSize: "A4", // Opcional, padrão é 'A4'
    pageOrientation: "landscape", // Define a orientação como paisagem
    content: [
      {
        text: `Relatório de Obras(Etapas/Pendências) - Quant.: ${quantidade}`,
        style: "header",
      },

      // Tabela dinâmica com os pedidos
      {
        table: {
          headerRows: 1,
          widths: [60, 230, 30, 100, 60, "*"],
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

module.exports = criarRelatorioPdfObras;
