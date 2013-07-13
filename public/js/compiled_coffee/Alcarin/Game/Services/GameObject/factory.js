'use strict';
/*
We need getting all GameObject from this factory. This provides us that this same
GameObject will be related with this same GameObject instance.
To use it, first you need register GameObject factory type (one time, when adding new
GameObject) type to system.
Alcarin.GameObject.Factory.register can_resolve, resolving
Where "can_resolve" is method, that will be called with base object and return true/false
if you factory can resolve this object. Registered factory should take care about
caching they results.

Next, when we have base object, we call Alcarin.GameObject.Factory(arg) method for it.
From now, "arg" will have "resolve()" method that return GameObject promise (Q promise).
It is because we want lazy resolving game objects.

Alcarin.GameObject.Factory(char)
char.resolve().then (charGameObject)->
    console.log charGameObject.name
*/

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Game.Services.GameObject', function(exports, Alcarin) {
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
  return module.factory('GameObjectFactory', [
    'GameServer', '$q', function(GameServer, $q) {
      return new GameObjectFactory(GameServer, $q);
    }
  ]);
});

/*
//@ sourceMappingURL=factory.js.map
*/
