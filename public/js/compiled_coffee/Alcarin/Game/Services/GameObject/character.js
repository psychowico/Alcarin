'use strict';namespace('Alcarin.Game.Services.GameObject', function(exports, Alcarin) {
  var Character, cache, condition, factory;

  Character = (function() {
    Character.count = 0;

    function Character(_id) {
      Character.count++;
    }

    return Character;

  })();
  cache = {};
  condition = function(obj) {
    return obj.type === 'char';
  };
  factory = function(GameServer, obj) {
    var character;

    if (cache[obj.id] != null) {
      return cache[obj.id];
    }
    cache[obj.id] = character = new Character(obj.id);
    return character;
  };
  return exports.Factory.register(condition, factory);
});

/*
//@ sourceMappingURL=character.js.map
*/
