$( document ).ready(function() {

  config();

  var board = {
    width: 8,
    height: 10
  };

  let galaxy = new Galaxy(true);

  $('#generate').click(function() {
    galaxy.generate();
    galaxy.render();
  });

  let hexMap = new HexMap(board, 'hexmap');

  let sector = new Sector(hexMap.Hexes);
});

function config(){
  // Open the config panel
  $('#config-trigger').click(function(e){
    e.preventDefault();
    $("#config-panel").toggleClass('config-panel-open');
  });
  // Close the config panel
  $('#config-close').on('click', function() {
    $('#config-trigger').trigger('click');
  });

  if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    $('#storage_warn').html('Settings are saved when changed.');
  } else {
    // No Web Storage support..
    $('#storage_warn').html('Sorry! Settings are not being saved, no storage available.');
  }
}