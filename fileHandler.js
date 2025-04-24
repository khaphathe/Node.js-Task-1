const fs = require('fs');

function initializeDataFile(path) {
  if (!fs.existsSync(path)) {
    const defaultData = {
      movies: [
        { title: "Inception", year: 2010 },
        { title: "Interstellar", year: 2014 }
      ],
      series: [
        { title: "Breaking Bad", seasons: 5 },
        { title: "Stranger Things", seasons: 4 }
      ],
      songs: [
        { title: "Blinding Lights", artist: "The Weeknd" },
        { title: "Shape of You", artist: "Ed Sheeran" }
      ]
    };
    fs.writeFileSync(path, JSON.stringify(defaultData, null, 2));
  }
}

function handleDataRequest(req, res, key, path) {
  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    const data = JSON.parse(fs.readFileSync(path));

    if (req.method === 'GET') {
      res.end(JSON.stringify(data[key]));

    } else if (req.method === 'POST') {
      const newItem = JSON.parse(body);
      data[key].push(newItem);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      res.end(JSON.stringify(data[key]));

    } else if (req.method === 'DELETE') {
      const { title } = JSON.parse(body);
      data[key] = data[key].filter(item => item.title !== title);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      res.end(JSON.stringify(data[key]));

    } else if (req.method === 'PUT') {
      const updatedItem = JSON.parse(body);
      const index = data[key].findIndex(item => item.title === updatedItem.title);
      if (index !== -1) data[key][index] = updatedItem;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      res.end(JSON.stringify(data[key]));
    }
  });
}

module.exports = { initializeDataFile, handleDataRequest };
