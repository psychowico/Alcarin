'use strict';
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Game.Services.GameObject', function(exports, Alcarin) {
  var Character;

  Character = (function(_super) {
    __extends(Character, _super);

    Character.count = 0;

    function Character(GameServer) {
      this.GameServer = GameServer;
      Character.count++;
    }

    Character.prototype.moveTo = function(target) {
      return this.GameServer.emit('move.char', target);
    };

    return Character;

  })(Alcarin.EventsEmitter);
  return exports.CharacterFactory = (function() {
    CharacterFactory.prototype.waitingPromises = {};

    CharacterFactory.prototype.cache = {};

    CharacterFactory.prototype._factoryObject = function(obj) {
      var id, instance, key, val;

      id = obj._id;
      if (id == null) {
        throw Error("Factory: Can not create Character withot '_id' id key.");
      }
      if (this.cache[id] != null) {
        instance = this.cache[id];
      } else {
        this.cache[id] = instance = new Character(this.GameServer);
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

    function CharacterFactory(GameServer, $q) {
      this.GameServer = GameServer;
      this.$q = $q;
      this.factory = __bind(this.factory, this);
      this.onServerResponse = __bind(this.onServerResponse, this);
      this.onCharsSwap = __bind(this.onCharsSwap, this);
      this.GameServer.on('char.fetch', this.onServerResponse);
      this.GameServer.on('chars.swap', this.onCharsSwap);
    }

    CharacterFactory.prototype.onCharsSwap = function(chars) {};

    CharacterFactory.prototype.onServerResponse = function(obj) {
      var character, deffered, key, result, val, _i, _id, _len, _ref, _results;

      if (typeof obj === 'string') {
        throw Error('Wrong server answer.');
      }
      _id = obj._id;
      result = this.factory(obj);
      if (this.cache[_id] != null) {
        character = this.cache[_id];
        for (key in obj) {
          val = obj[key];
          character[key] = val;
        }
        character.$emit('update');
      }
      if (this.waitingPromises[_id] != null) {
        _ref = this.waitingPromises[_id];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          deffered = _ref[_i];
          _results.push(deffered.resolve(result));
        }
        return _results;
      }
    };

    CharacterFactory.prototype.factory = function(objOrId) {
      var deffered, _id;

      if (typeof objOrId === 'string') {
        _id = objOrId;
        deffered = this.$q.defer();
        if (!this.waitingPromises[_id]) {
          this.waitingPromises[_id] = [];
        }
        this.waitingPromises[_id].push(deffered);
        this.GameServer.emit('fetch.char', _id);
        return deffered.promise;
      } else {
        return this.$q.when(this._factoryObject(objOrId));
      }
    };

    return CharacterFactory;

  })();
});

/*
//@ sourceMappingURL=character.js.map
*/
