class Body {
  constructor(bodyType) {
    switch(bodyType){
      case 'star':
        this.makeStar();
        break;
    }
  }

  makeStar(){
    this.type = '';
    this.position = '';
    this.class = '';

    this.getStarType();
    this.getStarPosition();
    this.getStarClass();
    this.getStarColor();

    this.classification = this.type + this.position + ((this.class) ? '-' + this.class : '');
  }

  getStarType(){
    var ranges = [[1,12], [13,34], [35,72], [73,100]];
    var values = ['rare', 'f', 'common', 'other'];
    this.group = return_from_range(dice.d100(), ranges, values);

    switch(this.group){
      case 'rare':
        this.getStarType_rare();
        break;
      case 'f':
        this.type = 'F';
        break;
      case 'common':
        this.getStarType_common();
        break;
      case 'other':
        this.getStarType_other();
        break;
    }
  }

  getStarType_rare(){
    var ranges = [[1,2], [3,5], [6,10]];
    var values = ['O', 'B', 'A'];
    this.type = return_from_range(dice.d10(), ranges, values);
  }

  getStarType_common(){
    var ranges = [[1,27], [28,59], [60,100]];
    var values = ['G', 'K', 'M'];
    this.type = return_from_range(dice.d10(), ranges, values);
  }

  getStarType_other(){
    var ranges = [[1,7], [8,18], [19,19], [20,20]];
    var values = ['WD', 'BD', 'NS', 'BH'];
    this.type = return_from_range(dice.d20(), ranges, values);
  }

  getStarPosition(){
    if(this.group == "rare" || this.group == "common" || this.group == "f"){
      this.position = dice.roll('1d9');
    }
  }

  getStarClass(){
    if(this.type == 'WD') this.class = 'VII';

    if(this.group == "rare" || this.group == "common" || this.group == "f"){
      var ranges = [[1,2], [3,4], [5,9], [10,21], [22,39], [40,90], [91,100]];
      var values = ['Ia', 'Ib', 'II', 'III', 'IV', 'V', 'VI'];
      this.class = return_from_range(dice.d100(), ranges, values);
    }
  }

  getStarColor(){
    switch(this.type){
      case 'O':
        this.base_colour = 'darkblue';
        break;
      case 'B':
        this.base_colour = 'blue';
        break;
      case 'A':
        this.base_colour = 'lightblue';
        break;
      case 'F':
        this.base_colour = 'white';
        break;
      case 'G':
        this.base_colour = 'yellow';
        break;
      case 'K':
        this.base_colour = 'orange';
        break;
      case 'M':
        this.base_colour = 'red';
        break;
      case 'WD':
        this.base_colour = 'white';
        break;
      case 'BD':
        this.base_colour = 'brown';
        break;
      default:
        this.base_colour = 'purple';
        break;
    }
  }
}