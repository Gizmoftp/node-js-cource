var socket = io();

socket.on('connect', () => {
    console.log('connected to server');
})
socket.on('disconnect', () => {
    console.log('Disconnected from server');
})

socket.on('newMessage', (msg) => {
    let li = $('<li></li>');
    li.text(`From ${msg.from}: ${msg.text}`); 

    $('#messages').append(li);
})

$('#message-form').on('submit', (e) => {

    socket.emit('createMessage', {
        from: 'User',
        text: $('#message-form > [name=message]').val()
    }, (resp) => {
        console.log('Got it', resp);
    })

    e.preventDefault();
})