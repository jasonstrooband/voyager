function makeDie(sides) {
  var die = function() {
    return 1 + Math.random() * sides | 0;
  };

  die.times = function(count) {
    var rolls = [];
    for (var i = 0; i < count; i++) {
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

//console.log(dice.d6());
//console.log(dice.d8.times(3));
//console.log(dice.roll("2d6 + 2d10 + 2"));

function return_from_range(rand, ranges, values){
  if(!Array.isArray(ranges) || !Array.isArray(values)) console.log('is not array');
  if(ranges.length != values.length) console.log('wrong length');

  for(var x = 0; x < ranges.length; x++) {
    if(rand >= ranges[x][0] && rand <= ranges[x][1]) return values[x];
  }
  alert('Out of range!');
  return false;
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

String.prototype.capitalize = function(lower) {
  return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};