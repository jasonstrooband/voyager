class Sector {
  constructor(density = 20, debug = false) {
    this.debug_flag = debug;

    this.density = density < 5 ? 5 : density;
    this.density = density > 95 ? 95 : density;
    this.systems = [];

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
        this.systems.push(new System(hexMap.Hexes[x].id, Names.getStarName()));
      } else {
        hexMap.Hexes[x].hasStar = false;
      }
    }
  }

  getSystemByHexId(hexId){
    for(var x = 0; x < this.systems.length; x++){
      if(this.systems[x].hexId == hexId){
        return x;
      }
    }
    return false;
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
    this.sectorlist_html.push(`<tr><th>Star Name</th><th>Hex ID</th><th>Primary Classification</th><th>Star Count</th></tr>`);
    this.sectorlist_html.push("</thead>");
    this.sectorlist_html.push("<tbody>");

    for(var x = 0; x < this.systems.length; x++){
      this.sectorlist_html.push(`<tr><th>${this.systems[x].name}</th><td>${this.systems[x].hexId}</td><td>${this.systems[x].primary}</td><td>${this.systems[x].starCount}</td></tr>`);
    }

    this.sectorlist_html.push("</tbody>");
    this.sectorlist_html.push("</table>");

    $('#sector_details').html(this.sectorlist_html.join("\n"));
  }

  renderSystem(hexId){
    this.systems[this.getSystemByHexId(hexId)].render();
  }
}