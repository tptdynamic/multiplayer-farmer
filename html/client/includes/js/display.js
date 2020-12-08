var Display = {
    Canvas: document.querySelector('canvas').getContext('2d', {alpha:false, desynchronized: false}),
    FrameCanvas: document.createElement('canvas').getContext('2d', {alpha:false, desynchronized: true}),
    
    sx: 0,
    sy: 0,

    viewportx: 12*16,
    viewporty: 12*16,

    handleView: function(Player) {
        if (Player.x + (this.viewportx / 2) <= this.Buffer.Canvas.canvas.width && Player.x - (this.viewportx / 2) >= 0) {
            this.sx = Math.floor(Player.x - this.viewportx / 2);
        }

        if (Player.y + (this.viewporty / 2) <= this.Buffer.Canvas.canvas.height && Player.y - (this.viewportx / 2) >= 0) {
            this.sy = Math.floor(Player.y - this.viewporty / 2);
        }
    },

    render: function() {
        this.Canvas.drawImage(this.FrameCanvas.canvas, this.sx, this.sy, this.viewportx, this.viewporty, 0, 0, this.viewportx, this.viewporty);
    },

    resize: function(event) {
        // var width = document.documentElement.clientWidth;
        // var height = document.documentElement.clientHeight;

        // if (width / height < Map.width_height_ratio)
        //     height = Math.floor(width / Map.width_height_ratio);
        // else
        //     width = Math.floor(height * Map.width_height_ratio);
        Display.Canvas.canvas.style.width = '100%';
        Display.Canvas.canvas.style.height = '100%';
    },

    clear: function() {
        Display.FrameCanvas.clearRect(0, 0, Display.Buffer.Canvas.canvas.width, Display.Buffer.Canvas.canvas.height);
    },

    Buffer : {
        Canvas: document.createElement('canvas').getContext('2d', {alpha:false, desynchronized: true}),
        Tile_size: 16,
        Tile_sheet_image: new Array,

        drawBorder: function(x, y, width, height, thickness = 1) {
            tile_x = Math.floor((Controller.pointer_x + (Display.sx * (Display.Canvas.canvas.clientWidth / Display.viewportx))) / (Display.Canvas.canvas.clientWidth / (Display.viewportx / Display.Buffer.Tile_size)));
            tile_y = Math.floor((Controller.pointer_y + (Display.sy * (Display.Canvas.canvas.clientHeight / Display.viewporty))) / (Display.Canvas.canvas.clientHeight / (Display.viewporty / Display.Buffer.Tile_size)));
            Display.FrameCanvas.strokeStyle = "#ffff";
            Display.FrameCanvas.strokeRect(tile_x * Display.Buffer.Tile_size, tile_y * Display.Buffer.Tile_size, width, height);
        },

        calculateTileSourcePosition: function(tile_index, tile_sheet_columns) {
            return {
                x: tile_index % tile_sheet_columns * this.Tile_size,
                y: Math.floor(tile_index / tile_sheet_columns) * this.Tile_size
            };
        },

        renderTiles: function() {   
            for (var layer = 0; layer < Map.map.length; layer++) {
                if (this.Tile_sheet_image.length < Map.map.length) {
                    this.Tile_sheet_image.push(new Image());
                    this.Tile_sheet_image[layer].src = Map.map[layer].source;
    
                    this.Tile_sheet_image[layer].addEventListener('load', function(event) {
                        Display.Buffer.renderTiles();
                        Display.resize();
                    }, { once:true });
                }
                
                var map_index = 0;
                for (var top = 0; top < Map.height; top += this.Tile_size) {
                    for (var left = 0; left < Map.width; left += this.Tile_size) {
                        var tile_value = Map.map[layer].tiles[map_index];
                        map_index++;
                        if (tile_value == -1) continue;

                        var tile_source_position = this.calculateTileSourcePosition(tile_value, Map.map[layer].tile_sheet_columns);
                        this.Canvas.drawImage(this.Tile_sheet_image[layer], tile_source_position.x, tile_source_position.y, this.Tile_size, this.Tile_size, left, top, this.Tile_size, this.Tile_size);
                    }
                }
            }
        }
    },

    start: function(map) {
        Map = map;

        Map.width = Map.columns * this.Buffer.Tile_size;
        Map.height = Map.rows * this.Buffer.Tile_size;
        Map.width_height_ratio =  Map.height / Map.width;
        
        this.Canvas.canvas.width = this.viewportx;
        this.Canvas.canvas.height = this.viewporty;
        
        this.Buffer.Canvas.canvas.width =  Map.width;
        this.Buffer.Canvas.canvas.height = Map.height;

        this.FrameCanvas.canvas.width = Map.width;
        this.FrameCanvas.canvas.height = Map.height;
    
        this.Buffer.Canvas.imageSmoothingEnabled = this.Canvas.imageSmoothingEnabled = false;
    }
}