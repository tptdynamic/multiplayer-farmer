var Animation = function(frame_set, delay) {
    this.count = 0;
    this.delay = delay;
    this.frame = 0;
    this.frame_index = 0;
    this.frame_set = frame_set;
    this.frame_row = 0;
};

Animation.prototype = {
    change: function(frame_set, frame_row = 0, delay = 15) {
        this.frame_row = frame_row;
        if (this.frame_set != frame_set) {
            this.count = 0;
            this.delay = delay;
            this.frame_index = 0;
            this.frame_set = frame_set;
            this.frame = this.frame_set[this.frame_index];
        }
    },

    update: function() {
        this.count++;
        if (this.count >= this.delay) {
            this.count = 0;
            this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
            this.frame = this.frame_set[this.frame_index];
        }
    }
};

var Sprite_sheet = function(frame_sets, src) {
    this.frame_sets = frame_sets;
    this.image = new Image();
    this.image.src = src;
};

var GameObject = function(type, x, y, width, height, frame_sets, src) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height,
    this.animation = new Animation(),

    this.sprite_sheet = new Sprite_sheet(frame_sets, src);
    
};

var Wheat = {
    object: new GameObject("Wheat", 0, 0, 16, 16, [ [4, 3, 2, 1] ] , "./client/includes/tilesets/crop.png"),

    create: function(x, y) {
        Wheat.object.x = x;
        Wheat.object.x = y;
        Wheat.object.animation.change(Wheat.object.sprite_sheet.frame_sets[0], 5, 15);
    },

    render: function() {
        Display.Buffer.Canvas.drawImage(Wheat.object.sprite_sheet.image, (Wheat.object.animation.frame * Wheat.object.width), (Wheat.object.animation.frame_row * Wheat.object.height), Wheat.object.width, Wheat.object.height, Wheat.object.x, Wheat.object.y, Wheat.object.width, Wheat.object.height);
    }
};