const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || '5000';

http.createServer(app).listen(PORT, () => {
  console.log(`Backend HTTP server listening on port ${PORT}.`);
});
