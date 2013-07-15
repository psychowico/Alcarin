'use strict';
/*
We need ensure that in all palce in code when we working with this same
Character/other GameObject we use this same object class instance. So when we
change character name it will automatically updated in all places in code.

This factory retreving all GameObject's available for player - so, visible characters,
things on ground etc.
It shouldn't storing things not related with player char surroundings.
*/

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Game.Services', function(exports, Alcarin) {
  var GameObjectFactory, module;

  GameObjectFactory = (function() {
    function GameObjectFactory(GameServer, $q) {
      var CharacterFactory;

      this.GameServer = GameServer;
      this.character = __bind(this.character, this);
      CharacterFactory = Alcarin.Game.Services.GameObject.CharacterFactory;
      this.factories = {
        chars: new CharacterFactory(this.GameServer, $q)
      };
    }

    GameObjectFactory.prototype.character = function(charObjOrId) {
      return this.factories.chars.factory(charObjOrId);
    };

    return GameObjectFactory;

  })();
  module = Alcarin.Game.Services.module;
  return module.factory('CharEnvironment', [
    'GameServer', '$q', function(GameServer, $q) {
      return new GameObjectFactory(GameServer, $q);
    }
  ]);
});

/*
//@ sourceMappingURL=char-environment.js.map
*/
