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

  exports.BaseFactory = (function() {
    BaseFactory.prototype.cache = {};

    function BaseFactory($q, _class, idKey) {
      this.$q = $q;
      this._class = _class;
      this.idKey = idKey != null ? idKey : '_id';
    }

    BaseFactory.prototype._factoryObject = function(obj) {
      var id, instance, key, val;

      id = obj[this.idKey];
      if (id == null) {
        throw Error("Factory: Can not create object withot '" + this.idKey + "' id key.");
      }
      if (this.cache[id] != null) {
        instance = this.cache[id];
      } else {
        instance = new this._class();
      }
      for (key in obj) {
        val = obj[key];
        instance[key] = val;
      }
      if (instance.update) {
        instance.update(obj);
      }
      return instance;
    };

    BaseFactory.prototype.factory = function(obj) {
      return this.$q.when(this._factoryObject(obj));
    };

    return BaseFactory;

  })();
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
