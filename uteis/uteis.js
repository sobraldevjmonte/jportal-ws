function formatDateForDB(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses são indexados a partir de 0
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Retorna a data atual no formato yyyy-mm-dd
 * @returns {string} - Data atual no formato yyyy-mm-dd
 */
function dataHoje() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() retorna 0-11, então adicione 1
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Formata um número para o formato de moeda BRL (Real Brasileiro)
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado em BRL
 */
function formatToBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Converte uma string de data no formato yyyy-mm-dd para um objeto Date
 * @param {string} dateString - Data no formato yyyy-mm-dd
 * @returns {Date} - Objeto Date correspondente
 */
function parseDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return new Date(year, month - 1, day); // month - 1 porque os meses no objeto Date são 0-11
}

/**
 * Calcula a diferença em dias entre duas datas
 * @param {Date} date1 - Primeira data
 * @param {Date} date2 - Segunda data
 * @returns {number} - Diferença em dias entre as duas datas
 */
function getDaysDifference(date1, date2) {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

module.exports = {
  dataHoje,
  formatToBRL,
  parseDate,
  getDaysDifference,
  formatDateForDB
};
