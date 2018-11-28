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
        from: 'jenn',
        text: 'new message is here'
    });

    socket.on('createMessage', (newMessage) => {
        console.log('createMessage',newMessage);
    });

    socket.on('disconnect', () => {
        console.log('The user is disconnected');
    })
})



app.use(express.static(publicPath));

server.listen(port, () => { console.log(`Start listening port ${port}`); });
