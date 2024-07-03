const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3020;
const server = http.createServer(app);
console.log('Servidor(administrativo) rodando na porta ' + port);
server.listen(port);