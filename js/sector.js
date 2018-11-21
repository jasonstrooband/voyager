// TODO: Add comments
// TODO: Add in roque systems, that only have a single planetary system
// TODO: Make density a factor of the galaxy location and the cluster type
class Sector {
  constructor(density) {
    debug("%cGenerate Sector", debug_head_css);

    this.density = density < 5 ? 5 : density;
    this.density = density > 95 ? 95 : density;
    // Randomise density with up to an extra 20%
    this.density += Math.random() * (this.density * 0.2);
    this.systems = [];

    debug("Sector Density Defferential: " + (density / 10));
    debug("Sector Density: " + Math.round(this.density) + "%");

    // Halve density for a more believable amount
    this.density /= 2;

    this.generate();
    this.render();
  }

  generate(){
    this.resetSector();
    this.createSector();

    this.debug();
  }

  resetSector(){
    this.sectorlist_html = [];

    this.starCount = 0;
  }

  createSector(){
    var x; // Loop var
    var starRand;

    for(x = 0; x < hexMap.Hexes.length; x++){
      starRand = Math.floor(Math.random() * 100);

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
    var x; // Loop var
    for(x = 0; x < this.systems.length; x++){
      if(this.systems[x].hexId == hexId){
        return x;
      }
    }
    return false;
  }

  debug(){
    // TODO: Add debug information
  }

  render(){
    var x; // Loop var
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

    for(x = 0; x < this.systems.length; x++){
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