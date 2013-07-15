'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Game.Services.GameObject', function(exports, Alcarin) {
  var BaseFactory;

  exports.Character = (function() {
    Character.count = 0;

    function Character() {
      Character.count++;
    }

    return Character;

  })();
  BaseFactory = Alcarin.Game.Services.BaseFactory;
  return exports.CharacterFactory = (function(_super) {
    __extends(CharacterFactory, _super);

    CharacterFactory.prototype.waitingPromises = {};

    function CharacterFactory(GameServer, $q) {
      this.GameServer = GameServer;
      this.$q = $q;
      this.factory = __bind(this.factory, this);
      this.onServerResponse = __bind(this.onServerResponse, this);
      this.onCharsSwap = __bind(this.onCharsSwap, this);
      CharacterFactory.__super__.constructor.call(this, this.$q, exports.Character, '_id');
      this.GameServer.on('char.fetch', this.onServerResponse);
      this.GameServer.on('chars.swap', this.onCharsSwap);
    }

    CharacterFactory.prototype.onCharsSwap = function(chars) {};

    CharacterFactory.prototype.onServerResponse = function(obj) {
      var deffered, result, _i, _id, _len, _ref, _results;

      if (typeof obj === 'string') {
        throw Error('Wrong server answer.');
      }
      _id = obj[this.idKey];
      result = this.factory(obj);
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
        return CharacterFactory.__super__.factory.call(this, objOrId);
      }
    };

    return CharacterFactory;

  })(BaseFactory);
});

/*
//@ sourceMappingURL=character.js.map
*/
