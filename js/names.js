// TODO: Add comments
class Names {
  constructor() {}

  static getStarName(){
    this.starNames = $.ajax({
      type: 'GET',
      url: "http://localhost/voyager/data/starNames.txt",
      async: false
    }).responseText;
    this.starNames = this.starNames.split('\n');
    return this.starNames[Math.floor(Math.random() * this.starNames.length)];
  }
}