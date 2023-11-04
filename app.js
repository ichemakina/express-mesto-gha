const http = require('http');
const { PORT= 3000 } = process.env;

const server = http.createServer();

server.listen(PORT);