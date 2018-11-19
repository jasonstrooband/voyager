// TODO: Add comments
class Body {
  constructor(bodyType, designation) {
    this.designation = designation;
    this.bodyType = bodyType;
    this.generate = true;

    switch(bodyType){
      case 'star':
        this.makeStar();
        this.getStarDesignation();
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  makeStar(forceBD = false){
    this.type = '';
    this.position = '';
    this.class = '';
    this.classification = '';

    // TODO: Luminosity is calculated from mass where | M>100 (L=M^1.6) | M>10 (L=M^3.1) | M>1 (L=M^4.7) | M<1 (L=M^2.7)

    if(forceBD){
      this.type = 'BD';
    } else {
      this.getStarType();
    }
    if(this.generate){
      this.getStarPosition();
      this.getStarClass();
      this.classification = this.type + this.position + ((this.class) ? '-' + this.class : '');
      this.getStarDetails();
    }
  }

  convertToBD(){
    this.group = 'other';
    this.makeStar(true);
  }

  getStarType(){
    // TODO: Move F type group to common
    // TODO: Make M type stars more common
    var ranges = [[1,12], [13,34], [35,72], [73,100]];
    var values = ['rare', 'f', 'common', 'other'];
    this.group = returnFromRange(dice.d100(), ranges, values);

    switch(this.group){
      case 'rare':
        this.getStarTypeRare();
        break;
      case 'f':
        this.type = 'F';
        break;
      case 'common':
        this.getStarTypeCommon();
        break;
      case 'other':
        this.getStarTypeOther();
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  getStarTypeRare(){
    var ranges = [[1,2], [3,5], [6,10]];
    var values = ['O', 'B', 'A'];
    this.type = returnFromRange(dice.d10(), ranges, values);
  }

  getStarTypeCommon(){
    var ranges = [[1,27], [28,59], [60,100]];
    var values = ['G', 'K', 'M'];
    this.type = returnFromRange(dice.d10(), ranges, values);
  }

  getStarTypeOther(){
    var ranges = [[1,7], [8,18], [19,19], [20,20]];
    var values = ['WD', 'BD', 'NS', 'BH'];
    this.type = returnFromRange(dice.d20(), ranges, values);
    if(this.type == "NS" || this.type == "BH"){
      this.classification = this.type;
      this.generate = false;
    }
  }

  getStarPosition(){
    if(this.group == "rare" || this.group == "common" || this.group == "f"){
      this.position = dice.roll('1d10')-1;
    }
  }

  getStarClass(){
    // TODO: Add in type 0 - Hypergiant
    var ranges;
    var values;
    if(this.type == 'WD') this.class = 'VII';

    if(this.group == "rare" || this.group == "common" || this.group == "f"){
      ranges = [[1,2], [3,4], [5,9], [10,21], [22,39], [40,90], [91,100]];
      values = ['Ia', 'Ib', 'II', 'III', 'IV', 'V', 'VI'];
      this.class = returnFromRange(dice.d100(), ranges, values);
    }
  }

  getStarDesignation(){
    var alphabet = 'ABCDEFGHIJKLMNOPQRXTUVWXYZ';
    this.designation = alphabet[this.designation-1];
  }

  getStarDetails(){
    var roll;
    switch(this.type){
      case "O":
      case "B":
      case "A":
      case "F":
      case "G":
      case "K":
      case "M":
        this.mass = starData[this.classification].Mass;
        this.lum = starData[this.classification].Luminosity;
        this.radius = starData[this.classification].Radius;
        this.temp = starData[this.classification].Temperature;
        this.colour = rgbToHex(starData[this.classification].R, starData[this.classification].G, starData[this.classification].B);
        break;
      case "WD":
      case "BD":
        roll = dice.d10();
        this.mass = starData[this.type + roll].Mass;
        this.lum = starData[this.type + roll].Luminosity;
        this.radius = starData[this.type + roll].Radius;
        this.temp = starData[this.type + roll].Temperature;
        this.colour = rgbToHex(starData[this.type + roll].R, starData[this.type + roll].G, starData[this.type + roll].B);
        break;
      default:
        this.mass = 0;
        break;
    }
  }
}