const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation')
const { Users } = require('./utils/users')

const port = process.env.PORT || 3000
let publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);

let io = socketIO(server);
let users = new Users();

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('The error occured')
        }
        else {

            socket.join(params.room);
            users.removeUser(socket.id);
            users.addUser(socket.id, params.name, params.room);
            socket.emit('newMessage', generateMessage('admin', 'Welcome to the chat'));
            io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
            socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} has joined`));

            callback();
        }
    });

    socket.on('createMessage', (msg, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(msg.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
        }

        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords))
        }


    })

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (users) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    })

})

app.use(express.static(publicPath));

server.listen(port, () => { console.log(`Start listening port ${port}`); });
