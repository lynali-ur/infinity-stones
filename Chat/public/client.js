var socket = io.connect();

window.onload = function() {
    socket.on('history', function(history) {
        console.log(history);
        for (each of history) {
            var message = "<div class = 'd-flex justify-content-between'><h5>" + each.user + "</h5><small>" + each.time + "</small></div><p>" + each.msg + "</p>";
            $('#message').append($("<li class = 'list-group-item' style = 'background-color: whitesmoke;'>").html(message));
        }
        $(".chat-history").animate({scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
    });
}

var input = $('#chat');
input.submit(function(event) {
    event.preventDefault();
    var content = $('#text').val();
    var time = new Date().format('m-d-Y h:i')
    socket.emit('newmsg', {msg: content, date: time});
    $('#text').val('');

});

socket.on('newmsg', function(message) {
    $('#message').append($("<li class = 'list-group-item' style = 'background-color: whitesmoke;'>").html(message));
    $(".chat-history").animate({scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
});