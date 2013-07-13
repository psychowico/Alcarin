'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  var Units;

  exports.AreaMap = ngcontroller([
    'GameServer', 'CurrentCharacter', '$q', '$safeApply', function(GameServer, CurrentCharacter, $q, $safeApply) {
      var BackgroundReadyDefer, UnitsConverter,
        _this = this;

      UnitsConverter = new Units(this);
      BackgroundReadyDefer = $q.defer();
      this.BackgroundReady = BackgroundReadyDefer.promise;
      this.onTerrainReady = function() {
        return BackgroundReadyDefer.resolve(UnitsConverter);
      };
      this.redrawMap = function() {
        return $safeApply(_this, function() {
          _this.center = null;
          _this.radius = null;
          _this.terrain = null;
          BackgroundReadyDefer.reject();
          BackgroundReadyDefer = $q.defer();
          _this.BackgroundReady = BackgroundReadyDefer.promise;
          return GameServer.emit('swap.all');
        });
      };
      GameServer.on('terrain.swap', function(terrain, radius) {
        return CurrentCharacter.then(function(character) {
          _this.center = {
            x: character.loc.x,
            y: character.loc.y
          };
          _this.radius = radius;
          return _this.terrain = terrain;
        });
      });
      return this.pixelRadius = $('.area-map canvas.terrain').width() / 2;
    }
  ]);
  return Units = (function() {
    function Units(parent) {
      this.parent = parent;
      this.toUnits = __bind(this.toUnits, this);
      this.toPixels = __bind(this.toPixels, this);
    }

    Units.prototype.toPixels = function(x, y) {
      var center, offset, pixelRadius, radius;

      center = this.parent.center;
      radius = this.parent.radius;
      pixelRadius = this.parent.pixelRadius;
      offset = {
        x: center.x - radius,
        y: center.y - radius
      };
      return {
        x: Math.round(Math.round(x - offset.x) * pixelRadius / radius),
        y: Math.round(Math.round(y - offset.y) * pixelRadius / radius)
      };
    };

    Units.prototype.toUnits = function(pixelX, pixelY) {
      var center, offset, pixelRadius, radius;

      center = this.parent.center;
      radius = this.parent.radius;
      pixelRadius = this.parent.pixelRadius;
      offset = {
        x: center.x - radius,
        y: center.y - radius
      };
      return {
        x: offset.x + Math.round(x * radius / pixelRadius),
        y: offset.y + Math.round(y * radius / pixelRadius)
      };
    };

    return Units;

  })();
});

/*
//@ sourceMappingURL=area-map.js.map
*/
