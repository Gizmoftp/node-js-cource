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

socket.on('newLocationMessage', (msg) => {
    let li = $('<li></li>');
    let a =  $('<a target="_blank">My current location</a>');
    li.text(`${msg.from}:`);
    a.attr('href', msg.url);
    li.append(a);
    $('#messages').append(li);
})

$('#message-form').on('submit', (e) => {
    let messageTextBox = $('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, (resp) => {
        messageTextBox.val('');
    })

    e.preventDefault();
})

let locationButton = $('#send-location');
locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('geolocation not supported by your browser');
    }
    locationButton.attr("disabled", "disabled").text("Sending location...");
    navigator.geolocation.getCurrentPosition(
        (position) => {
            locationButton.removeAttr("disabled").text("Send Location");
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude : position.coords.longitude
            })
    },
        () => {
            locationButton.removeAttr("disabled").text("Send Location");
           alert('Unable to get location');
        })

})