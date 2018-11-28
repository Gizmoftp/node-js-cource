var socket = io();

socket.on('connect', () => {
    console.log('connected to server');

    socket.emit('createMessage', {
        from : 'andrew',
        text: 'hello from andrew'
    });
})
socket.on('disconnect', () => {
    console.log('Disconnected from server');
})

socket.on('newMessage', (msg) => {
console.log('new message', msg)
})