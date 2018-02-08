class HexMap {
  constructor(board, canvasId, orientation = 'vertical') {
    this.LAYER1 = {};
    this.LAYER1.canvas = document.getElementById(canvasId + '_LAYER1');
    this.LAYER1.ctx = this.LAYER1.canvas.getContext('2d');
    this.LAYER2 = {};
    this.LAYER2.canvas = document.getElementById(canvasId + '_LAYER2');
    this.LAYER2.ctx = this.LAYER2.canvas.getContext('2d');

    this.Hexes = [];
    this.Grid = {};
    this.Grid.selected = null;
    this.Grid.boardWidth = board.width;
    this.Grid.boardHeight = board.height;
    this.Grid.orientation = orientation;

    if(this.Grid.orientation != 'horizontal' && this.Grid.orientation != 'vertical') this.Grid.orientation = 'vertical';

    this.layer1Render(this.LAYER1.canvas, this.LAYER1.ctx);
    this.layer2Render(this.LAYER2.canvas, this.LAYER2.ctx);
  }

  layer1Render(canvas, ctx){
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

  layer2Render(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx;

    this.canvas.addEventListener('mousemove', this.getHoverHex.bind(this), false);
    this.canvas.addEventListener('mouseleave', this.mouseLeft.bind(this), false);
    //this.canvas.addEventListener('click', this.getClickedHex.bind(this), false);
    $(this.canvas).on('click', this.getClickedHex.bind(this));
  }

  drawStarryBG() {
    var stars = 200;
    var colourRange = [0, 60, 240];
    var i; // Loop var
    var x = 0;
    var y = 0;
    var radius = 0;
    var hue = 0;
    var sat = 0;

    for (i = 0; i < stars; i++) {
      x = Math.random() * this.canvas.offsetWidth;
      y = Math.random() * this.canvas.offsetHeight;
      radius = Math.random() * 1.2;
      hue = colourRange[getRandom(0, colourRange.length - 1)];
      sat = getRandom(50, 100);
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 360);
      this.ctx.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)";
      this.ctx.fill();
    }
  }

  drawDirections(){
    var heightDiff;

    this.ctx.font = "16px Ariel";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Coreward", this.canvas.width / 2, 18);
    this.ctx.fillText("Rimward", this.canvas.width / 2, this.canvas.height - 7);
    this.ctx.save();
    heightDiff = this.canvas.height - this.canvas.width;
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
    var x; // Loop width var
    var y; // Loop height var
    var centerX;
    var centerY;
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

    for(x = 0; x < this.Grid.boardWidth; x++) {
      for(y = 0; y < this.Grid.boardHeight; y++) {
        centerX = 0;
        centerY = 0;
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
    var x; // Loop var
    this.ctx.font = "10px Ariel";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
    for(x = 0; x < this.Hexes.length; x++){
      if(drawCoord){
        this.ctx.beginPath();
        this.ctx.fillRect(this.Hexes[x].x - 2, this.Hexes[x].y - 2, 4, 4);
        this.ctx.fill();
        this.ctx.closePath();
      }

      this.drawHexagon(this.Hexes[x].x, this.Hexes[x].y, this.Hexes[x].id);
    }
  }

  drawHexagon(centerX, centerY, id = '', fill = false){
    var idc;
    if(id){
      idc = this.idStringToCoord(id);
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

  addSystems(){
    var x; // Loop var
    var currentHex;
    var radius;

    this.setLayer(1);

    this.ctx.fillStyle = "purple";

    for(x = 0; x < sector.systems.length; x++){
      currentHex = this.getHexById(sector.systems[x].hexId);
      this.ctx.fillStyle = sector.systems[x].base_colour;

      switch(sector.systems[x].primary_class){
        case 'Ia':
        case 'Ib':
        case 'II':
          radius = 15;
          break;
        case 'III':
          radius = 10;
          break;
        case 'IV':
        case 'V':
        case 'VI':
          radius = 6;
          break;
        default:
          radius = 3;
          break;
      }

      this.ctx.beginPath();
      this.ctx.arc(currentHex.x, currentHex.y, radius, 0, 360);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  static idToString(x, y){
    var idX = x+1;
    var idY = y+1;
    var id = idX + 1 < 10 ? '0' + idX : idX;
    id += idY < 10 ? '0' + idY : idY;
    return id;
  }

  static idStringToCoord(id){
    return {
      x: parseInt(id.substring(0, 2)),
      y: parseInt(id.substring(2, 4))
    }
  }

  getHexById(id) {
    var x; // Loop var
    // Find the hex with the given coordinate id
    for(x = 0; x < this.Hexes.length; x++){
      if(this.Hexes[x].id == id){
        return this.Hexes[x];
      }
    }

    return null;
  };

  getHoverHex(event){
    var currentHex;
    var rect = this.canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    this.setLayer(2);

    if(x > 25 && x < this.canvas.width - 25 && y > 25 && y < this.canvas.height - 25){
      currentHex = this.getNearestHex(x, y);

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

  mouseLeft(){
    this.setLayer(2);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if(this.Grid.selected) this.selectHex(this.Grid.selected);
  }

  getClickedHex(event){
    var rect = this.canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var currentHex = this.getNearestHex(x, y);

    this.setLayer(2);
    this.selectHex(currentHex.id);

    if(currentHex.hasStar) sector.renderSystem(currentHex.id)
  }

  selectHex(id){
    var currentHex = this.getHexById(id);
    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.Grid.selected = id;
    this.drawHexagon(currentHex.x, currentHex.y, false, true);
  }

  getNearestHex(x, y) {
    var i; // Loop var
    var distance;
    var minDistance = Number.MAX_VALUE;
    var hx = null;

    // iterate through each hex in the grid
    for(i = 0; i < this.Hexes.length; i++){
      distance = this.distanceFromMidPoint(this.Hexes[i].x, this.Hexes[i].y, x, y);

      if (distance < minDistance){ // if this is the nearest thus far
        minDistance = distance;
        hx = this.Hexes[i];
      }
    }
    return hx;
  };

  static distanceFromMidPoint(hexX, hexY, x, y) {
    // Pythagoras' Theorem: Square of hypotenuse = sum of squares of other two sides
    var deltaX = hexX - x;
    var deltaY = hexY - y;

    // squaring so don't need to worry about square-rooting a negative number
    return Math.sqrt( (deltaX * deltaX) + (deltaY * deltaY) );
  };

  setLayer(layer){
    switch(layer){
      case 2:
        this.canvas = this.LAYER2.canvas;
        this.ctx = this.LAYER2.ctx;
        break;
      default:
        this.canvas = this.LAYER1.canvas;
        this.ctx = this.LAYER1.ctx;
        break;
    }
  }
}