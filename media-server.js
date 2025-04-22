const http = require('node:http');
const { title } = require('node:process');
const PORT = 3000;

let movies = [
    { title: "Edge of Reality", year: 2023 },
    { title: "Silent Echoes", year: 2022 },
    { title: "Moonlight Chase", year: 2025 },
    { title: "Crimson Skies", year: 2020 },
    { title: "Beyond the Frame", year: 2024 }
];

let series = [
    { title: "Echo City", seasons: 4 },
    { title: "Code Zero", seasons: 2 },
    { title: "The Signal", seasons: 3 },
    { title: "Fractured", seasons: 5 },
    { title: "The Summit", seasons: 1 }
];

let songs = [
    { title: "Jerusalema", artist: "Master KG" },
    { title: "Fetch Your Life", artist: "Prince Kaybee ft. Msaki" },
    { title: "Osama", artist: "Zakes Bantwini" },
    { title: "uMlando", artist: "Toss, 9umba & Mdoovar" },
    { title: "Love You Tonight", artist: "MFR Souls ft. DJ Maphorisa, Kabza De Small & Sha Sha" }
];


// Initialize the server
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');

    if (url === '/movies') {
        handleRequest(req, res, movies);
    } else if (url === '/series') {
        handleRequest(req, res, series);
    } else if (url === '/songs') {
        handleRequest(req, res, songs);
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

function handleRequest(req, res, dataArray) {
    let body = "";
    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {
        if (req.method === "GET") {
            res.end(JSON.stringify(dataArray));
        } else if (req.method === "POST") {
            const newItem = JSON.parse(body);
            dataArray.push(newItem);
            res.end(JSON.stringify(dataArray));
        } else if (req.method === "DELETE") {
            const { title } = JSON.parse(body);
            const index = dataArray.findIndex(item => item.title === title);

            if (index !== -1) {
                dataArray.splice(index, 1);
            }

            res.end(JSON.stringify(dataArray));
        } else if (req.method === "PUT") {
            const updatedItem = JSON.parse(body);
            const index = dataArray.findIndex(item => item.title === updatedItem.title);

            if (index !== -1) {
                dataArray[index] = updatedItem;
            }

            res.end(JSON.stringify(dataArray));
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
