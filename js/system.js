class System {
  constructor(hexId, name) {
    this.hexId = hexId;
    this.name = name;
    this.starCount = 0;

    this.createPrimary();
    this.getStarMultiples();
  }

  createPrimary(){
    this.starCount++;
    this.last_star = new Body('star', this.starCount);
    this.data = { A:{...this.last_star} };
    this.primary = this.last_star.classification;
    this.primary_class = this.last_star.class;
    this.base_colour = this.getBaseColor();
  }

  getStarMultiples(){
    var x = 0;
    switch(galaxy.galaxyCluster){
      case 'globular':
        x = 5;
        break;
      case 'open':
        x = 8;
        break;
    }

    while(true){
      var roll = dice.roll('3d10+'+x);

      if(this.starCount < 2){
        if(roll > 17){
          this.starCount++;
          this.createNewStar();
        } else {
          break;
        }
      } else {
        if(roll > 24){
          this.starCount++;
        } else {
          break;
        }
      }
    }
  }

  createNewStar(){
    var roll = dice.d10();
    if(roll <= 2){
      this.last_star.designation = 'B';
      var old_position = this.last_star.position;
      var new_position = dice.roll('1d9');
      this.last_star.position = (new_position >= old_position) ? new_position : old_position;
      this.data.B = {...this.last_star};
    } else {
      var newStar = new Body('star', this.starCount);
      //console.log(newStar.type + '-' + this.last_star.type);
      if(this.starTypeHigher(newStar.type))newStar.convertToBD();
      //console.log(newStar.class + '-' + this.last_star.class);
      if(newStar.class && !this.last_star.class) newStar.convertToBD();
      if(newStar.class && this.starClassHigher(newStar.class)) newStar.convertToBD();
      if(newStar.type == this.last_star.type && newStar.position < this.last_star.position) newStar.position = this.last_star.position;
      this.data.B = newStar;
    }
  }

  getBaseColor(){
    switch(this.data.A.type){
      case 'O':
        return 'darkblue';
        break;
      case 'B':
        return 'blue';
        break;
      case 'A':
        return 'lightblue';
        break;
      case 'F':
        return 'white';
        break;
      case 'G':
        return 'yellow';
        break;
      case 'K':
        return 'orange';
        break;
      case 'M':
        return 'red';
        break;
      case 'WD':
        return 'white';
        break;
      case 'BD':
        return 'brown';
        break;
      default:
        return 'purple';
        break;
    }
  }

  starTypeHigher(type){
    var type_seq = ['BH','NS','O','B','A','F','G','K','M','WD','BD'];
    var last_type_x = false;
    var type_x = false;
    for(var x = 0; x < type_seq.length; x++){
      if(type_seq[x] == this.last_star.type) last_type_x = x;
      if(type_seq[x] == type) type_x = x;
    }
    return type_x < last_type_x;
  }

  starClassHigher(classf){
    var class_seq = ['Ia', 'Ib', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    var last_class_x = false;
    var class_x = false;
    for(var x = 0; x < class_seq.length; x++){
      if(class_seq[x] == this.last_star.class) last_class_x = x;
      if(class_seq[x] == classf) class_x = x;
    }
    return class_x < last_class_x;
  }

  render(){
    var system_html = [];
    system_html.push("<table class='table table-condensed'>");
    system_html.push("<tbody>");

    system_html.push(`<tr><th>Stars in System</th><td>${this.starCount}</td></tr>`);
    system_html.push(`<tr><th>Primary Star Classification</th><td>${this.primary}</td></tr>`);

    system_html.push("</tbody>");
    system_html.push("</table>");

    $('#system_name').html(this.name + ' (' + this.hexId + ')');
    $('#system_details').html(system_html.join("\n"));
    console.log(this);
  }
}

// Data Structure for system
//-B-0 (barycenter)
//  -S-A (star)
//    -B-01
//      -P-A1 (planet)
//      -P-A2 (planet)
//    -P-A3 (planet)
//      -S-A3I (satellite)
//    -S-B (star)
//      -P-B1 (planet)
//  -S-C (star)
//  -P-01
//    -01I
//    -01II
//    -01III