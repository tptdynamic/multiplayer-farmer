

(function() { "use strict";
    //

    var SelectTile = document.getElementById('selectTile').getContext('2d');
    var pointer_x = 0;
    var pointer_y = 0;

    var select_x = 0;
    var select_y = 0;

    var layer_index = 0;
    var image = new Array();
    image[0] = new Image();

    var tile_size = 16;

    var tile_value;

    function drawGridSelect(size) {
        for (var i = -size; i <= image[layer_index].width * size; i += size) {
            SelectTile.moveTo(0.5 + i + size, 0);
            SelectTile.lineTo(0.5 + i + size, image[layer_index].height * size);
        }

        for (var i = -size; i <= image[layer_index].height * size; i += size) {
            SelectTile.moveTo(0, 0.5 + i + size);
            SelectTile.lineTo(image[layer_index].width * size, 0.5 + i + size);
        }

        SelectTile.strokeStyle = "black";
        SelectTile.stroke();
    }

    function drawSelect() {
        SelectTile.fillStyle = "white";
        SelectTile.fillRect(0, 0, SelectTile.canvas.width, SelectTile.canvas.height);
        
        SelectTile.drawImage(image[layer_index], 0, 0, SelectTile.canvas.width, SelectTile.canvas.height);
        
        drawGridSelect(tile_size);
        drawMouseOverSelect(tile_size);
        drawSelectTile(tile_size);
    }

    function mouseOverSelect(event) {
        var rectangle = SelectTile.canvas.getBoundingClientRect();

        pointer_x = Math.floor(event.clientX - rectangle.left);
        pointer_y = Math.floor(event.clientY - rectangle.top);

        drawSelect();
    }

    function drawMouseOverSelect(size) {
        var tile_x = Math.floor(pointer_x / (SelectTile.canvas.clientWidth / (image[layer_index].width / size)));
        var tile_y = Math.floor(pointer_y / (SelectTile.canvas.clientHeight / (image[layer_index].height / size)));

        SelectTile.fillStyle = "rgba(128, 128, 128, 0.7)";
        SelectTile.fillRect( 1 + tile_x * size, 1 + tile_y * size, size - 1, size - 1);
    }

    function drawSelectTile(size) {
        var tile_x = Math.floor(select_x / (SelectTile.canvas.clientWidth / (image[layer_index].width / size)));
        var tile_y = Math.floor(select_y / (SelectTile.canvas.clientHeight / (image[layer_index].height / size)));
        
        tile_value = tile_x + (tile_y * (image[layer_index].width / size));

        SelectTile.strokeStyle = "red";
        SelectTile.strokeRect(tile_x * size, tile_y * size, size, size);
    }

    function onLoadChange(event) {
        SelectTile.canvas.width = image[layer_index].width + 1;
        SelectTile.canvas.height = image[layer_index].height + 1;
        SelectTile.drawImage(image[layer_index], 0, 0, SelectTile.canvas.width, SelectTile.canvas.height);
        drawSelect();
        drawPreview();
    }

    function selectTile(event) {
        var rectangle = SelectTile.canvas.getBoundingClientRect();

        select_x = Math.floor(event.clientX - rectangle.left);
        select_y = Math.floor(event.clientY - rectangle.top);

        drawSelect();
    }

    SelectTile.canvas.addEventListener("mousemove", mouseOverSelect);
    SelectTile.canvas.addEventListener("click", selectTile);
    SelectTile.canvas.addEventListener("touchmove", mouseOverSelect, { passive : true});
    SelectTile.canvas.addEventListener("touchstart", selectTile, { passive: true });

    drawSelect();

    //

    var PreviewTile = document.getElementById('previewTile').getContext('2d');
    var inputWidth = $("#inputWidth").val();
    var inputHeight = $("#inputHeight").val();
    var pointer_x = 0;
    var pointer_y = 0;

    var spawn_point = 0;
    var show_spawn_point = false;

    var map = new Array();

    var colmap = new Array();;
    var show_col_map = false;

    var map_string = "";

    function drawGridPreview(size) {
        for (var i = -size; i <= inputWidth * size; i += size) {
            PreviewTile.moveTo(0.5 + i + size, 0);
            PreviewTile.lineTo(0.5 + i + size, inputHeight * size);
        }

        for (var i = -size; i <= inputHeight * size; i += size) {
            PreviewTile.moveTo(0, 0.5 + i + size);
            PreviewTile.lineTo(inputWidth * size, 0.5 + i + size);
        }

        PreviewTile.strokeStyle = "black";
        PreviewTile.stroke();
    }

    function drawPreview(event) {
        inputWidth = $("#inputWidth").val();
        inputHeight = $("#inputHeight").val();

        if (inputWidth < 12) {
            alert("Nhập chiều dài không được nhỏ hơn 12!!!");
            $("#inputWidth").val(12);
            return;
        }

        if (inputHeight < 12) {
            alert("Nhập chiều cao không được nhỏ hơn 12!!!");
            $("#inputHeight").val(12);
            return;
        }

        PreviewTile.canvas.width = inputWidth * tile_size + 1;
        PreviewTile.canvas.height = inputHeight * tile_size + 1;
        PreviewTile.fillStyle = "#2f8136";
        PreviewTile.fillRect(0, 0, inputWidth * tile_size, inputHeight * tile_size);
        drawGridPreview(tile_size);

        renderTilePreview();
        if (show_col_map == true) renderColMapPreview();

        if (show_spawn_point == true) renderSpawnPoint();

        drawMouseOverPreview(tile_size);

        if (typeof event !== 'undefined' && event.target.id == "inputWidth") {
            for (var index = 0; index < map.length; index++) {
                for (var i = 0; i < map[index].length; i++) {
                    if (map[index][i].length > inputWidth) {
                        var max = map[index][i].length - inputWidth;
                        for (var j = 0; j < max; j++) {
                            map[index][i].pop();
                        }   
                    } else {
                        var max = inputWidth - map[index][i].length;
                        for (var j = 0; j < max; j++) {
                            map[index][i].push(-1);
                        }
                    }
                }
            }

            for (var i = 0; i < colmap.length; i++) {
                if (colmap[i].length > inputWidth) {
                    var max = colmap[i].length - inputWidth;
                    for (var j = 0; j < max; j++) {
                        colmap[i].pop();
                    }   
                } else {
                    var max = inputWidth - colmap[i].length;
                    for (var j = 0; j < max; j++) {
                        colmap[i].push(0);
                    }
                }
            }
        } else if (typeof event !== 'undefined' && event.target.id == "inputHeight") {
            for (var index = 0; index < map.length; index++) {
                if (map[index].length > inputHeight) {
                    var max = map[index].length - inputHeight;
                    for (var j = 0; j < max; j++) {
                        map[index].pop();
                    }
                } else {
                    var max = inputHeight - map[index].length;
                    for (var j = 0; j < max; j++) {
                        var temp = [];
                        for (var i = 0; i < inputWidth; i++) {
                            temp.push(-1);
                        }
                        map[index].push(temp);
                    } 
                }
            }

            if (colmap.length > inputHeight) {
                var max = colmap.length - inputHeight;
                for (var j = 0; j < max; j++) {
                    colmap.pop();
                }
            } else {
                var max = inputHeight - colmap.length;
                for (var j = 0; j < max; j++) {
                    var temp = [];
                    for (var i = 0; i < inputWidth; i++) {
                        temp.push(0);
                    }
                    colmap.push(temp);
                } 
            }
        }

        getOutputString();
    }

    function mouseOverPreview(event) {
        if (event.buttons == 1 || event.buttons == 2) {
            mouseDownPreview(event);
        }
        var rectangle = PreviewTile.canvas.getBoundingClientRect();

        pointer_x = Math.floor(event.clientX - rectangle.left);
        pointer_y = Math.floor(event.clientY - rectangle.top);

        drawPreview();
    }  

    function drawMouseOverPreview(size) {
        var tile_x = Math.floor(pointer_x / (PreviewTile.canvas.clientWidth / inputWidth));
        var tile_y = Math.floor(pointer_y / (PreviewTile.canvas.clientHeight / inputHeight));

        PreviewTile.fillStyle = "rgba(128, 128, 128, 0.7)";
        PreviewTile.fillRect( 1 + tile_x * size, 1 + tile_y * size, size - 1, size - 1);
    }

    function renderTilePreview() {
        for (var index = 0; index < map.length; index++) {
            for (var i = 0; i < map[index].length; i++) {
                for (var j = 0; j < map[index][i].length; j++) {
                    var tile_value = map[index][i][j];
                    var tile_source_position_x = tile_value % (image[index].width / tile_size);
                    var tile_source_position_y = Math.floor(tile_value / (image[index].width / tile_size));
                    
                    if (tile_value == -1) continue;
    
                    PreviewTile.drawImage(image[index], tile_source_position_x * tile_size, tile_source_position_y * tile_size, tile_size, tile_size, j * tile_size + 1, i * tile_size + 1, tile_size - 1, tile_size - 1);
                }
            }
        }
    }

    function renderColMapPreview() {
        for (var i = 0; i < colmap.length; i++) {
            for (var j = 0; j < colmap[i].length; j++) {
                var value = colmap[i][j];
        
                if (value == 0) continue;

                PreviewTile.fillStyle = "black";
                PreviewTile.fillRect((j * tile_size) + 1, (i * tile_size) + 1, tile_size - 1, tile_size - 1);
            }
        }
    }

    function renderSpawnPoint() {
        var tile_x = spawn_point % inputWidth;
        var tile_y = Math.floor(spawn_point / inputWidth);
        PreviewTile.fillStyle = "cyan";
        PreviewTile.fillRect((tile_x * tile_size) + 1, (tile_y * tile_size) + 1, tile_size - 1, tile_size - 1);
    }

    function mouseDownPreview(event) {
        var rectangle = PreviewTile.canvas.getBoundingClientRect();

        var pointer_x = Math.floor(event.clientX - rectangle.left);
        var pointer_y = Math.floor(event.clientY - rectangle.top);
        var tile_x = Math.floor(pointer_x / (PreviewTile.canvas.clientWidth / inputWidth));
        var tile_y = Math.floor(pointer_y / (PreviewTile.canvas.clientHeight / inputHeight));

        if (event.buttons == 2) {
            if (show_col_map == false)
                map[layer_index][tile_y][tile_x] = -1;
            else 
                colmap[tile_y][tile_x] = 0;
        } else if (event.buttons == 4) {
            spawn_point = tile_x + (tile_y * inputWidth);
        } else {
            if (show_col_map == false)
                map[layer_index][tile_y][tile_x] = tile_value;
            else
                colmap[tile_y][tile_x] = 1;
        }

        drawPreview();
    }

    function generateMap(index) {
        map[index] = new Array(parseInt(inputHeight));
        for (var i = 0; i < map[index].length; i++) {
            map[index][i] = new Array(parseInt(inputWidth));
            for (var j = 0; j < map[index][i].length; j++) {
                map[index][i][j] = -1;
            }
        }
    }

    function generateColMap() {
        colmap = new Array(parseInt(inputHeight));
        for (var i = 0; i < colmap.length; i++) {
            colmap[i] = new Array(parseInt(inputWidth));
            for (var j = 0; j < colmap[i].length; j++) {
                colmap[i][j] = 0;
            }
        }
    }

    function getOutputString() {
        map_string = '{ \n     "columns" : ' + inputWidth + ',\n     "rows" : ' + inputHeight + ',\n     ';
        map_string += '"spawn_point" : ' + (spawn_point) + ',\n     ';
        map_string += '"map" : [\n     ';
        for (var index = 0; index < map.length; index++) {
            map_string += '{' + '\n          ';
            map_string += '"tile_sheet_columns" : ' + (image[index].width / tile_size) + ',\n          ';
            map_string += '"tiles" : [ ' + '\n           ';
            
            for (var i = 0; i < map[index].length; i++) {
                for (var j = 0; j < map[index][i].length; j++) {
                    if (i == map[index].length -1 && j == map[index][i].length - 1) {
                        map_string += map[index][i][j];
                        map_string += "],\n     ";
                    } else {
                        map_string += map[index][i][j] + ', ';
                    }
                }
                map_string += '\n           ';
            }
            var src_split = image[index].src.split("/");
            var string = "./" + src_split[src_split.length - 3] + "/" + src_split[src_split.length - 2] + "/" + src_split[src_split.length - 1];
            map_string += '"source" : "' + string + '"\n     ';
            if (index == map.length - 1)
                map_string += "}\n     ";
            else 
                map_string += "},\n     ";
        }
        
        map_string += "],\n     ";

        map_string += '"colmap" : [\n           ';
        for (var i = 0; i < colmap.length; i++) {
            for (var j = 0; j < colmap[i].length; j++) {
                if (i == colmap.length -1 && j == colmap[i].length - 1) {
                    map_string += colmap[i][j];
                    map_string += "]\n     ";
                } else {
                    map_string += colmap[i][j] + ', ';
                }
            }
            map_string += '\n           ';
        }
        map_string += "}";

        $("#outputString").val(map_string);
    }

    function maxWidth(event) {
        if (event.target.checked == false) {
            $("#previewTile").css({"width" : "", "height" : ""});
        } else {
            $("#previewTile").css({"width" : "100%", "height" : "100vh"});
        }
    }

    function selectLayer(event) {
        layer_index = $("#selectLayer").val() - 1;
        var src_split = image[layer_index].src.split("/");
        var string = "../" + src_split[src_split.length - 3] + "/" + src_split[src_split.length - 2] + "/" + src_split[src_split.length - 1];
        $("#inputImage").val(string);
        onLoadChange();
    }

    function addLayer() {
        map.push();
        layer_index++;
        image.push(new Image);
        image[layer_index].src = $("#inputImage").val();
        generateMap(layer_index);
        $("#selectLayer").append("<option value='" + (layer_index + 1) + "'>" + (layer_index + 1) + "</option>");
        $("#selectLayer").val(layer_index + 1);
        drawPreview();
    }

    function removeLayer() {
        if (image.length == 1) return;
        map.splice(layer_index);
        image.splice(layer_index);
        layer_index--;
        $("#selectLayer option[value='" + (layer_index + 2) + "']").remove();
        $("#selectLayer").val(layer_index + 1); 
        drawPreview();
    }

    function changeImage() {
        image[layer_index].src = $("#inputImage").val();
        image[layer_index].addEventListener("load", onLoadChange);
    }

    $("#inputMap").change(function () {
        var url = './save/' + this.files[0].name;
        Map = (function () {
            var json = null;
            $.ajax({
                'crossDomain': false,
                'async': false,
                'global': false,
                'url': url,
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            });
            return json;
        })();

        $("#inputWidth").val(Map.columns);
        $("#inputHeight").val(Map.rows);
        spawn_point = Map.spawn_point;
        image = new Array();
        map = new Array(Map.map.length);
        $("#selectLayer").html("");
        for (var layout = 0; layout < Map.map.length; layout++) {
            map[layout] = new Array(Map.rows);
            var index = 0;
            for (var i = 0; i < Map.rows; i++) {
                map[layout][i] = new Array(Map.columns);
                for (var j = 0; j < Map.columns; j++) {
                    map[layout][i][j] = Map.map[layout].tiles[index];
                    index++;
                }
            }
            image.push(new Image());
            image[layout].src = '.' + Map.map[layout].source;
            $("#selectLayer").append("<option value='" + (layout + 1) + "'>" + (layout + 1) + "</option>");
            $("#selectLayer").val(1);
        }

        colmap = new Array(Map.rows);
        var index = 0;
        for (var i = 0; i < Map.rows; i++) {
            colmap[i] = new Array(Map.columns);
            for (var j = 0; j < Map.columns; j++) {
                colmap[i][j] = Map.colmap[index];
                index++;
            }
        }

        drawPreview();
    });

    function downloadToFile(content, filename, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], {type: contentType});
        
        a.href= URL.createObjectURL(file);
        a.download = filename;
        a.click();

        URL.revokeObjectURL(a.href);
    }

    $("#inputImage").on("change", changeImage);
    $("#selectLayer").on("change", selectLayer);
    $("#addLayer").on("click", addLayer);
    $("#removeLayer").on("click", removeLayer);
    $("#inputWidth").on("change", drawPreview);
    $("#inputHeight").on("change", drawPreview);
    $("#maxWidth").on("change", maxWidth);
    $("#showColmap").on("change", function() {
        if (show_col_map == false)
            show_col_map = true;
        else 
            show_col_map = false;
        drawPreview();
    });

    $("#showSpawnPoint").on("change", function() {
        if (show_spawn_point == false)
            show_spawn_point = true;
        else 
            show_spawn_point = false;
        drawPreview();
    });

    $("#buttonSave").on("click", function() {
        downloadToFile($("#outputString").val(), 'map.json', 'application/JSON');
    });
    

    PreviewTile.canvas.addEventListener("mousemove", mouseOverPreview);
    PreviewTile.canvas.addEventListener("mousedown", mouseDownPreview);
    PreviewTile.canvas.addEventListener("touchmove", mouseOverPreview, { passive : true});
    PreviewTile.canvas.addEventListener("touchstart", mouseOverPreview, { passive: true });

    changeImage();
    generateMap(0);
    generateColMap();
    drawPreview();
}) ();