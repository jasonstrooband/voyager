var galaxy;
var hexMap;
var sector;
var system;
$(document).ready(function() {

  config();

  var board = {
    width: 8,
    height: 10
  };

  galaxy = new Galaxy(true);
  hexMap = new HexMap(board, 'hexmap');
  system = new System(); // Must be before sector for static methods
  sector = new Sector();
  hexMap.addSystems();

  removeLoader();
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

function removeLoader(){
  $('#loader').fadeOut('slow', 'linear', function(){
    //this.remove();
  });
  //$('#loader').fadeTo( "slow" , 0.5, function() {
  //  this.remove();
  //});
  //loader.addClass('loaded');
  //loader.remove();
}