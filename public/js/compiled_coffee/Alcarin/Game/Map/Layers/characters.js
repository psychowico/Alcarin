var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Game.Map.Layers', function(exports, Alcarin) {
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
      GameServer.on('chars.swap', this.onCharactersSwap);
      GameServer.on('game-event.add', this.onGameEvent);
    }

    Characters.prototype.onGameEvent = function(gameEvent) {
      var charid, element, loc,
        _this = this;

      if (gameEvent.system && gameEvent.id === 'char.update') {
        charid = gameEvent.args[0];
        loc = gameEvent.args[1];
        element = this.charsbyId[charid];
        return this.CoordConverter.done(function(Coords) {
          var pLoc;

          pLoc = Coords.toPixels(loc.x, loc.y);
          return element.position({
            left: pLoc.x,
            top: pLoc.y
          });
        });
      }
    };

    Characters.prototype.clearChars = function() {
      var element, id, _ref;

      _ref = this.charsbyId;
      for (id in _ref) {
        element = _ref[id];
        element.remove();
      }
      return this.charsbyId = {};
    };

    Characters.prototype.setTarget = function(charPromise) {
      this.charPromise = charPromise;
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

      return this.charPromise.done(function(currChar) {
        _this.clearChars();
        return _this.CoordConverter.done(function(Coords) {
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
      });
    };

    return Characters;

  })(Alcarin.EventsEmitter);
});

/*
//@ sourceMappingURL=characters.js.map
*/
