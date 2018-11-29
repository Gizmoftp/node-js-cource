const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message')

const port = process.env.PORT || 3000
let publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);

let io = socketIO(server);

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage',generateMessage('admin','Welcome to the chat'));

    socket.broadcast.emit('newMessage', generateMessage('admin','New user connected to the chat'));

    socket.on('createMessage', (msg, callback) => {
        io.emit('newMessage', generateMessage(msg.from,msg.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords))
    })

    socket.on('disconnect', () => {
        console.log('The user is disconnected');
    })
    
})

app.use(express.static(publicPath));

server.listen(port, () => { console.log(`Start listening port ${port}`); });
