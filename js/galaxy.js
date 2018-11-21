class Galaxy {

  constructor() {
    this.types = [
      {data: "irregular", weight: 12},
      {data: "elliptical", weight: 16},
      {data: "lenticular", weight: 11},
      {data: "spiral", weight: 55},
      {data: "none", weight: 6}
    ];

    this.class = {
      irregular: [
        { data: "irr-1", weight: 2 },
        { data: "irr-2", weight: 2 }
      ],
      lenticular: [
        { data: "S", weight: 2 },
        { data: "SB", weight: 2 }
      ],
      // No elliptical, very simple classification
      spiral: [
        { data: "S", weight: 2 },
        { data: "SB", weight: 2 }
      ],
      spiral_design: [
        { data: "S", weight: 2 },
        { data: "SB", weight: 2 }
      ]
    };

    this.location = {
      irregular_elliptical: [
        { data: "bulge", weight: 3 },
        { data: "halo", weight: 7 }
      ],
      lenticular_spiral: [
        { data: "bulge", weight: 18 },
        { data: "disk", weight: 68 },
        { data: "halo", weight: 14 }
      ]
    };

    this.cluster = {
      irregular: [
        { data: "open", weight: 30 },
        { data: "globular", weight: 20 },
        { data: "none", weight: 50 }
      ],
      elliptical: [
        { data: "globular", weight: 4 },
        { data: "none", weight: 6 }
      ],
      spiral: {
        bulge: {
          Sa_SBa: [
            { data: "globular", weight: 40 },
            { data: "open", weight: 10 },
            { data: "none", weight: 50 }
          ],
          Sb_SBb: [
            { data: "globular", weight: 25 },
            { data: "open", weight: 25 },
            { data: "none", weight: 50 }
          ],
          Sc_SBc: [
            { data: "globular", weight: 10 },
            { data: "open", weight: 40 },
            { data: "none", weight: 50 }
          ]
        },
        disk: [
          { data: "globular", weight: 9 },
          { data: "open", weight: 35 },
          { data: "none", weight: 56 }
        ],
        halo: [
          { data: "globular", weight: 4 },
          { data: "none", weight: 6 }
        ]
      },
      lenticular: {
        bulge: [
          { data: "globular", weight: 25 },
          { data: "open", weight: 25 },
          { data: "none", weight: 50 }
        ],
        halo: [
          { data: "globular", weight: 4 },
          { data: "none", weight: 6 }
        ]
      },
      none: [
        { data: "globular", weight: 3 },
        { data: "open", weight: 3 },
        { data: "none", weight: 4 }
      ]
    };

    this.generate();
    this.render();
  }

  generate(){
    debug("%cGenerate Galaxy", debug_head_css);
    
    this.resetGalaxy();
    this.genGalaxyType();
    this.genGalaxyLocation();
    this.genClusterLocation();

    this.debug();
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
    // Get value from range
    this.galaxyType = weightedRandom(this.types);
    debug("Get Galaxy Type ... " + this.galaxyType.capitalize());

    // Classify galaxy and apply any modifiers
    switch(this.galaxyType){
      case 'irregular':
        this.modifiers.age_modifier--;
        debug("Set Age Modifier -1 ... " + this.modifiers.age_modifier);
        this.galaxyClass = weightedRandom(this.class.irregular);
        break;
      case 'elliptical':
        this.modifiers.age_modifier += 5;
        debug("Set Age Modifier +5 ... " + this.modifiers.age_modifier);
        this.galaxyClass = 'E' + dice.roll("1d7");
        break;
      case 'lenticular':
        this.galaxyClass = weightedRandom(this.class.lenticular);
        break;
      case 'spiral':
        this.galaxyClass = weightedRandom(this.class.spiral);
        this.galaxyClass += 'abc'.substr(Math.floor(Math.random() * 3), 1);
        this.galaxyArms = weightedRandom(this.class.spiral_design);
        if(this.galaxyArms == 'Multi-Armed') this.galaxyArms += ` with ${2 * Math.round(dice.roll('1d6+2') / 2)} arms`;
        break;
      default:
        console.error("Galaxy Type none not supported");
        break;
    }

    if(this.galaxyClass) debug("Get Galaxy Class ... " + this.galaxyClass.capitalize());
    if(this.galaxyArms) debug("Get Galaxy Arms ... " + this.galaxyArms.capitalize());
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
        console.error("Unknown Galaxy Type: " + this.galaxyType);
        break;
    }
  }

  genGalaxyLocationIrregularElliptical(){
    this.galaxyLocation = weightedRandom(this.location.irregular_elliptical);
    debug("Get Sector Location ... " + this.galaxyLocation.capitalize());

    // Apply modifiers
    switch(this.galaxyLocation){
      case 'bulge':
        this.modifiers.age_modifier += 3;
        debug("Set Age Modifier +3 ... " + this.modifiers.age_modifier);
        break;
      case 'halo':
        this.modifiers.age_modifier += 2;
        debug("Set Age Modifier +2 ... " + this.modifiers.age_modifier);
        break;
      default:
        console.error("Galactic Location not allowed: " + this.galaxyLocation);
        break;
    }
  }

  genGalaxyLocationLenticularSpiral(){
    this.galaxyLocation = weightedRandom(this.location.lenticular_spiral);
    debug("Get Sector Location ... " + this.galaxyLocation.capitalize());

    // Apply modifiers
    switch(this.galaxyLocation){
      case 'bulge':
        switch(this.galaxyClass){
          case 'Sa':
          case 'SBa':
            this.modifiers.age_modifier += 3;
            debug("Set Age Modifier +3 ... " + this.modifiers.age_modifier);
            break;
          case 'Sb':
          case 'SBb':
            if(dice.d4() <= 2){
              this.modifiers.age_modifier += 3;
              debug("Set Age Modifier +3 ... " + this.modifiers.age_modifier);
            }
            break;
          case 'Sc':
          case 'SBc':
            this.modifiers.age_modifier--;
            debug("Set Age Modifier -1 ... " + this.modifiers.age_modifier);
            break;
          default:
            console.error("Unknown Galaxy Class: " + this.galaxyClass);
            break;
        }
        break;
      case 'disk':
        this.modifiers.age_modifier -= 2;
        debug("Set Age Modifier -2 ... " + this.modifiers.age_modifier);
        break;
      case 'halo':
        this.modifiers.age_modifier += 3;
        debug("Set Age Modifier +3 ... " + this.modifiers.age_modifier);
        break;
      default:
        console.error("Galactic Location not allowed: " + this.galaxyLocation);
        break;
    }
  }

  genClusterLocation(){
    switch(this.galaxyType){
      case 'irregular':
        this.galaxyCluster = weightedRandom(this.cluster.irregular);
        break;
      case 'elliptical':
        this.galaxyCluster = weightedRandom(this.cluster.elliptical);
        break;
      case 'spiral':
        this.genClusterLocationSpiral();
        break;
      case 'lenticular':
        this.genClusterLocationLenticular();
        break;
      case 'none':
        this.galaxyCluster = weightedRandom(this.cluster.none);
        break;
      default:
        console.error("Unknown Galaxy Type: " + this.galaxyType);
        break;
    }

    debug("Set System Cluster ... " + this.galaxyCluster.capitalize() + " Cluster");

    // Apply Modifiers
    switch(this.galaxyCluster){
      case 'open':
        this.modifiers.age_modifier -= 2;
        debug("Set Age Modifier -2 ... " + this.modifiers.age_modifier);
        break;
      case 'globular':
        this.modifiers.age_modifier += 2;
        debug("Set Age Modifier +2 ... " + this.modifiers.age_modifier);
        break;
      case 'none':
        // Do nothing
        break;
      default:
        console.error("Unknown Cluster Type: " + this.galaxyCluster);
        break;
    }
  }

  genClusterLocationSpiral(){
    // Where is the system in the galaxy
    switch(this.galaxyLocation){
      case 'bulge':
        switch(this.galaxyClass){
          case 'Sa':
          case 'SBa':
            this.galaxyCluster = weightedRandom(this.cluster.spiral.bulge.Sa_SBa);
            break;
          case 'Sb':
          case 'SBb':
            this.galaxyCluster = weightedRandom(this.cluster.spiral.bulge.Sb_SBb);
            break;
          case 'Sc':
          case 'SBc':
            this.galaxyCluster = weightedRandom(this.cluster.spiral.bulge.Sc_SBc);
            break;
          default:
            console.error("Unknown Spiral Class: " + this.galaxyClass);
            break;
        }
        break;
      case 'disk':
        this.galaxyCluster = weightedRandom(this.cluster.spiral.disk);
        break;
      case 'halo':
        this.galaxyCluster = weightedRandom(this.cluster.spiral.halo);
        break;
      default:
        console.error("Unknown Galactic Location: " + this.galaxyLocation);
        break;
    }
  }

  genClusterLocationLenticular(){
    // Where is the system in the galaxy
    switch(this.galaxyLocation){
      case 'bulge':
        this.galaxyCluster = weightedRandom(this.cluster.lenticular.bulge);
        break;
      case 'halo':
        this.galaxyCluster = weightedRandom(this.cluster.lenticular.halo);
        break;
      default:
        console.error("Unknown Galactic Location: " + this.galaxyLocation);
        break;
    }
  }

  calculateDensity() {
    // TODO: Take into account none galaxy type
    // TODO: May need some tweaking to get right
    var densityDist = 0;
    var density;
    // 2: High - Bulge, Globular
    // 1: Med - Disk, Open
    // 0: Low - Halo, None
    if(this.galaxyLocation == 'bulge' || this.galaxyCluster == 'globular') densityDist += 5;
    if(this.galaxyLocation == 'disk' || this.galaxyCluster == 'open') densityDist += 3;
    if(this.galaxyLocation == 'halo' || this.galaxyCluster == 'none') densityDist += 1;
    density = densityDist * 10;
    return density;
  }

  debug(){
    var debugObj = {
      'Galaxy Type': this.galaxyType,
      'Galaxy Class': this.galaxyClass,
      'Galaxy Location': this.galaxyLocation,
      'Galaxy Cluster': this.galaxyCluster,
      'Modifiers': this.modifiers
    };
    debug("%cFinal Galaxy", debug_subhead_css);
    debug(debugObj);
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