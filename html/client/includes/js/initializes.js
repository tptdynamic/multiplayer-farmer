var playerid;
var currentPlayer;

var Engine = {
    socketData: null,
    accumulated_time: window.performance.now(),
    time_step: 1000/60,

    loop: function(time_stamp) {
        Display.clear();

        Display.FrameCanvas.drawImage(Display.Buffer.Canvas.canvas, 0, 0, Display.Buffer.Canvas.canvas.width, Display.Buffer.Canvas.canvas.height);

        Display.Buffer.drawBorder(Controller.pointer_x, Controller.pointer_y, Display.Buffer.Tile_size, Display.Buffer.Tile_size);

        Wheat.render();
        Wheat.object.animation.update();
        var player = [];
        for (var i = 0; i < Engine.socketData.length; i++) {
            var temp = new Player(Engine.socketData[i].name, Engine.socketData[i].x, Engine.socketData[i].y, Engine.socketData[i].frame, Engine.socketData[i].frame_row);
            player.push(temp);
            if (Engine.socketData[i].id == playerid)
                currentPlayer = player[i];
            player[i].render();
        }

        Controller.handleController(currentPlayer);
        
        // Display.Buffer.Canvas.fillStyle = "black";
        // Display.Buffer.Canvas.fillRect(Player.h_col_x * Display.Buffer.Tile_size, Player.up_h_col_y * Display.Buffer.Tile_size, Display.Buffer.Tile_size, Display.Buffer.Tile_size);
        // Display.Buffer.Canvas.fillRect(Player.h_col_x * Display.Buffer.Tile_size, Player.down_h_col_y * Display.Buffer.Tile_size, Display.Buffer.Tile_size, Display.Buffer.Tile_size);
        // Display.Buffer.Canvas.fillStyle = "white";
        // Display.Buffer.Canvas.fillRect(Player.left_v_col_x * Display.Buffer.Tile_size, Player.v_col_y * Display.Buffer.Tile_size, Display.Buffer.Tile_size, Display.Buffer.Tile_size);
        // Display.Buffer.Canvas.fillRect(Player.right_v_col_x * Display.Buffer.Tile_size, Player.v_col_y * Display.Buffer.Tile_size, Display.Buffer.Tile_size, Display.Buffer.Tile_size);

        Display.handleView(currentPlayer);
        Display.render();
        Display.resize();
    },

    start: function(map, id) {
        playerid = id;

        Display.start(map);

        window.addEventListener("resize", Display.resize, { passive: true });
        window.addEventListener("keydown", Controller.keyDown);
        window.addEventListener("keyup", Controller.keyUp);

        $("#up-arrow").on("touchstart", function(event) {
            Controller.touchHandler("up", event);
        });
        $("#down-arrow").on("touchstart", function(event) {
            Controller.touchHandler("down", event);
        });
        $("#left-arrow").on("touchstart", function(event) {
            Controller.touchHandler("left", event);
        });
        $("#right-arrow").on("touchstart", function(event) {
            Controller.touchHandler("right", event);
        });

        $("#up-arrow").on("touchend", function(event) {
            Controller.touchHandler("up", event);
        });
        $("#down-arrow").on("touchend", function(event) {
            Controller.touchHandler("down", event);
        });
        $("#left-arrow").on("touchend", function(event) {
            Controller.touchHandler("left", event);
        });
        $("#right-arrow").on("touchend", function(event) {
            Controller.touchHandler("right", event);
        });

        Display.Canvas.canvas.addEventListener("mousemove", Controller.move);
        Display.Canvas.canvas.addEventListener("touchmove", Controller.move, { passive : true});
        Display.Canvas.canvas.addEventListener("touchstart", Controller.move, { passive:true });

        Display.Buffer.renderTiles(); 

        audio_play.start("./client/includes/sound/background_theme.mp3");
    }
}
