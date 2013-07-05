'use strict';namespace('Alcarin.GameObject', function(exports, Alcarin) {
  var cache, condition;

  exports.Character = (function() {
    Character.count = 0;

    function Character(_id) {
      Alcarin.GameObject.Character.count++;
    }

    return Character;

  })();
  cache = {};
  condition = function(obj) {
    return obj.type === 'char';
  };
  return Alcarin.GameObject.Factory.register(condition, function(obj) {
    var character;

    if (cache[obj.id] != null) {
      return cache[obj.id];
    }
    cache[obj.id] = character = new Alcarin.GameObject.Character(obj.id);
    return character;
  });
});

/*
//@ sourceMappingURL=character.js.map
*/
