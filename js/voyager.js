// TODO: Create a debug function
// TODO: Convert debugs to new function
// TODO: Finish adding in debugs for each step
// TODO: Change the way to render data to templates instead of js

var galaxy;
var hexMap;
var sector;
var starData;

const debug_flag = true;
var debug_title_css = 'background: #222; color: #bada55; padding: 3px 10px';
var debug_head_css = 'color: #4f7ade; text-decoration: underline';
var debug_subhead_css = 'text-decoration: underline';

$(document).ready(function() {
  var genTimerStart;
  var genTimerEnd;
  var board = {
    width: 8,
    height: 10
  };

  config();
  // TODO: BD radius needs to be fixed -- what is wrong with it?
  starData = loadStarData();

  genTimerStart = performance.now();
  debug("%cBegin Generation", debug_title_css);

  galaxy = new Galaxy();
  hexMap = new HexMap(board, 'hexmap');
  sector = new Sector(galaxy.calculateDensity());
  hexMap.addSystems();

  debug("%cEnd Generation", debug_title_css);
  genTimerEnd = performance.now();
  debug("Generation took " + Math.roundPlaces(((genTimerEnd - genTimerStart) / 1000), 3) + "s");

  removeLoader();
});

function loadStarData(){
  var starData = $.ajax({
    type: 'GET',
    url: "http://localhost/voyager/data/starData.json",
    async: false
  }).responseText;
  return JSON.parse(starData);
}

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
  $('#loader').fadeOut('slow', 'linear', function(){});
}