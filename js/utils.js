
function makeDie(sides) {
  var die = function() {
    return Math.floor(1 + Math.random() * sides) || 0;
  };

  die.times = function(count) {
    var rolls = [];
    var i; // Loop var
    for (i = 0; i < count; i++) {
      rolls.push(this());
    }
    return rolls;
  };

  return die;
}

var dice = {
  d4: makeDie(4),
  d6: makeDie(6),
  d8: makeDie(8),
  d10: makeDie(10),
  d12: makeDie(12),
  d20: makeDie(20),
  d100: makeDie(100),
  roll: function(expression) {
    var self = this,
      rolls = [];

    expression.toLowerCase().replace(/(\d+)(d\d+)?/g, function(_, count, die) {
      if (die) {
        if(self[die]) {
          rolls = rolls.concat(self[die].times(+count));
        } else {
          rolls = rolls.concat(makeDie(die.substring(1)).times(+count));
        }

      } else {
        rolls.push(+count);
      }
    });

    return rolls.reduce(function(sum, roll) {
      return sum + roll;
    });
  }
};

function weightedRandom(weightedArray){
  var key = 0; // The array index
  var rand = Math.random();
  var distributedArray = normaliseWeights(weightedArray);

  while(rand > 0){
    rand -= distributedArray[key].distribution;
    key++
  }

  key--; // Last key was incremented before finding it decrement it to get the actual result
  return distributedArray[key].data;
}

function arrayNot(arr, val){
  var test = false;
  jQuery.each(arr, function(key, value) {
    if(value != val) {
      test = true;
      return 0;
    }

  });
  return test;
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgbToHex(R, G, B) { return '#' + toHex(R) + toHex(G) + toHex(B) }

function toHex(n) {
  n = parseInt(n,10);
  if (isNaN(n)) return "00";
  n = Math.max(0,Math.min(n,255));
  return "0123456789ABCDEF".charAt((n-n%16)/16)
    + "0123456789ABCDEF".charAt(n%16);
}

function normaliseWeights(weightedArray){
  // Normalise Weights
  var i;
  var weightTotal = 0;
  for (i = 0; i < weightedArray.length; i++) {
    weightTotal += weightedArray[i].weight;
  }
  for (i = 0; i < weightedArray.length; i++) {
    weightedArray[i].distribution = weightedArray[i].weight / weightTotal;
  }
  return weightedArray;
}

function debug(msg, style = ""){
  if(debug_flag) console.log(msg, style);
}

Math.roundPlaces = function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};

String.prototype.capitalize = function(lower) {
  return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};