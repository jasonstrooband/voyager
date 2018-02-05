class Sector {
  constructor(hexes, debug = false) {
    this.debug_flag = debug;
    this.Hexes = hexes;

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
    for(var x = 0; x < this.Hexes.length; x++){
      var starRand = Math.floor(Math.random() * 100);

      if(starRand > 80){
        this.Hexes[x].hasStar = false;
      } else {
        this.starCount++;
        this.Hexes[x].hasStar = true;
        this.Hexes[x].star = {};
        this.create_star(x);
      }
    }
  }

  create_star(hex){
    this.Hexes[hex].star.name = Names.getStarName();
  }

  debug(){
  }

  render(){
    Names.getStarName();

    this.sectorlist_html.push("<table class='table table-condensed'>");
    this.sectorlist_html.push("<tbody>");
    this.sectorlist_html.push(`<tr><th>Star Count</th><td>${this.starCount} / ${this.Hexes.length} - ${Math.floor(this.starCount / this.Hexes.length * 100)}%</td></tr>`);
    this.sectorlist_html.push("</tbody>");
    this.sectorlist_html.push("</table>");


    this.sectorlist_html.push("<table class='table table-condensed'>");
    this.sectorlist_html.push("<thead>");
    this.sectorlist_html.push(`<tr><th>Star Name</th><th>Hex ID</th></tr>`);
    this.sectorlist_html.push("</thead>");
    this.sectorlist_html.push("<tbody>");

    for(var x = 0; x < this.Hexes.length; x++){
      if(this.Hexes[x].hasStar){
        this.sectorlist_html.push(`<tr><th>${this.Hexes[x].star.name}</th><td>${this.Hexes[x].id}</td></tr>`);
      }
    }

    this.sectorlist_html.push("</tbody>");
    this.sectorlist_html.push("</table>");

    $('#sector_details').html(this.sectorlist_html.join("\n"));
  }
}