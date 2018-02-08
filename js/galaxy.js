class Galaxy {
  constructor(debug = false) {
    this.debug_flag = debug;

    this.generate();
    this.render();
  }

  generate(){
    this.resetGalaxy();
    this.galaxyType();
    this.galaxyLocation();
    this.clusterLocation();

    if(this.debug_flag) this.debug();
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

  galaxyType(){
    // Set vars
    var ranges = [[1,12], [13,28], [29,39], [40,94], [95,100]];
    var values = ['irregular', 'elliptical', 'lenticular', 'spiral', 'none'];

    // Get value from range
    this.galaxyType = returnFromRange(dice.d100(), ranges, values);

    // Go to sub functions and apply mods
    switch(this.galaxyType){
      case 'irregular':
        this.modifiers.age_modifier--;
        this.galaxyClassIrregular();
        break;
      case 'elliptical':
        this.modifiers.age_modifier += 5;
        this.galaxyClassElliptical();
        break;
      case 'lenticular':
        this.galaxyClassLenticular();
        break;
      case 'spiral':
        this.galaxyClassSpiral();
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  galaxyClassIrregular(){
    // Set vars
    var ranges = [[1,2], [2,4]];
    var values = ['irr-1', 'irr-2'];

    // Get value from range
    this.galaxyClass = returnFromRange(dice.d4(), ranges, values);
  }

  galaxyClassElliptical(){
    this.galaxyClass = 'E' + dice.roll("1d7");
  }

  galaxyClassLenticular(){
    // Set vars
    var ranges = [[1,2], [2,4]];
    var values = ['S', 'SB'];

    // Get value from range
    this.galaxyClass = returnFromRange(dice.d4(), ranges, values);
  }

  galaxyClassSpiral(){
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

  galaxyLocation(){
    // Go to sub functions
    switch(this.galaxyType){
      case 'irregular':
      case 'elliptical':
        this.galaxyLocationIrregularElliptical();
        break;
      case 'lenticular':
      case 'spiral':
        this.galaxyLocationLenticularSpiral();
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  galaxyLocationIrregularElliptical(){
    var ranges = [[1,3], [4,10]];
    var values = ['bulge', 'halo'];
    this.galaxyLocation = returnFromRange(dice.d10(), ranges, values);

    // Apply modifiers
    switch(this.galaxyLocation){
      case 'bulge':
        this.modifiers.age_modifier += 3;
        break;
      case 'halo':
        this.modifiers.age_modifier += 2;
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  galaxyLocationLenticularSpiral(){
    var ranges = [[1,18], [19,86], [87,100]];
    var values = ['bulge', 'disk', 'halo'];
    this.galaxyLocation = returnFromRange(dice.d100(), ranges, values);

    // Apply modifiers
    switch(this.galaxyLocation){
      case 'bulge':
        switch(this.galaxyClass){
          case 'Sa':
          case 'SBa':
            this.modifiers.age_modifier += 3;
            break;
          case 'Sb':
          case 'SBb':
            if(dice.d4() <= 2) this.modifiers.age_modifier += 3;
            break;
          case 'Sc':
          case 'SBc':
            this.modifiers.age_modifier--;
            break;
          default:
            // TODO: Add default
            break;
        }
        break;
      case 'disk':
        this.modifiers.age_modifier -= 2;
        break;
      case 'halo':
        this.modifiers.age_modifier += 3;
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  clusterLocation(){
    switch(this.galaxyType){
      case 'irregular':
        this.clusterLocationIrregular();
        break;
      case 'elliptical':
        this.clusterLocationElliptical();
        break;
      case 'spiral':
        this.clusterLocationSpiral();
        break;
      case 'lenticular':
        this.clusterLocationLenticular();
        break;
      case 'none':
        this.clusterLocationNone();
        break;
      default:
        // TODO: Add default
        break;
    }

    // Apply Modifiers
    switch(this.galaxyCluster){
      case 'open':
        this.modifiers.age_modifier -= 2;
        break;
      case 'globular':
        this.modifiers.age_modifier += 2;
        break;
      default:
        // TODO: Add default
        break;
    }
  }

  clusterLocationIrregular(){
    var ranges = [[1,30], [31,50], [51,100]];
    var values = ['open', 'globular', 'no'];
    this.galaxyCluster = returnFromRange(dice.d100(), ranges, values);
  }

  clusterLocationElliptical(){
    var ranges = [[1,4], [5,10]];
    var values = ['globular', 'no'];
    this.galaxyCluster = returnFromRange(dice.d10(), ranges, values);
  }

  clusterLocationSpiral(){
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

  clusterLocationLenticular(){
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

  clusterLocationNone(){
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