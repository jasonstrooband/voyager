// TODO: Add comments
class Galaxy {
  constructor() {

    this.generate();
    this.render();
  }

  generate(){
    if(debug_flag) console.log("%cGenerate Galaxy", debug_head_css);
    this.resetGalaxy();
    this.genGalaxyType();
    this.genGalaxyLocation();
    this.genClusterLocation();

    if(debug_flag) this.debug();
  }

  resetGalaxy(){
    this.modifiers = {
      age_modifier: 0
    };

    this.galaxyType = '';
    this.galaxyClass = '';
    this.galaxyArms = '';
    this.galaxyLocation = '';
    this.galaxyCluster = '';
  }

  genGalaxyType(){
    // Set vars
    var ranges = [[1,12], [13,28], [29,39], [40,94], [95,100]];
    var values = ['irregular', 'elliptical', 'lenticular', 'spiral', 'none'];

    // Get value from range
    this.galaxyType = returnFromRange(dice.d100(), ranges, values);
    if(debug_flag) console.log("Get Galaxy Type ... " + this.galaxyType.capitalize());

    // Go to sub functions and apply mods
    switch(this.galaxyType){
      case 'irregular':
        this.modifiers.age_modifier--;
        if(debug_flag) console.log("Set Age Modifier -1 ... " + this.modifiers.age_modifier);
        this.genGalaxyClassIrregular();
        break;
      case 'elliptical':
        this.modifiers.age_modifier += 5;
        if(debug_flag) console.log("Set Age Modifier +5 ... " + this.modifiers.age_modifier);
        this.genGalaxyClassElliptical();
        break;
      case 'lenticular':
        this.genGalaxyClassLenticular();
        break;
      case 'spiral':
        this.genGalaxyClassSpiral();
        break;
      default:
        // TODO: Add default
        break;
    }

    if(debug_flag && this.galaxyClass) console.log("Get Galaxy Class ... " + this.galaxyClass.capitalize());
    if(debug_flag && this.galaxyArms) console.log("Get Galaxy Arms ... " + this.galaxyArms.capitalize());
  }

  genGalaxyClassIrregular(){
    // Set vars
    var ranges = [[1,2], [2,4]];
    var values = ['irr-1', 'irr-2'];

    // Get value from range
    this.galaxyClass = returnFromRange(dice.d4(), ranges, values);
  }

  genGalaxyClassElliptical(){
    this.galaxyClass = 'E' + dice.roll("1d7");
  }

  genGalaxyClassLenticular(){
    // Set vars
    var ranges = [[1,2], [2,4]];
    var values = ['S', 'SB'];

    // Get value from range
    this.galaxyClass = returnFromRange(dice.d4(), ranges, values);
  }

  genGalaxyClassSpiral(){
    var design;
    var ranges1 = [[1,2], [2,4]];
    var values1 = ['S', 'SB'];
    var ranges2 = [[1,2], [3,5], [6,10]];
    var values2 = ['Grand Design', 'Flocculent', 'Multi-Armed'];

    // Get value from range
    this.galaxyClass = returnFromRange(dice.d4(), ranges1, values1);
    this.galaxyClass += 'abc'.substr(Math.floor(Math.random() * 3), 1);
    design = returnFromRange(dice.d10(), ranges2, values2);
    if(design == 'Multi-Armed') design += ` with ${2 * Math.round(dice.roll('1d6+2') / 2)} arms`;
    this.galaxyArms = design;
  }

  genGalaxyLocation(){
    // Go to sub functions
    switch(this.galaxyType){
      case 'irregular':
      case 'elliptical':
        this.genGalaxyLocationIrregularElliptical();
        break;
      case 'lenticular':
      case 'spiral':
        this.genGalaxyLocationLenticularSpiral();
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  genGalaxyLocationIrregularElliptical(){
    var ranges = [[1,3], [4,10]];
    var values = ['bulge', 'halo'];
    this.galaxyLocation = returnFromRange(dice.d10(), ranges, values);
    if(debug_flag) console.log("Get Sector Location ... " + this.galaxyLocation.capitalize());

    // Apply modifiers
    switch(this.galaxyLocation){
      case 'bulge':
        this.modifiers.age_modifier += 3;
        if(debug_flag) console.log("Set Age Modifier +3 ... " + this.modifiers.age_modifier);
        break;
      case 'halo':
        this.modifiers.age_modifier += 2;
        if(debug_flag) console.log("Set Age Modifier +2 ... " + this.modifiers.age_modifier);
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  genGalaxyLocationLenticularSpiral(){
    var ranges = [[1,18], [19,86], [87,100]];
    var values = ['bulge', 'disk', 'halo'];
    this.galaxyLocation = returnFromRange(dice.d100(), ranges, values);
    if(debug_flag) console.log("Get Sector Location ... " + this.galaxyLocation.capitalize());

    // Apply modifiers
    switch(this.galaxyLocation){
      case 'bulge':
        switch(this.galaxyClass){
          case 'Sa':
          case 'SBa':
            this.modifiers.age_modifier += 3;
            if(debug_flag) console.log("Set Age Modifier +3 ... " + this.modifiers.age_modifier);
            break;
          case 'Sb':
          case 'SBb':
            if(dice.d4() <= 2){
              this.modifiers.age_modifier += 3;
              if(debug_flag) console.log("Set Age Modifier +3 ... " + this.modifiers.age_modifier);
            }
            break;
          case 'Sc':
          case 'SBc':
            this.modifiers.age_modifier--;
            if(debug_flag) console.log("Set Age Modifier -1 ... " + this.modifiers.age_modifier);
            break;
          default:
            // TODO: Add default
            break;
        }
        break;
      case 'disk':
        this.modifiers.age_modifier -= 2;
        if(debug_flag) console.log("Set Age Modifier -2 ... " + this.modifiers.age_modifier);
        break;
      case 'halo':
        this.modifiers.age_modifier += 3;
        if(debug_flag) console.log("Set Age Modifier +3 ... " + this.modifiers.age_modifier);
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  genClusterLocation(){
    switch(this.galaxyType){
      case 'irregular':
        this.genClusterLocationIrregular();
        break;
      case 'elliptical':
        this.genClusterLocationElliptical();
        break;
      case 'spiral':
        this.genClusterLocationSpiral();
        break;
      case 'lenticular':
        this.genClusterLocationLenticular();
        break;
      case 'none':
        this.genClusterLocationNone();
        break;
      default:
        // TODO: Add default
        break;
    }

    if(debug_flag) console.log("Set System Cluster ... " + this.galaxyCluster.capitalize() + " Cluster");

    // Apply Modifiers
    switch(this.galaxyCluster){
      case 'open':
        this.modifiers.age_modifier -= 2;
        if(debug_flag) console.log("Set Age Modifier -2 ... " + this.modifiers.age_modifier);
        break;
      case 'globular':
        this.modifiers.age_modifier += 2;
        if(debug_flag) console.log("Set Age Modifier +2 ... " + this.modifiers.age_modifier);
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  genClusterLocationIrregular(){
    var ranges = [[1,30], [31,50], [51,100]];
    var values = ['open', 'globular', 'no'];
    this.galaxyCluster = returnFromRange(dice.d100(), ranges, values);
  }

  genClusterLocationElliptical(){
    var ranges = [[1,4], [5,10]];
    var values = ['globular', 'no'];
    this.galaxyCluster = returnFromRange(dice.d10(), ranges, values);
  }

  genClusterLocationSpiral(){
    var ranges;
    var values;

    // Where is the system in the galaxy
    switch(this.galaxyLocation){
      case 'bulge':
        switch(this.galaxyClass){
          case 'Sa':
          case 'SBa':
            ranges = [[1,40], [41,50], [51,100]];
            break;
          case 'Sb':
          case 'SBb':
            ranges = [[1,25], [26,50], [51,100]];
            break;
          case 'Sc':
          case 'SBc':
            ranges = [[1,10], [11,50], [51,100]];
            break;
          default:
            // TODO: Add default
            break;
        }
        values = ['globular', 'open', 'no'];
        this.galaxyCluster = returnFromRange(dice.d100(), ranges, values);
        break;
      case 'disk':
        ranges = [[1,9], [10,44], [45,100]];
        values = ['globular', 'open', 'no'];
        this.galaxyCluster = returnFromRange(dice.d100(), ranges, values);
        break;
      case 'halo':
        ranges = [[1,4], [5,10]];
        values = ['globular', 'no'];
        this.galaxyCluster = returnFromRange(dice.d10(), ranges, values);
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  genClusterLocationLenticular(){
    // Set vars
    var ranges;
    var values;

    // Where is the system in the galaxy
    switch(this.galaxyLocation){
      case 'bulge':
        ranges = [[1,25], [26,50], [51,100]];
        values = ['globular', 'open', 'no'];

        // Get value from range
        this.galaxyCluster = returnFromRange(dice.d100(), ranges, values);
        break;
      case 'halo':
        ranges = [[1,4], [5,10]];
        values = ['globular', 'no'];

        // Get value from range
        this.galaxyCluster = returnFromRange(dice.d10(), ranges, values);
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  genClusterLocationNone(){
    // Set vars
    var ranges = [[1,3], [4,6], [7,10]];
    var values = ['globular', 'open', 'no'];

    // Get value from range
    this.galaxyCluster = returnFromRange(dice.d10(), ranges, values);
  }

  debug(){
    var debugObj = {
      'Galaxy Type': this.galaxyType,
      'Galaxy Class': this.galaxyClass,
      'Galaxy Location': this.galaxyLocation,
      'Galaxy Cluster': this.galaxyCluster,
      'Modifiers': this.modifiers
    };
    console.log("%cFinal Galaxy", debug_subhead_css);
    console.log(debugObj);
  }

  render(){
    var galaxyHTML = [];
    var anyMods = arrayNot(this.modifiers, 0);
    galaxyHTML.push("<table class='table table-condensed'>");
    galaxyHTML.push("<tbody>");

    galaxyHTML.push(`<tr><th>Galaxy Type</th><td>${this.galaxyType.capitalize()} Galaxy</td></tr>`);
    if(this.galaxyClass && this.galaxyType == 'spiral') galaxyHTML.push(`<tr><th>Galaxy Classification</th><td>${this.galaxyClass.capitalize()} - ${this.galaxyArms}</td></tr>`);
    if(this.galaxyClass && this.galaxyType != 'spiral') galaxyHTML.push(`<tr><th>Galaxy Classification</th><td>${this.galaxyClass.capitalize()}</td></tr>`);
    if(this.galaxyLocation) galaxyHTML.push(`<tr><th>Galaxy Location</th><td>Galactic ${this.galaxyLocation.capitalize()}</td></tr>`);
    if(this.galaxyCluster) galaxyHTML.push(`<tr><th>Galaxy CLuster</th><td>${this.galaxyCluster.capitalize()} Cluster</td></tr>`);

    galaxyHTML.push("</tbody>");
    galaxyHTML.push("</table>");

    if(anyMods){
      galaxyHTML.push('<h3>Modifiers:</h3>');
      galaxyHTML.push('<ul class="list-group">');
      galaxyHTML.push(`<li class="list-group-item bg-dark">Age Modifier <span class="badge badge-primary float-right">${this.modifiers.age_modifier}</span></li>`);
      galaxyHTML.push('</ul');
    }

    $('#galaxy_details').html(galaxyHTML.join("\n"));
  }
}