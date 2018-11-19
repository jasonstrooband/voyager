// TODO: Add comments
class System {
  constructor(hexId, name) {
    this.hexId = hexId;
    this.name = name;
    this.starCount = 0;

    this.genPrimaryStar();
    this.genStarMultiples();
  }

  genPrimaryStar(){
    this.starCount++;
    this.lastStar = new Body('star', this.starCount);
    this.data = [ {...this.lastStar} ];
    this.primary = this.lastStar.classification;
    this.primary_class = this.lastStar.class;
    this.base_colour = this.getBaseColor();
  }

  genStarMultiples(){
    var x = 0;
    var roll;

    switch(galaxy.galaxyCluster){
      case 'globular':
        x = 5;
        break;
      case 'open':
        x = 8;
        break;
      default:
        // TODO: Add default
        break;
    }

    while(true){
      roll = dice.roll('3d10+'+x);

      if(this.starCount < 2){
        if(roll > 17){
          this.starCount++;
          this.genNewStar();
        } else {
          break;
        }
      } else {
        if(roll > 24){
          this.starCount++;
          this.genNewStar();
        } else {
          break;
        }
      }
    }
  }

  genNewStar(){
    var oldPosition = 0;
    var newPosition = 0;
    var newStar = 0;

    var roll = dice.d10();
    if(roll <= 2){
      this.lastStar.designation = 'B';
      oldPosition = this.lastStar.position;
      newPosition = dice.roll('1d9');
      this.lastStar.position = (newPosition >= oldPosition) ? newPosition : oldPosition;
      this.data.push({...this.lastStar});
    } else {
      newStar = new Body('star', this.starCount);
      if(this.starTypeHigher(newStar.type))newStar.convertToBD();
      if(newStar.class && !this.lastStar.class) newStar.convertToBD();
      if(newStar.class && this.starClassHigher(newStar.class)) newStar.convertToBD();
      if(newStar.type == this.lastStar.type && newStar.position < this.lastStar.position) newStar.position = this.lastStar.position;
      this.data.push(newStar);
      this.lastStar = {...newStar};
    }
  }

  getBaseColor(){
    switch(this.data[0].type){
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
    var x; // Loop var
    var typeSeq = ['BH','NS','O','B','A','F','G','K','M','WD','BD'];
    var lastTypeX = false;
    var typeX = false;

    for(x = 0; x < typeSeq.length; x++){
      if(typeSeq[x] == this.lastStar.type) lastTypeX = x;
      if(typeSeq[x] == type) typeX = x;
    }
    return typeX < lastTypeX;
  }

  starClassHigher(classf){
    var x; // Loop var
    var classSeq = ['Ia', 'Ib', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    var lastClassX = false;
    var classX = false;
    for(x = 0; x < classSeq.length; x++){
      if(classSeq[x] == this.lastStar.class) lastClassX = x;
      if(classSeq[x] == classf) classX = x;
    }
    return classX < lastClassX;
  }

  render(){
    var systemTree = $('#system_tree');
    var systemDetails = $('#system_details');
    var x; // Loop variable
    var systemHTML = [];

    var systemNodes = [
      { "id": "system", "parent": "#", "text": this.name, "icon": 'icon spacon-13-planetary', 'state': { 'opened': true, 'selected': true}, 'li_attr': {'data-tab': 'des-system'} }
    ];

    for(x = 0; x < this.data.length; x++){
      systemNodes.push({
        "id": this.data[x].designation,
        "parent": "system",
        "text": this.name + ' ' + this.data[x].designation + ' - ' + this.data[x].classification,
        "icon": 'icon spacon-7-sun',
        "li_attr": { "data-tab": 'des-' + this.data[x].designation }
      });
    }
    systemTree.jstree('destroy'); // Destroy before building to re-init after changing systems
    systemTree.jstree({
      'core' : {
        "multiple": false,
        'check_callback': true,
        'data': systemNodes
      },
      "plugins" : [ "wholerow" ]
    }).on("select_node.jstree", function(event, node) {
      var tabId = $(node.event.currentTarget).parent().attr('data-tab');
      systemDetails.find('.tab-pane').removeClass('show active');
      $("#"+tabId).addClass('show active');
    });

    //***************************************
    // System
    //***************************************
    systemHTML.push("<div id='des-system' class='tab-pane fade show active'>");
    systemHTML.push(`<h3>${this.name}</h3>`);
    systemHTML.push("<table class='table table-condensed'>");
    systemHTML.push("<tbody>");

    systemHTML.push(`<tr><th>Primary Star Classification</th><td>${this.primary}</td></tr>`);
    systemHTML.push(`<tr><th>Stars in System</th><td>${this.starCount}</td></tr>`);
    systemHTML.push(`<tr><th>Planets in System</th><td></td></tr>`);

    systemHTML.push("</tbody>");
    systemHTML.push("</table>");
    systemHTML.push("</div>");

    $('#system_name').html(this.name + ' (' + this.hexId + ')');
    systemHTML = systemHTML.join("\n");
    systemDetails.html(systemHTML);

    //***************************************
    // First Orbits
    //***************************************
    for(x = 0; x < this.data.length; x++){
      systemHTML = [];
      systemHTML.push(`<div id='des-${this.data[x].designation}' class='tab-pane fade'>`);
      systemHTML.push(`<h3>${this.name + ' ' + this.data[x].designation}</h3>`);

      systemHTML.push("<table class='table table-condensed'>");
      systemHTML.push("<tbody>");

      systemHTML.push(`<tr><th>Classification</th><td>${this.data[x].classification}</td></tr>`);
      systemHTML.push(`<tr><th>Mass (M<sub>☉</sub>)</th><td>${this.data[x].mass}</td></tr>`);
      systemHTML.push(`<tr><th>Luminosity (L<sub>☉</sub>)</th><td>${this.data[x].lum}</td></tr>`);
      systemHTML.push(`<tr><th>Redius (R<sub>☉</sub>)</th><td>${this.data[x].radius}</td></tr>`);
      systemHTML.push(`<tr><th>Temperature (T<sub>eff☉</sub>)</th><td>${this.data[x].temp}K</td></tr>`);
      systemHTML.push(`<tr><th>Colour</th><td><span class="colour-block" style="background-color:${this.data[x].colour};"></span>${this.data[x].colour}</td></tr>`);

      systemHTML.push("</tbody>");
      systemHTML.push("</table>");

      systemHTML.push("</div>");
      systemHTML = systemHTML.join("\n");
      systemDetails.append(systemHTML);
    }
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