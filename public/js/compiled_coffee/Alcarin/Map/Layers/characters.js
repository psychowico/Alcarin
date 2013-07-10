var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Map.Layers', function(exports, Alcarin) {
  return exports.Characters = (function(_super) {
    __extends(Characters, _super);

    Characters.prototype.charsRepresentation = [];

    function Characters(element, Services) {
      this.Services = Services;
      this.onCharactersSwap = __bind(this.onCharactersSwap, this);
      this.table = $('<div>', {
        "class": 'characters',
        position: 'relative'
      });
      $(element).append(this.table);
      this.Services.get('GameServer').on('chars.swap', this.onCharactersSwap);
    }

    Characters.prototype.clearChars = function() {
      var element, _i, _len, _ref;

      _ref = this.charsRepresentation;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element.remove();
      }
      return this.charsRepresentation = [];
    };

    Characters.prototype.setTarget = function(charPromise) {
      this.charPromise = charPromise;
    };

    Characters.prototype.createCharacterElement = function(pLoc, character) {
      var $element, distance, element, loc, title, _i, _len, _ref;

      _ref = this.charsRepresentation;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        $element = _ref[_i];
        loc = $element.position();
        distance = Math.sqrt(Math.pow(loc.left - pLoc.x, 2) + Math.pow(loc.top - pLoc.y, 2));
        if (distance < 5) {
          title = $element.children().attr('title');
          $element.children().attr('title', "" + title + "\n" + character.name);
          $element.data('rel').push(character);
          return $element;
        }
      }
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
      this.charsRepresentation.push(element);
      return element;
    };

    Characters.prototype.onCharactersSwap = function(chars) {
      var _this = this;

      return this.charPromise.done(function(currChar) {
        _this.clearChars();
        return _this.Services.get('CoordConverter').done(function(Coords) {
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
