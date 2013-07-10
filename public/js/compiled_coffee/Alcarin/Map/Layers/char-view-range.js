var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Map.Layers', function(exports, Alcarin) {
  return exports.CharViewRange = (function(_super) {
    __extends(CharViewRange, _super);

    function CharViewRange(element, Services) {
      var GameServer;

      this.Services = Services;
      this.onTerrainSwap = __bind(this.onTerrainSwap, this);
      this.table = $(element);
      GameServer = this.Services.get('GameServer');
      GameServer.on('terrain.swap', this.onTerrainSwap);
    }

    CharViewRange.prototype.setTarget = function(characterPromise) {
      this.characterPromise = characterPromise;
    };

    CharViewRange.prototype.onTerrainSwap = function(fields, radius, charViewRange) {
      var _this = this;

      return this.characterPromise.done(function(character) {
        return _this.Services.get('CoordConverter').done(function(Coords) {
          var $child, center, pos, shadowRadius;

          console.log(charViewRange);
          console.log(radius);
          shadowRadius = charViewRange * Coords.pixelRadius / Coords.radius;
          if (_this.shadow != null) {
            _this.shadow.remove();
          }
          _this.shadow = $('<div>', {
            "class": 'shadow'
          });
          $child = $('<div>');
          _this.shadow.append($child);
          center = character.loc;
          pos = Coords.toPixels(center.x, center.y);
          _this.shadow.position({
            left: pos.x,
            top: pos.y
          });
          $child.width(2 * shadowRadius);
          $child.height(2 * shadowRadius);
          $child.position({
            left: -shadowRadius,
            top: -shadowRadius
          });
          return _this.table.append(_this.shadow);
        });
      });
    };

    return CharViewRange;

  })(Alcarin.EventsEmitter);
});

/*
//@ sourceMappingURL=char-view-range.js.map
*/
