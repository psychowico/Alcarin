'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Game.Services', function(exports, Alcarin) {
  var Units, ZOOM_FACTOR;
  Units = (function() {
    function Units(parent, round) {
      this.parent = parent;
      if (round == null) {
        round = true;
      }
      this.toUnits = __bind(this.toUnits, this);
      this.toPixels = __bind(this.toPixels, this);
      this.round = round ? Math.floor : function(x) {
        return x;
      };
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
      var center, offset, pixelRadius, radius, round;
      center = this.center();
      radius = this.radius();
      pixelRadius = this.pixelRadius();
      round = this.round;
      offset = {
        x: round(center.x) - radius,
        y: round(center.y) - radius
      };
      return {
        x: Math.floor(round(x - offset.x) * pixelRadius / radius),
        y: Math.floor(round(y - offset.y) * pixelRadius / radius)
      };
    };

    Units.prototype.toUnits = function(pixelX, pixelY) {
      var center, offset, pixelRadius, radius, round;
      center = this.center();
      radius = this.radius();
      pixelRadius = this.pixelRadius();
      round = this.round;
      offset = {
        x: round(center.x) - radius,
        y: round(center.y) - radius
      };
      return {
        x: offset.x + round(pixelX * radius / pixelRadius),
        y: offset.y + round(pixelY * radius / pixelRadius)
      };
    };

    return Units;

  })();
  ZOOM_FACTOR = 30;
  return exports.module.factory('MapBackground', [
    '$q', 'GameServer', 'CurrentCharacter', function($q, GameServer, CurrentCharacter) {
      var Background;
      Background = (function(_super) {
        __extends(Background, _super);

        Background.prototype.dataReadyDeffered = null;

        Background.prototype.zoom = false;

        function Background() {
          this.onDataReady = __bind(this.onDataReady, this);
          this.reset();
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
          if (this.info != null) {
            factor = this.zoom ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
            this.info.radius *= factor;
            this._units = new Units(this.info, !this.zoom);
          }
          return this.$emit('zoom', this.zoom);
        };

        Background.prototype.onDataReady = function(_arg) {
          var character, charsArgs, info, plots, radius, terrain, terrainArgs;
          character = _arg[0], terrainArgs = _arg[1], charsArgs = _arg[2];
          terrain = terrainArgs[0], plots = terrainArgs[1], info = terrainArgs[2];
          radius = info.radius;
          if (this.zoom) {
            radius /= ZOOM_FACTOR;
          }
          this.info = {
            center: character.loc,
            fields: terrain,
            plots: this.preparePlots(plots),
            radius: radius,
            charViewRadius: info.charViewRadius,
            talkRadius: info.talkRadius,
            lighting: info.lighting,
            pixelRadius: this.pixelRadius
          };
          this._units = new Units(this.info, !this.zoom);
          return this.dataReadyDeffered.resolve(this);
        };

        Background.prototype.preparePlots = function(grouped_plots) {
          var dict_plots, getKey, id, identify, plot, plots, _i, _len;
          dict_plots = {};
          getKey = function(loc) {
            return Math.floor(loc.x) + ';' + Math.floor(loc.y);
          };
          for (id in grouped_plots) {
            plots = grouped_plots[id];
            for (_i = 0, _len = plots.length; _i < _len; _i++) {
              plot = plots[_i];
              identify = getKey(plot.loc);
              dict_plots[identify] = true;
            }
          }
          return {
            getKey: getKey,
            dict: dict_plots,
            data: grouped_plots
          };
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
