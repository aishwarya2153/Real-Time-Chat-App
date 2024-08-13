const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(__dirname + '/index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/style.css') {
        fs.readFile(__dirname + '/style.css', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Error loading style.css');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    } else if (req.url === '/socket.io/socket.io.js') {
        fs.readFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Error loading socket.io.js');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
    }
});

const io = require('socket.io')(server);
const port = 5000;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (chat) => {
        io.emit('chat message', chat);
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});
