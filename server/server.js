const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000
let publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);

let io = socketIO(server);

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', {
        from: 'admin',
        text: 'Hello from admin',
        createdAt : new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'admin',
        text: 'New user connected',
        createdAt : new Date().getTime()
    });

    socket.on('createMessage', (msg) => {
        io.emit('newMessage', {
            from: msg.from,
            text: msg.text,
            createdAt : new Date().getTime()
        })
    });

    socket.on('disconnect', () => {
        console.log('The user is disconnected');
    })
    
})



app.use(express.static(publicPath));

server.listen(port, () => { console.log(`Start listening port ${port}`); });
