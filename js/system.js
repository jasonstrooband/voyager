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
    this.data = [ {...this.last_star} ];
    this.primary = this.last_star.classification;
    this.primary_class = this.last_star.class;
    this.base_colour = this.getBaseColor();
  }

  getStarMultiples(){
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
    var oldPosition = 0;
    var newPosition = 0;
    var newStar = 0;

    var roll = dice.d10();
    if(roll <= 2){
      this.last_star.designation = 'B';
      oldPosition = this.last_star.position;
      newPosition = dice.roll('1d9');
      this.last_star.position = (newPosition >= oldPosition) ? newPosition : oldPosition;
      this.data.push({...this.last_star});
    } else {
      newStar = new Body('star', this.starCount);
      //console.log(newStar.type + '-' + this.last_star.type);
      if(this.starTypeHigher(newStar.type))newStar.convertToBD();
      //console.log(newStar.class + '-' + this.last_star.class);
      if(newStar.class && !this.last_star.class) newStar.convertToBD();
      if(newStar.class && this.starClassHigher(newStar.class)) newStar.convertToBD();
      if(newStar.type == this.last_star.type && newStar.position < this.last_star.position) newStar.position = this.last_star.position;
      this.data.push(newStar);
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
      if(typeSeq[x] == this.last_star.type) lastTypeX = x;
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
      if(classSeq[x] == this.last_star.class) lastClassX = x;
      if(classSeq[x] == classf) classX = x;
    }
    return classX < lastClassX;
  }

  render(){
    var system = $('#system');
    var systemTree = $('#systemTree');
    var x; // Loop variable
    var systemHTML = [];

    var systemNodes = [
      { "id": "system", "parent": "#", "text": this.name, 'state': { 'opened': true, 'selected': true}, 'li_attr': {'data-tab': 'des-system'} }
    ];

    for(x = 0; x < this.data.length; x++){
      systemNodes.push({
        "id": this.data[x].designation,
        "parent": "system",
        "text": this.name + ' ' + this.data[x].designation + ' - ' + this.data[x].classification,
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
      $('#system').find('.tab-pane').removeClass('show active');
      $("#"+tabId).addClass('show active');
    });

    //***************************************
    // System
    //***************************************
    systemHTML.push("<div id='des-system' class='tab-pane fade show active'>");
    systemHTML.push(`<h3>${this.name}</h3>`);
    systemHTML.push("<table class='table table-condensed'>");
    systemHTML.push("<tbody>");

    systemHTML.push(`<tr><th>Stars in System</th><td>${this.starCount}</td></tr>`);
    systemHTML.push(`<tr><th>Primary Star Classification</th><td>${this.primary}</td></tr>`);

    systemHTML.push("</tbody>");
    systemHTML.push("</table>");
    systemHTML.push("</div>");

    $('#system_name').html(this.name + ' (' + this.hexId + ')');
    systemHTML = systemHTML.join("\n");
    system.empty().append(systemHTML);

    //***************************************
    // First Orbits
    //***************************************
    for(x = 0; x < this.data.length; x++){
      systemHTML = [];
      systemHTML.push(`<div id='des-${this.data[x].designation}' class='tab-pane fade'>`);
      systemHTML.push(`<h3>${this.name + ' ' + this.data[x].designation}</h3>`);
      systemHTML.push("</div>");
      systemHTML = systemHTML.join("\n");
      system.append(systemHTML);
    }
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