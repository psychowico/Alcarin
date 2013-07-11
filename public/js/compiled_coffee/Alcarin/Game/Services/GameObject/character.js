'use strict';namespace('Alcarin.Game.Services.GameObject', function(exports, Alcarin) {
  var Character, Factory;

  Character = (function() {
    Character.count = 0;

    function Character(_id) {
      Character.count++;
    }

    return Character;

  })();
  Factory = (function() {
    function Factory() {}

    Factory.cache = {};

    Factory.waitingPromises = {};

    Factory.init = function(GameServer) {
      Factory.GameServer = GameServer;
      return Factory.GameServer.on('char.fetch', function(charData) {
        var character, deffered, key, val, _i, _len, _ref;

        Factory.cache[charData._id] = character = new Character(charData._id);
        for (key in charData) {
          val = charData[key];
          character[key] = val;
        }
        if (Factory.waitingPromises[charData._id] != null) {
          _ref = Factory.waitingPromises[charData._id];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            deffered = _ref[_i];
            deffered.resolve(character);
          }
          return Factory.waitingPromises[charData._id] = [];
        }
      });
    };

    Factory.condition = function(obj) {
      return obj.type === 'char';
    };

    Factory.factory = function(obj) {
      var deffered;

      if (Factory.cache[obj.id] != null) {
        return Factory.cache[obj.id];
      }
      deffered = Q.defer();
      if (!Factory.waitingPromises[obj.id]) {
        Factory.waitingPromises[obj.id] = [];
      }
      Factory.waitingPromises[obj.id].push(deffered);
      Factory.GameServer.emit('fetch.char', obj.id);
      return deffered.promise;
    };

    return Factory;

  }).call(this);
  return $(function() {
    return exports.Factory.register(Factory.init, Factory.condition, Factory.factory);
  });
});

/*
//@ sourceMappingURL=character.js.map
*/
