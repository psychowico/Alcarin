'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Game.Services', function(exports, Alcarin) {
  var Units, ZOOM_FACTOR;

  Units = (function() {
    function Units(parent) {
      this.parent = parent;
      this.toUnits = __bind(this.toUnits, this);
      this.toPixels = __bind(this.toPixels, this);
    }

    Units.prototype.pixelCenter = function() {
      return this.toPixels(this.parent.center.x, this.parent.center.y);
    };

    Units.prototype.center = function() {
      return this.parent.center;
    };

    Units.prototype.pixelRadius = function() {
      return this.parent.pixelRadius;
    };

    Units.prototype.radius = function() {
      return this.parent.radius;
    };

    Units.prototype.toPixels = function(x, y) {
      var center, offset, pixelRadius, radius;

      center = this.center();
      radius = this.radius();
      pixelRadius = this.pixelRadius();
      offset = {
        x: Math.round(center.x) - radius,
        y: Math.round(center.y) - radius
      };
      return {
        x: Math.round(Math.round(x - offset.x) * pixelRadius / radius),
        y: Math.round(Math.round(y - offset.y) * pixelRadius / radius)
      };
    };

    Units.prototype.toUnits = function(pixelX, pixelY) {
      var center, offset, pixelRadius, radius;

      center = this.center();
      radius = this.radius();
      pixelRadius = this.pixelRadius();
      offset = {
        x: Math.round(center.x) - radius,
        y: Math.round(center.y) - radius
      };
      return {
        x: offset.x + Math.round(pixelX * radius / pixelRadius),
        y: offset.y + Math.round(pixelY * radius / pixelRadius)
      };
    };

    return Units;

  })();
  ZOOM_FACTOR = 5;
  return exports.module.factory('MapBackground', [
    '$q', 'GameServer', 'CurrentCharacter', function($q, GameServer, CurrentCharacter) {
      var Background;

      Background = (function(_super) {
        __extends(Background, _super);

        Background.prototype.dataReadyDeffered = null;

        function Background() {
          this.onDataReady = __bind(this.onDataReady, this);          this.reset();
        }

        Background.prototype.setPixelRadius = function(pixelRadius) {
          this.pixelRadius = pixelRadius;
        };

        Background.prototype.units = function() {
          return this._units;
        };

        Background.prototype.enableZoom = function(zoom) {
          var factor;

          this.zoom = zoom;
          factor = this.zoom ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
          this.radius *= factor;
          return this.$emit('zoom', this.zoom);
        };

        Background.prototype.onDataReady = function(args) {
          var character, charsArgs, info, terrain, terrainArgs;

          character = args[0], terrainArgs = args[1], charsArgs = args[2];
          terrain = terrainArgs[0], info = terrainArgs[1];
          this.center = character.loc;
          this.fields = terrain;
          this.radius = info.radius;
          if (this.zoom) {
            this.radius /= ZOOM_FACTOR;
          }
          this.charViewRadius = info.charViewRadius;
          this.lighting = info.lighting;
          this._units = new Units(this);
          return this.dataReadyDeffered.resolve(this);
        };

        Background.prototype.reset = function() {
          var loadingData, swapingChars, swapingTerrain;

          if (this.dataReadyDeffered != null) {
            this.dataReadyDeffered.reject();
          }
          this.center = this.radius = this.charViewRadius = this.lighting = void 0;
          swapingTerrain = GameServer.one('terrain.swap');
          swapingChars = GameServer.one('chars.swap');
          this.dataReadyDeffered = $q.defer();
          loadingData = $q.all([CurrentCharacter, swapingTerrain, swapingChars]);
          loadingData.then(this.onDataReady);
          return this.$emit('reset');
        };

        Background.prototype.dataReady = function() {
          return this.dataReadyDeffered.promise;
        };

        return Background;

      })(Alcarin.EventsEmitter);
      return new Background();
    }
  ]);
});

/*
//@ sourceMappingURL=map-background.js.map
*/
