const http = require('http');
const fs = require('fs');
const path = require('path');
const fileHandler = require('./fileHandler');

const PORT = 3000;
const dataFilePath = path.join(__dirname, 'data.json');

fileHandler.initializeDataFile(dataFilePath);

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  res.setHeader('Content-Type', 'application/json');

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream('./index.html').pipe(res);

  } else if (url === '/movies' || url === '/series' || url === '/songs') {
    fileHandler.handleDataRequest(req, res, url.slice(1), dataFilePath);

  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
