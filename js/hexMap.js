class HexMap {
  constructor(board, canvasId, orientation = 'vertical') {
    var self = this; // Used for passing the class reference to handlers

    var LAYER1 = {};
    LAYER1.canvas = document.getElementById(canvasId + '_LAYER1');
    LAYER1.ctx = LAYER1.canvas.getContext('2d');
    var LAYER2 = {};
    LAYER2.canvas = document.getElementById(canvasId + '_LAYER2');
    LAYER2.ctx = LAYER2.canvas.getContext('2d');

    this.Hexes = [];
    this.Grid = {};
    this.Grid.selected = null;
    this.Grid.boardWidth = board.width;
    this.Grid.boardHeight = board.height;
    this.Grid.orientation = orientation;

    if(this.Grid.orientation != 'horizontal' && this.Grid.orientation != 'vertical') this.Grid.orientation = 'vertical';

    this.layer1_render(LAYER1.canvas, LAYER1.ctx);
    this.layer2_render(LAYER2.canvas, LAYER2.ctx);
  }

  layer1_render(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx;

    // Fill background black
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawStarryBG();
    this.drawDirections();

    this.getGrid();
    this.drawGrid();
  }

  layer2_render(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx;

    this.canvas.addEventListener('mousemove', this.getHoverHex.bind(this), false);
    this.canvas.addEventListener('mouseleave', this.mouseLeft.bind(this), false);
    this.canvas.addEventListener('click', this.getClickedHex.bind(this), false);
  }

  drawStarryBG(canvas, ctx) {
    var stars = 200;
    var colourRange = [0, 60, 240];

    for (var i = 0; i < stars; i++) {
      var x = Math.random() * this.canvas.offsetWidth;
      var y = Math.random() * this.canvas.offsetHeight;
      var radius = Math.random() * 1.2;
      var hue = colourRange[getRandom(0, colourRange.length - 1)];
      var sat = getRandom(50, 100);
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 360);
      this.ctx.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)";
      this.ctx.fill();
    }
  }

  drawDirections(canvas, ctx){
    this.ctx.font = "16px Ariel";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Coreward", this.canvas.width / 2, 18);
    this.ctx.fillText("Rimward", this.canvas.width / 2, this.canvas.height - 7);
    this.ctx.save();
    var heightDiff = this.canvas.height - this.canvas.width;
    this.ctx.translate(this.canvas.width, heightDiff / 2);
    this.ctx.rotate(90*Math.PI/180);
    this.ctx.fillText("Spinward", this.canvas.width / 2, 18);
    this.ctx.restore();
    this.ctx.save();
    this.ctx.translate(0, this.canvas.height - heightDiff / 2);
    this.ctx.rotate(-90*Math.PI/180);
    this.ctx.fillText("Trailing", this.canvas.width / 2, 18);
    this.ctx.restore();

    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(25, 25, this.canvas.width - 50, this.canvas.height - 50);
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  getGrid(){
    this.Grid.gridWidth = (this.canvas.width - 50) / this.Grid.boardWidth;
    this.Grid.gridHeight = (this.canvas.height - 50) / this.Grid.boardHeight;

    this.Grid.tipHeight = this.Grid.gridHeight * 0.3;

    if(this.Grid.orientation == 'horizontal'){
      this.Grid.gridWidth -= (this.Grid.gridWidth / 2) / this.Grid.boardWidth - 0.16;
      this.Grid.gridHeight += this.Grid.tipHeight - 1.7;
    } else if(this.Grid.orientation == 'vertical'){
      this.Grid.gridWidth += this.Grid.tipHeight - 2.2;
      this.Grid.gridHeight -= (this.Grid.gridHeight / 2) / this.Grid.boardHeight - 0.16;
    }

    this.Grid.gridRectHeight = this.Grid.gridHeight - (this.Grid.tipHeight * 2);
    this.Grid.gridOffsetX = this.Grid.gridWidth / 2;
    this.Grid.gridOffsetY = this.Grid.gridHeight / 2;

    for(var x = 0; x < this.Grid.boardWidth; x++) {
      for(var y = 0; y < this.Grid.boardHeight; y++) {
        var centerX = 0;
        var centerY = 0;
        if(this.Grid.orientation == 'horizontal'){
          centerX = 25 + this.Grid.gridOffsetX + (x * this.Grid.gridWidth);
          centerY = 25 + this.Grid.gridOffsetY + (y * this.Grid.gridHeight) - (y * this.Grid.tipHeight);
          // Offset even rows
          if(y % 2 != 0) {
            centerX += this.Grid.gridOffsetX;
          }
        } else if(this.Grid.orientation == 'vertical'){
          centerX = 25 + this.Grid.gridOffsetX + (x * this.Grid.gridWidth) - (x * this.Grid.tipHeight);
          centerY = 25 + this.Grid.gridOffsetY + (y * this.Grid.gridHeight);
          // Offset even rows
          if(x % 2 != 0) {
            centerY += this.Grid.gridOffsetY;
          }
        }

        this.Hexes[this.Hexes.length] = {
          id: this.idToString(x, y),
          x: centerX,
          y: centerY
        }
      }
    }
    console.log(this.Hexes);
  }

  drawGrid(drawCoord = false) {
    this.ctx.font = "10px Ariel";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
    for(var x = 0; x < this.Hexes.length; x++){
      if(drawCoord){
        this.ctx.beginPath();
        this.ctx.fillRect(this.Hexes[x].x - 2, this.Hexes[x].y - 2, 4, 4);
        this.ctx.fill();
        this.ctx.closePath();
      }

      this.drawHexagon(this.Hexes[x].x, this.Hexes[x].y, this.Hexes[x].id);
    }
  }

  drawHexagon(centerX, centerY, id = false, fill = false){

    if(id){
      var idc = this.idStringToCoord(id);
      this.ctx.fillText(id, centerX, centerY - this.Grid.tipHeight);
    }

    if(this.Grid.orientation == 'horizontal'){
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY - this.Grid.gridOffsetY);
      this.ctx.lineTo(centerX + this.Grid.gridOffsetX, centerY - this.Grid.gridOffsetY + this.Grid.tipHeight);
      this.ctx.lineTo(centerX + this.Grid.gridOffsetX, centerY + (this.Grid.gridOffsetY - this.Grid.tipHeight));
      this.ctx.lineTo(centerX, centerY + this.Grid.gridOffsetY);
      this.ctx.lineTo(centerX - this.Grid.gridOffsetX, centerY + (this.Grid.gridOffsetY - this.Grid.tipHeight));
      this.ctx.lineTo(centerX - this.Grid.gridOffsetX, centerY - this.Grid.gridOffsetY + this.Grid.tipHeight);
      this.ctx.lineTo(centerX, centerY - this.Grid.gridOffsetY);
      if(id && idc.x == this.Grid.boardWidth && idc.y == 1){
        this.ctx.moveTo(centerX + this.Grid.gridOffsetX, centerY - this.Grid.gridOffsetY + this.Grid.tipHeight);
        this.ctx.lineTo(centerX + this.Grid.gridWidth, centerY - this.Grid.gridOffsetY);
      }
      if(id && idc.x == 1 && idc.y == this.Grid.boardHeight){
        this.ctx.moveTo(centerX - this.Grid.gridOffsetX, centerY + (this.Grid.gridOffsetY - this.Grid.tipHeight));
        this.ctx.lineTo(centerX - this.Grid.gridWidth, centerY + this.Grid.gridOffsetY);
      }
      this.ctx.closePath();
    } else if(this.Grid.orientation == 'vertical'){
      this.ctx.beginPath();
      this.ctx.moveTo(centerX - this.Grid.gridOffsetX, centerY);
      this.ctx.lineTo(centerX - this.Grid.gridOffsetX + this.Grid.tipHeight, centerY - this.Grid.gridOffsetY);
      this.ctx.lineTo(centerX + (this.Grid.gridOffsetX - this.Grid.tipHeight), centerY - this.Grid.gridOffsetY);
      this.ctx.lineTo(centerX + this.Grid.gridOffsetX, centerY);
      this.ctx.lineTo(centerX + (this.Grid.gridOffsetX - this.Grid.tipHeight), centerY + this.Grid.gridOffsetY);
      this.ctx.lineTo(centerX - this.Grid.gridOffsetX + this.Grid.tipHeight, centerY + this.Grid.gridOffsetY);
      this.ctx.lineTo(centerX - this.Grid.gridOffsetX, centerY);
      if(id && idc.x == this.Grid.boardWidth && idc.y == 1){
        this.ctx.moveTo(centerX + (this.Grid.gridOffsetX - this.Grid.tipHeight), centerY - this.Grid.gridOffsetY);
        this.ctx.lineTo(centerX + this.Grid.gridOffsetX, centerY - this.Grid.gridHeight);
      }
      if(id && idc.x == 1 && idc.y == this.Grid.boardHeight){
        this.ctx.moveTo(centerX - this.Grid.gridOffsetX + this.Grid.tipHeight, centerY + this.Grid.gridOffsetY);
        this.ctx.lineTo(centerX - this.Grid.gridOffsetX, centerY + this.Grid.gridHeight);
      }
      this.ctx.closePath()
    }

    if(fill){
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  idToString(x, y){
    var idX = x+1;
    var idY = y+1;
    var id = idX + 1 < 10 ? '0' + idX : idX;
    id += idY < 10 ? '0' + idY : idY;
    return id;
  }

  idStringToCoord(id){
    return {
      x: parseInt(id.substring(0, 2)),
      y: parseInt(id.substring(2, 4))
    }
  }

  getHexById(id) {
    // Find the hex with the given coordinate id
    for(var x = 0; x < this.Hexes.length; x++){
      if(this.Hexes[x].id == id){
        return this.Hexes[x];
      }
    }

    return null;
  };

  getHoverHex(event){
    var rect = this.canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    if(x > 25 && x < this.canvas.width - 25 && y > 25 && y < this.canvas.height - 25){
      var currentHex = this.getNearestHex(x, y);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if(this.Grid.selected) this.selectHex(this.Grid.selected);
      this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
      if(this.Grid.selected != currentHex.id) this.drawHexagon(currentHex.x, currentHex.y, false, true);
    } else {
      this.mouseLeft();
      //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      //if(this.Grid.selected) this.selectHex(this.Grid.selected);
    }
  }

  mouseLeft(event){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if(this.Grid.selected) this.selectHex(this.Grid.selected);
  }

  getClickedHex(event){
    var rect = this.canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var currentHex = this.getNearestHex(x, y);
    this.selectHex(currentHex.id);
  }

  selectHex(id){
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var currentHex = this.getHexById(id);
    this.Grid.selected = id;
    this.drawHexagon(currentHex.x, currentHex.y, false, true);
  }

  getNearestHex(x, y) {
    var distance;
    var minDistance = Number.MAX_VALUE;
    var hx = null;

    // iterate through each hex in the grid
    for(var i = 0; i < this.Hexes.length; i++){
      distance = this.distanceFromMidPoint(this.Hexes[i].x, this.Hexes[i].y, x, y);

      if (distance < minDistance){ // if this is the nearest thus far
        minDistance = distance;
        hx = this.Hexes[i];
      }
    }
    return hx;
  };

  distanceFromMidPoint(hexX, hexY, x, y) {
    // Pythagoras' Theorem: Square of hypotenuse = sum of squares of other two sides
    var deltaX = hexX - x;
    var deltaY = hexY - y;

    // squaring so don't need to worry about square-rooting a negative number
    return Math.sqrt( (deltaX * deltaX) + (deltaY * deltaY) );
  };
}