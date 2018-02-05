class Sector {
  constructor(density = 20, debug = false) {
    this.debug_flag = debug;

    this.density = density < 5 ? 5 : density;
    this.density = density > 95 ? 95 : density;

    this.generate();
    this.render();
  }

  generate(){
    this.reset_sector();

    this.create_sector();

    if(this.debug_flag) this.debug();
  }

  reset_sector(){
    this.sectorlist_html = [];

    this.starCount = 0;
  }

  create_sector(){
    for(var x = 0; x < hexMap.Hexes.length; x++){
      var starRand = Math.floor(Math.random() * 100);

      if(starRand < this.density){
        this.starCount++;
        hexMap.Hexes[x].hasStar = true;
        hexMap.Hexes[x].system = {};
        this.create_star(x);
      } else {
        hexMap.Hexes[x].hasStar = false;
      }
    }
  }

  create_star(hex){
    hexMap.Hexes[hex].system.name = Names.getStarName();
  }

  debug(){
  }

  render(){
    Names.getStarName();

    this.sectorlist_html.push("<table class='table table-condensed'>");
    this.sectorlist_html.push("<tbody>");
    this.sectorlist_html.push(`<tr><th>Star Count</th><td>${this.starCount} / ${hexMap.Hexes.length} - ${Math.floor(this.starCount / hexMap.Hexes.length * 100)}%</td></tr>`);
    this.sectorlist_html.push("</tbody>");
    this.sectorlist_html.push("</table>");


    this.sectorlist_html.push("<table class='table table-condensed'>");
    this.sectorlist_html.push("<thead>");
    this.sectorlist_html.push(`<tr><th>Star Name</th><th>Hex ID</th></tr>`);
    this.sectorlist_html.push("</thead>");
    this.sectorlist_html.push("<tbody>");

    for(var x = 0; x < hexMap.Hexes.length; x++){
      if(hexMap.Hexes[x].hasStar){
        this.sectorlist_html.push(`<tr><th>${hexMap.Hexes[x].system.name}</th><td>${hexMap.Hexes[x].id}</td></tr>`);
      }
    }

    this.sectorlist_html.push("</tbody>");
    this.sectorlist_html.push("</table>");

    $('#sector_details').html(this.sectorlist_html.join("\n"));
  }
}