class Galaxy {
  constructor(debug = false) {
    this.debug_flag = debug;

    this.generate();
    this.render();
  }

  generate(){
    this.reset_galaxy();
    this.galaxy_type();
    this.galaxy_location();
    this.cluster_location();

    if(this.debug_flag) this.debug();
  }

  reset_galaxy(){
    this.modifiers = {
      age_modifier: 0
    };

    this.galaxyType = '';
    this.galaxyClass = '';
    this.galaxyArms = '';
    this.galaxyLocation = '';
    this.galaxyCluster = '';
  }

  galaxy_type(){
    // Set vars
    var ranges = [[1,12], [13,28], [29,39], [40,94], [95,100]];
    var values = ['irregular', 'elliptical', 'lenticular', 'spiral', 'none'];

    // Get value from range
    this.galaxyType = return_from_range(dice.d100(), ranges, values);

    // Go to sub functions and apply mods
    switch(this.galaxyType){
      case 'irregular':
        this.modifiers.age_modifier--;
        this.galaxy_class_irregular();
        break;
      case 'elliptical':
        this.modifiers.age_modifier += 5;
        this.galaxy_class_elliptical();
        break;
      case 'lenticular':
        this.galaxy_class_lenticular();
        break;
      case 'spiral':
        this.galaxy_class_spiral();
        break;
    }
  }

  galaxy_class_irregular(){
    // Set vars
    var ranges = [[1,2], [2,4]];
    var values = ['irr-1', 'irr-2'];

    // Get value from range
    this.galaxyClass = return_from_range(dice.d4(), ranges, values);
  }

  galaxy_class_elliptical(){
    this.galaxyClass = 'E' + dice.roll("1d7");
  }

  galaxy_class_lenticular(){
    // Set vars
    var ranges = [[1,2], [2,4]];
    var values = ['S', 'SB'];

    // Get value from range
    this.galaxyClass = return_from_range(dice.d4(), ranges, values);
  }

  galaxy_class_spiral(){
    // Set vars
    var ranges1 = [[1,2], [2,4]];
    var values1 = ['S', 'SB'];
    var ranges2 = [[1,2], [3,5], [6,10]];
    var values2 = ['Grand Design', 'Flocculent', 'Multi-Armed'];

    // Get value from range
    this.galaxyClass = return_from_range(dice.d4(), ranges1, values1);
    this.galaxyClass += 'abc'.substr(Math.floor(Math.random() * 3), 1);
    var design = return_from_range(dice.d10(), ranges2, values2);
    if(design == 'Multi-Armed') design += ` with ${2 * Math.round(dice.roll('1d6+2') / 2)} arms`;
    this.galaxyArms = design;
  }

  galaxy_location(){
    // Go to sub functions
    switch(this.galaxyType){
      case 'irregular':
      case 'elliptical':
        this.galaxy_location_irregular_elliptical();
        break;
      case 'lenticular':
      case 'spiral':
        this.galaxy_location_lenticular_spiral();
        break;
    }
  }

  galaxy_location_irregular_elliptical(){
    var ranges = [[1,3], [4,10]];
    var values = ['bulge', 'halo'];
    this.galaxyLocation = return_from_range(dice.d10(), ranges, values);

    // Apply modifiers
    switch(this.galaxyLocation){
      case 'bulge':
        this.modifiers.age_modifier += 3;
        break;
      case 'halo':
        this.modifiers.age_modifier += 2;
        break;
    }
  }

  galaxy_location_lenticular_spiral(){
    var ranges = [[1,18], [19,86], [87,100]];
    var values = ['bulge', 'disk', 'halo'];
    this.galaxyLocation = return_from_range(dice.d100(), ranges, values);

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
        }
        break;
      case 'disk':
        this.modifiers.age_modifier -= 2;
        break;
      case 'halo':
        this.modifiers.age_modifier += 3;
        break;
    }
  }

  cluster_location(){
    switch(this.galaxyType){
      case 'irregular':
        this.cluster_location_irregular();
        break;
      case 'elliptical':
        this.cluster_location_elliptical();
        break;
      case 'spiral':
        this.cluster_location_spiral();
        break;
      case 'lenticular':
        this.cluster_location_lenticular();
        break;
      case 'none':
        this.cluster_location_none();
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
    }
  }

  cluster_location_irregular(){
    var ranges = [[1,30], [31,50], [51,100]];
    var values = ['open', 'globular', 'no'];
    this.galaxyCluster = return_from_range(dice.d100(), ranges, values);
  }

  cluster_location_elliptical(){
    var ranges = [[1,4], [5,10]];
    var values = ['globular', 'no'];
    this.galaxyCluster = return_from_range(dice.d10(), ranges, values);
  }

  cluster_location_spiral(){
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
        }
        values = ['globular', 'open', 'no'];
        this.galaxyCluster = return_from_range(dice.d100(), ranges, values);
        break;
      case 'disk':
        ranges = [[1,9], [10,44], [45,100]];
        values = ['globular', 'open', 'no'];
        this.galaxyCluster = return_from_range(dice.d100(), ranges, values);
        break;
      case 'halo':
        ranges = [[1,4], [5,10]];
        values = ['globular', 'no'];
        this.galaxyCluster = return_from_range(dice.d10(), ranges, values);
        break;
    }
  }

  cluster_location_lenticular(){
    // Set vars
    var ranges;
    var values;

    // Where is the system in the galaxy
    switch(this.galaxyLocation){
      case 'bulge':
        ranges = [[1,25], [26,50], [51,100]];
        values = ['globular', 'open', 'no'];

        // Get value from range
        this.galaxyCluster = return_from_range(dice.d100(), ranges, values);
        break;
      case 'halo':
        ranges = [[1,4], [5,10]];
        values = ['globular', 'no'];

        // Get value from range
        this.galaxyCluster = return_from_range(dice.d10(), ranges, values);
        break;
    }
  }

  cluster_location_none(){
    // Set vars
    var ranges = [[1,3], [4,6], [7,10]];
    var values = ['globular', 'open', 'no'];

    // Get value from range
    this.galaxyCluster = return_from_range(dice.d10(), ranges, values);
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
    var galaxy_html = [];
    galaxy_html.push("<table class='table table-condensed'>");
    galaxy_html.push("<tbody>");

    galaxy_html.push(`<tr><th>Galaxy Type</th><td>${this.galaxyType.capitalize()} Galaxy</td></tr>`);
    if(this.galaxyClass && this.galaxyType == 'spiral') galaxy_html.push(`<tr><th>Galaxy Classification</th><td>${this.galaxyClass.capitalize()} - ${this.galaxyArms}</td></tr>`);
    if(this.galaxyClass && this.galaxyType != 'spiral') galaxy_html.push(`<tr><th>Galaxy Classification</th><td>${this.galaxyClass.capitalize()}</td></tr>`);
    if(this.galaxyLocation) galaxy_html.push(`<tr><th>Galaxy Location</th><td>Galactic ${this.galaxyLocation.capitalize()}</td></tr>`);
    if(this.galaxyCluster) galaxy_html.push(`<tr><th>Galaxy CLuster</th><td>${this.galaxyCluster.capitalize()} Cluster</td></tr>`);

    galaxy_html.push("</tbody>");
    galaxy_html.push("</table>");

    var anyMods = arrayNot(this.modifiers, 0);
    if(anyMods){
      galaxy_html.push('<h3>Modifiers:</h3>');
      galaxy_html.push('<ul class="list-group">');
      galaxy_html.push(`<li class="list-group-item bg-dark">Age Modifier <span class="badge badge-primary float-right">${this.modifiers.age_modifier}</span></li>`);
      galaxy_html.push('</ul');
    }

    $('#galaxy_details').html(galaxy_html.join("\n"));
  }
}