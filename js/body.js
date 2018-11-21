// TODO: Add comments
class Body {
  constructor(bodyType, designation) {
    // TODO: Make rare groups rarer and possibly only have one or two per sector
    this.star_types = {
      groups: [
        {data: "rare", weight: 14},
        {data: "common", weight: 56},
        {data: "other", weight: 30}
      ],
      rare: [
        {data: "O", weight: 2},
        {data: "B", weight: 3},
        {data: "A", weight: 5}
      ],
      common: [
        {data: "G", weight: 27},
        {data: "K", weight: 32},
        {data: "M", weight: 41}
      ],
      other: [
        {data: "WD", weight: 7},
        {data: "BD", weight: 11},
        {data: "NS", weight: 1},
        {data: "BH", weight: 1}
      ]
    };

    this.star_class = [
      {data: "0", weight: 1},
      {data: "Ia", weight: 2},
      {data: "Ib", weight: 2},
      {data: "II", weight: 5},
      {data: "III", weight: 12},
      {data: "IV", weight: 18},
      {data: "V", weight: 50},
      {data: "VI", weight: 10}
    ];

    this.designation = designation;
    this.bodyType = bodyType;

    switch(this.bodyType){
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

    if(this.type != "NS" || this.type != "BH"){
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
    this.group = weightedRandom(this.star_types.groups);

    switch(this.group){
      case 'rare':
        this.type = weightedRandom(this.star_types.rare);
        break;
      case 'common':
        this.type = weightedRandom(this.star_types.common);
        break;
      case 'other':
        this.type = weightedRandom(this.star_types.other);
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  getStarPosition(){
    if(this.group == "rare" || this.group == "common"){
      this.position = dice.roll('1d10')-1;
    }
  }

  getStarClass(){
    // TODO: Add in type 0 - Hypergiant
    if(this.type == 'WD') this.class = 'VII';

    if(this.group == "rare" || this.group == "common"){
      this.class = weightedRandom(this.star_class);
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