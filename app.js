const path = require('path');
const express = require('express');
const { Socket } = require('dgram');
const app = express();
const http = require('http');
const http_server = http.createServer(app);
const io = require('socket.io')(http_server);
const fetch = require('node-fetch');

var htmlPath = path.join(__dirname, 'html');

app.use(express.static(htmlPath));

var SocketList = {};

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

const playerFrameSets = [ [1], [0, 2]];

let url = "http://localhost/client/includes/json/map.json";

let settings = { method: "Get" };

var map;

fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        map = json;
    });

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('User disconnected');
        if (typeof(socket.name) != "undefined")
            io.emit('chat message', 'Người dùng ' + socket.name + ' mất kết nối tới Server');
        delete SocketList[socket.id];
    });

    socket.on('create character', (name) => {
        socket.id = Math.random();
        socket.x = (map.spawn_point % map.columns) * 16;
        socket.y = (map.spawn_point / map.columns) * 16;
        socket.name = name;
        socket.frame = 0;
        socket.frame_row = 0;
        socket.frame_set = 0;
        socket.frame_index = 0;
        socket.speed = 1;
        SocketList[socket.id] = socket;
        console.log('User create with name: ' + name);
        io.emit('chat message', 'Chào mừng ' + socket.name + ' kết nối tới Server');
        socket.emit('start engine', map ,socket.id);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    var frame_count = 0;
    var frame_delay = 15;
    socket.on('update character', (move) => {
        switch (move) {
            case "left":
                socket.x -= 0.5 * socket.speed;
                socket.frame_set = playerFrameSets[1];
                socket.frame_row = 1;
                frame_count++;
            break;
            case "right":
                socket.x += 0.5 * socket.speed;
                socket.frame_set = playerFrameSets[1];
                socket.frame_row = 2;
                frame_count++;
            break;
            case "up":
                socket.y -= 0.5 * socket.speed;
                socket.frame_set = playerFrameSets[1];
                socket.frame_row = 3;
                frame_count++;
            break;
            case "down":
                socket.y += 0.5 * socket.speed;
                socket.frame_set = playerFrameSets[1];
                socket.frame_row = 0;
                frame_count++;
            break;
            case "up left":
                socket.x -= 0.5 * socket.speed;
                socket.y -= 0.5 * socket.speed;
                socket.frame_set = playerFrameSets[1];
                socket.frame_row = 3;
                frame_count++;
            break;
            case "up right":
                socket.x += 0.5 * socket.speed;
                socket.y -= 0.5 * socket.speed;
                socket.frame_set = playerFrameSets[1];
                socket.frame_row = 3;
                frame_count++;
            break;
            case "down left":
                socket.x -= 0.5 * socket.speed;
                socket.y += 0.5 * socket.speed;
                socket.frame_set = playerFrameSets[1];
                socket.frame_row = 0;
                frame_count++;
            break;
            case "down right":
                socket.x += 0.5 * socket.speed;
                socket.y += 0.5 * socket.speed;
                socket.frame_set = playerFrameSets[1];
                socket.frame_row = 0;
                frame_count++;
            break;
            case "stand":
                socket.frame_set = playerFrameSets[0];
                socket.frame_index = 0;
                socket.frame = socket.frame_set[socket.frame_index];
            break;
            case "run":
                socket.speed = 2;
                frame_delay = 5;
            break;
            case "walk":
                socket.speed = 1;
                frame_delay = 15;
            break;
        } 

        if (frame_count >= frame_delay) {
            socket.frame_index = (socket.frame_index == socket.frame_set.length - 1) ? 0 : socket.frame_index + 1;
            socket.frame = socket.frame_set[socket.frame_index];
            frame_count = 0;
        }
    });

    typingHandler(socket);
});

setInterval(() => {
    var pack = [];
    for (var i in SocketList) {
        var socket = SocketList[i];
        pack.push({
            id: socket.id,
            x: socket.x,
            y: socket.y,
            frame: socket.frame,
            frame_row: socket.frame_row,
            name: socket.name
        });
    }

    for (var i in SocketList) {
        var socket = SocketList[i];
        socket.emit('update frame', pack);
    }
}, 300 / 25);

function typingHandler(socket) {
    var storedTyping = [];
    var storedTimer = [];
    socket.on('now typing', (name) => {
        if (storedTyping.indexOf(name) == -1) {
            io.emit('now typing', name);
            storedTyping.push(name);
            var timing = setTimeout(function() {
                io.emit('not typing', name);
                storedTyping.splice(storedTyping.indexOf(name) - 1);
                storedTimer.splice(storedTimer.indexOf(timing) - 1);
            }, 1000);
            storedTimer.push(timing);
        } else {
            var i = storedTyping.indexOf(name) - 1;
            storedTimer[i];
            clearTimeout(storedTimer[i]);
            storedTimer[i] = setTimeout(function() {
                io.emit('not typing', name);
                storedTyping.splice(storedTyping.indexOf(name) - 1);
                storedTimer.splice(storedTimer.indexOf(timing) - 1);
            }, 1000);
        }
    });
}

http_server.listen(80, () => {
    console.log('Server listening on *:80');
});