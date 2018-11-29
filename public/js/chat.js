var socket = io();

socket.on('connect', () => {
    let params = $.deparam(window.location.search);
    socket.emit('join', params, (err) => {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
        else {
            console.log('No errors');
        }
    });
})
socket.on('disconnect', () => {
    console.log('Disconnected from server');
})

socket.on('newMessage', (msg) => {
    let formattedTime = moment(msg.createdAt).format('h:mm a')
    let template = $("#messages-template").html();
    let html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        formattedTime
    });
    $('#messages').append(html);
})

socket.on('updateUsersList', (users) => {
var ol = $('<ol></ol>');

users.forEach( (user) => {
    ol.append($('<li></li>').text(user));
})
$('#users').html(ol);

});

socket.on('newLocationMessage', (msg) => {
    let formattedTime = moment(msg.createdAt).format('h:mm a')

    let template = $("#location-message-template").html();
    let html = Mustache.render(template, {
        url: msg.url,
        from: msg.from,
        formattedTime
    });

    $('#messages').append(html);
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
                longitude: position.coords.longitude
            })
        },
        () => {
            locationButton.removeAttr("disabled").text("Send Location");
            alert('Unable to get location');
        })

})