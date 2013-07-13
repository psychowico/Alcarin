'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Game.Views.Map', function(exports, Alcarin) {
  var pixelRadius;

  pixelRadius = 0;
  exports.Chars = ngcontroller([
    'GameServer', 'CurrentCharacter', 'CharEnvironment', function(GameServer, CurrentCharacter, CharEnvironment) {
      var _this = this;

      this.charslist = {};
      GameServer.on('chars.swap', function(chars) {
        return _this.BackgroundReady.then(function(units) {
          var _char, _i, _len, _results;

          _this.charslist = {};
          _results = [];
          for (_i = 0, _len = chars.length; _i < _len; _i++) {
            _char = chars[_i];
            _char.pixelLoc = units.toPixels(_char.loc.x, _char.loc.y);
            _char.type = 'char';
            _results.push(CharEnvironment.character(_char).then(function(obj) {
              return _this.charslist[obj._id] = obj;
            }));
          }
          return _results;
        });
      });
      return GameServer.on('game-event.add', function(gameEvent) {
        var applyCurrentChar, charid, currentid, loc, _char;

        if (gameEvent.system && gameEvent.id === 'char.update') {
          currentid = _this.charid;
          charid = gameEvent.args[0];
          loc = gameEvent.args[1];
          applyCurrentChar = currentid === charid;
          if (applyCurrentChar) {
            return CurrentCharacter.then(function(current) {
              current.loc = loc;
              return _this.redrawMap();
            });
          } else {
            _char = _this.charslist[charid];
            _char.loc = loc;
            return _this.BackgroundReady.then(function(units) {
              return _char.pixelLoc = units.toPixels(_char.loc.x, _char.loc.y);
            });
          }
        }
      });
    }
  ]);
  return exports.Characters = (function(_super) {
    __extends(Characters, _super);

    Characters.prototype.charsbyId = {};

    function Characters(element, Services) {
      var GameServer;

      this.Services = Services;
      this.onCharactersSwap = __bind(this.onCharactersSwap, this);
      this.onGameEvent = __bind(this.onGameEvent, this);
      this.table = $('<div>', {
        "class": 'characters',
        position: 'relative'
      });
      $(element).append(this.table);
      GameServer = this.Services.get('GameServer');
      this.CoordConverter = this.Services.get('CoordConverter');
      this.CurrentCharacter = this.Services.get('CurrentCharacter');
      GameServer.on('chars.swap', this.onCharactersSwap);
    }

    Characters.prototype.onGameEvent = function(gameEvent) {
      var charid,
        _this = this;

      if (gameEvent.system && gameEvent.id === 'char.update') {
        charid = gameEvent.args[0];
        return this.CurrentCharacter.then(function(current) {
          var element, loc;

          loc = gameEvent.args[1];
          if (current._id === charid) {
            current.loc = loc;
            return _this.Services.get('MapReset')();
          } else {
            element = _this.charsbyId[charid];
            return _this.CoordConverter.done(function(Coords) {
              var pLoc;

              pLoc = Coords.toPixels(loc.x, loc.y);
              return element.position({
                left: pLoc.x,
                top: pLoc.y
              });
            });
          }
        });
      }
    };

    Characters.prototype.clearChars = function() {
      var element, id, _ref;

      console.log('removing..');
      _ref = this.charsbyId;
      for (id in _ref) {
        element = _ref[id];
        element.remove();
      }
      return this.charsbyId = {};
    };

    Characters.prototype.createCharacterElement = function(pLoc, character) {
      var element;

      element = $('<div>', {
        "class": 'character'
      });
      element.position({
        left: pLoc.x,
        top: pLoc.y
      });
      element.append($('<div>'));
      element.children().attr('title', "" + character.name);
      element.data('rel', [character]);
      this.table.append(element);
      this.charsbyId[character._id] = element;
      return element;
    };

    Characters.prototype.onCharactersSwap = function(chars) {
      var _this = this;

      return this.CurrentCharacter.then(function(currChar) {
        var $element, character, loc, pLoc, _i, _len, _results;

        _results = [];
        for (_i = 0, _len = chars.length; _i < _len; _i++) {
          character = chars[_i];
          loc = character.loc;
          pLoc = Coords.toPixels(loc.x, loc.y);
          $element = _this.createCharacterElement(pLoc, character);
          if (currChar._id === character._id) {
            _results.push($element.addClass('current'));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    };

    return Characters;

  })(Alcarin.EventsEmitter);
});

/*
//@ sourceMappingURL=characters.js.map
*/
