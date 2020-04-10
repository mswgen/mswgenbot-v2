const http = require('http');
module.exports = {
    create: async function () {
        const server = http.createServer(function (req, res) {
            const io = require('socket.io')(server);
            res.writeHead(200);
            res.end(`
<!DOCTYPE html>
<html>
  <head>
    <title>채팅</title>
    <style>
      * {
margin: 0; padding: 0; box-sizing: border-box;
}
      body {
font: 13px Helvetica, Arial;
}
      form {
padding: 3px; bottom: 0; width: 100%;
}
      form input {
border: 1px solid black; border-radius: 5px; padding: 10px; width: 90%; margin-right: .5%;
}
      form button {
width: 9%; border: 1px solid lightgray; border-radius: 5px; padding: 10px;
}
      #messages {
list-style-type: none; margin: 0; padding: 0;
}
      #messages li {
padding: 5px 10px;
}
    </style>
  </head>
  <body>
    <script src="/socket.io/socket.io.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script>
  $(function () {
    var socket = io();
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
  });
</script>
    <ul id="messages"></ul>
    <form action="">
      <input id="m" placeholder="Message" autocomplete="off" />
      <button>Send</button>
    </form>
  </body>
</html>
`);
            io.on('connection', async function (socket) {
                socket.on('chat message', function (msg) {
                    io.emit('chat message', msg);
                });
            });
        });
        server.listen(8000);
    }
}