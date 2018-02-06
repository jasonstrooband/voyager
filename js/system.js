class System {
  constructor(debug = false) {
    this.debug_flag = debug;
  }

  getPrimary(){
    this.primary = new Body('star');
    return this.primary;
  }
}