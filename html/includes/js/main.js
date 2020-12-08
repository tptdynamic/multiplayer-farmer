var name = "Unknown";
var lastDownTarget;
var canvas = document.getElementsByTagName("canvas");
var socket;

function SetName() {
    if ($("#inputName").val() != "") {
        name = $("#inputName").val();
        socket.emit('create character', name);
        $("#inputNameModel").modal("hide");
    }
}

$("#inputNameModel").modal({backdrop: "static"});

$(function () {
    socket = io();
    
    $('form').submit(function(e) {
        e.preventDefault();
        if ($('#inputMessages').val() == "") return false;
        socket.emit('chat message', name + ": " + $('#inputMessages').val());
        $('#inputMessages').val('');
        return false;
    });

    $("#inputMessages").on('keypress',function(e) {
        socket.emit('now typing', name);
    });

    $("#modalSend").on('click',function(e) {
        SetName();
    });

    $("#inputNameModel").on('keypress',function(e) {
        if(e.which == 13) {
            SetName();
        }
    });

    socket.on('chat message', function(msg){
        $('#chatContent').append($('<p>').text(msg));
        $('#chatMessages').scrollTop($('#chatMessages').prop('scrollHeight'));
    });

    socket.on('now typing', function(name){
        $('#nowTyping').html($('<p>').attr("class", "now-typing").text(name + " đang soạn tin...")).scrollTop($('#messages').prop('scrollHeight'));
    });

    socket.on('not typing', function(name){
        if ($("#nowTyping p[class='now-typing']:contains('" + name + "')").length > 0) {
            $("#nowTyping p[class='now-typing']:contains('" + name + "')")[0].remove();
        }
    });

    $(document).on('mousedown', function (event) {
        lastDownTarget = event.target;
    });
    
    socket.on('start engine', (map, id) => {
        Engine.start(map, id);
    });

    socket.on('update frame', (data) => {
        Engine.socketData = data;
        window.requestAnimationFrame(Engine.loop);
    });

    $(document).on('gesturestart', function (e) {
        e.preventDefault();
    });
});