var Player = function(name, x, y, frame, frame_row) {
    this.animation = new Animation();
    this.sprite_sheet = new Sprite_sheet([ [1], [0, 1, 2] ],"./client/includes/tilesets/characters.png");
    this.h_col_x = 0;
    this.up_h_col_y = 0;     this.down_h_col_y = 0;
    this.left_v_col_x = 0;    this.right_v_col_x = 0;
    this.v_col_y = 0;
    this.height = 16;     this.width = 10,
    this.x_velocity = 0;  this.y_velocity = 0;
    this.x = x;
    this.y = y;
    this.name = name;
    this.frame =  frame;
    this.frame_row = frame_row;
};

Player.prototype.render = function() {
    Display.FrameCanvas.font = "12px";
    Display.FrameCanvas.fillStyle = "white ";
    Display.FrameCanvas.textAlign = "center";
    Display.FrameCanvas.fillText(this.name, Math.floor(this.x + (this.width / 2)), Math.floor(this.y - (this.height / 2)));
    Display.FrameCanvas.drawImage(this.sprite_sheet.image, (this.frame * this.width) + ((this.frame + 1) * 6), this.frame_row * this.height, this.width, this.height, Math.floor(this.x), Math.floor(this.y), this.width, this.height);
}

var Controller = {
    active: 0,

    pointer_x: 0,
    pointer_y: 0,
    
    move: function(event) {
        var rectangle = Display.Canvas.canvas.getBoundingClientRect();

        Controller.pointer_x = Math.floor(event.clientX - rectangle.left);
        Controller.pointer_y = Math.floor(event.clientY - rectangle.top);
    },

    keyDown: function(event) {
        if (lastDownTarget != canvas[0]) {
            Controller.active = 0;
            return;
        }

        switch(event.keyCode) {
            case 83:
                if (Controller.active == 0 || Controller.active == 1 || Controller.active == 2)
                    Controller.active += 8;
            break;
            case 65:
                if (Controller.active == 0 || Controller.active == 8 || Controller.active == 4)
                    Controller.active += 1;
            break;
            case 87:
                if (Controller.active == 0 || Controller.active == 1 || Controller.active == 2)
                    Controller.active += 4;
            break;
            case 68:
                if (Controller.active == 0 || Controller.active == 8 || Controller.active == 4)
                    Controller.active += 2;
            break;
            case 16:
                socket.emit('update character', "run"); 
            break;
        }
    },

    keyUp: function(event) {
        if (lastDownTarget != canvas[0]) {
            Controller.active = 0;
            return;
        }
        switch(event.keyCode) {
            case 83:
                if (Controller.active == 8 || Controller.active == 9 || Controller.active == 10)
                    Controller.active -= 8;
            break;
            case 65:
                if (Controller.active == 1 || Controller.active == 5 || Controller.active == 9)
                    Controller.active -= 1;
            break;
            case 87:
                if (Controller.active == 4 || Controller.active == 5 || Controller.active == 6)
                    Controller.active -= 4;
            break;
            case 68:
                if (Controller.active == 2 || Controller.active == 6 || Controller.active == 10)
                    Controller.active -= 2;
            break;
            case 16:
                socket.emit('update character', "walk"); 
            break;
        }
    },

    touchHandler: function(touch, event2) {
        lastDownTarget = canvas[0];
        var event;
        switch (touch) {
            case "up":
                event = {
                    keyCode: 87
                }
            break;
            case "down":
                event = {
                    keyCode: 83
                }
            break;
            case "left":
                event = {
                    keyCode: 65
                }
            break;
            case "right":
                event = {
                    keyCode: 68
                }
            break;
        }

        if (event2.type == "touchstart") {
            Controller.keyDown(event);
        } else {
            Controller.keyUp(event);
        }
    },

    handleController: function() {
        switch (Controller.active) {
            case 1:
                if (this.checkCollision("left")) {
                    socket.emit('update character', "left");
                } else {
                    socket.emit('update character', "stand");
                }
            break;
            case 2:
                if (this.checkCollision("right")) {
                    socket.emit('update character', "right");
                } else {
                    socket.emit('update character', "stand");
                }
            break;
            case 4:
                if (this.checkCollision("up")) {
                    socket.emit('update character', "up");
                } else {
                    socket.emit('update character', "stand");
                }
            break;
            case 8:
                if (this.checkCollision("down")) {
                    socket.emit('update character', "down");
                } else {
                    socket.emit('update character', "stand");
                }
            break;
            case 5:
                if (this.checkCollision("left")) {
                    if (this.checkCollision("up")) {
                        socket.emit('update character', "up left");
                    } else {
                        socket.emit('update character', "left");
                    }
                } else {
                    if (this.checkCollision("up")) {
                        socket.emit('update character', "up");
                    } else {
                        socket.emit('update character', "stand");
                    }
                }
            break;
            case 6:
                if (this.checkCollision("right")) {
                    if (this.checkCollision("up")) {
                        socket.emit('update character', "up right");
                    } else {
                        socket.emit('update character', "right");
                    }
                } else {
                    if (this.checkCollision("up")) {
                        socket.emit('update character', "up");
                    } else {
                        socket.emit('update character', "stand");
                    }
                }
            break;
            case 9:
                if (this.checkCollision("left")) {
                    if (this.checkCollision("down")) {
                        socket.emit('update character', "down left");
                    } else {
                        socket.emit('update character', "left");
                    }
                } else {
                    if (this.checkCollision("down")) {
                        socket.emit('update character', "down");
                    } else {
                        socket.emit('update character', "stand");
                    }
                }
            break;
            case 10:
                if (this.checkCollision("right")) {
                    if (this.checkCollision("down")) {
                        socket.emit('update character', "down right");
                    } else {
                        socket.emit('update character', "right");
                    }
                } else {
                    if (this.checkCollision("down")) {
                        socket.emit('update character', "down");
                    } else {
                        socket.emit('update character', "stand");
                    }
                }
            break; 
            default:
                socket.emit('update character', "stand");
        }
    },

    checkCollision: function(dir) {
        switch (dir) {
            case "left":
                currentPlayer.h_col_x = Math.floor((currentPlayer.x - 1) / Display.Buffer.Tile_size);
                currentPlayer.up_h_col_y = Math.floor(currentPlayer.y / Display.Buffer.Tile_size);
                currentPlayer.down_h_col_y = Math.floor((currentPlayer.y + currentPlayer.height) / Display.Buffer.Tile_size);
                if (Map.colmap[currentPlayer.h_col_x + (currentPlayer.up_h_col_y * Map.columns)] == 1 || Map.colmap[currentPlayer.h_col_x + (currentPlayer.down_h_col_y * Map.columns)] == 1) return false;
            break;
            case "right":
                currentPlayer.h_col_x = Math.floor((currentPlayer.x + currentPlayer.width + 1) / Display.Buffer.Tile_size);
                currentPlayer.up_h_col_y = Math.floor(currentPlayer.y / Display.Buffer.Tile_size);
                currentPlayer.down_h_col_y = Math.floor((currentPlayer.y + currentPlayer.height) / Display.Buffer.Tile_size);
                if (Map.colmap[currentPlayer.h_col_x + (currentPlayer.up_h_col_y * Map.columns)] == 1 || Map.colmap[currentPlayer.h_col_x + (currentPlayer.down_h_col_y * Map.columns)] == 1) return false;
            break;
            case "up":
                currentPlayer.left_v_col_x = Math.floor(currentPlayer.x / Display.Buffer.Tile_size);
                currentPlayer.right_v_col_x = Math.floor((currentPlayer.x + currentPlayer.width) / Display.Buffer.Tile_size);
                currentPlayer.v_col_y = Math.floor((currentPlayer.y - 1) / Display.Buffer.Tile_size);
                if (Map.colmap[currentPlayer.left_v_col_x + (currentPlayer.v_col_y * Map.columns)] == 1 || Map.colmap[currentPlayer.right_v_col_x + (currentPlayer.v_col_y * Map.columns)] == 1) return false;
            break;
            case "down":
                currentPlayer.left_v_col_x = Math.floor(currentPlayer.x / Display.Buffer.Tile_size);
                currentPlayer.right_v_col_x = Math.floor((currentPlayer.x + currentPlayer.width) / Display.Buffer.Tile_size);
                currentPlayer.v_col_y = Math.floor((currentPlayer.y + currentPlayer.height + 1) / Display.Buffer.Tile_size);
                if (Map.colmap[currentPlayer.left_v_col_x + (currentPlayer.v_col_y * Map.columns)] == 1 || Map.colmap[currentPlayer.right_v_col_x + (currentPlayer.v_col_y * Map.columns)] == 1) return false;
            break;
        }

        return true;
    }
}

