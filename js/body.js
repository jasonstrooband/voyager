// TODO: Add comments
class Body {
  constructor(bodyType, designation) {
    this.designation = designation;

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

    if(forceBD){
      this.type = 'BD';
    } else {
      this.getStarType();
    }
    this.getStarPosition();
    this.getStarClass();

    this.classification = this.type + this.position + ((this.class) ? '-' + this.class : '');
  }

  convertToBD(){
    this.group = 'other';
    this.makeStar(true);
  }

  getStarType(){
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
  }

  getStarPosition(){
    if(this.group == "rare" || this.group == "common" || this.group == "f"){
      this.position = dice.roll('1d9');
    }
  }

  getStarClass(){
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
}