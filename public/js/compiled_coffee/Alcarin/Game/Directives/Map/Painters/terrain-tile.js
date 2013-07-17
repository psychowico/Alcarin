'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Game.Directives.Map.Painters', function(exports, Alcarin) {
  var BBHEIGHT, BBWIDTH, GRAYSCALE, NOISE_DENSITY, NOISE_IMPACT, noise;

  NOISE_DENSITY = 10;
  NOISE_IMPACT = 0.1;
  noise = new ROT.Noise.Simplex();
  GRAYSCALE = [0.3, 0.59, 0.11];
  BBWIDTH = 40;
  BBHEIGHT = 40;
  return exports.TerrainTile = (function() {
    TerrainTile.prototype.background = {
      r: 0,
      g: 0,
      b: 255
    };

    function TerrainTile(canvas) {
      this.canvas = canvas;
      this.redraw = __bind(this.redraw, this);
      this.prepareCanvas();
    }

    TerrainTile.prototype.setCenter = function(center) {
      this.center = center;
    };

    TerrainTile.prototype.setFields = function(fields) {
      this.fields = fields;
    };

    TerrainTile.prototype.setLighting = function(lighting) {
      if (lighting != null) {
        if (lighting === 1) {
          return this.lighting = void 0;
        } else {
          return this.lighting = (lighting + 0.4) / 1.4;
        }
      }
    };

    TerrainTile.prototype.width = function() {
      var _ref;

      return (_ref = this.canvas[0]) != null ? _ref.width : void 0;
    };

    TerrainTile.prototype.height = function() {
      var _ref;

      return (_ref = this.canvas[0]) != null ? _ref.height : void 0;
    };

    TerrainTile.prototype.prepareCanvas = function() {
      this.context = this.canvas[0].getContext('2d');
      this.context.fillStyle = "black";
      this.context.fillRect(0, 0, this.width(), this.height());
      return $(this.context).enableSmoothing();
    };

    TerrainTile.prototype.applyGrayscale = function(color, lighting) {
      var gray;

      gray = GRAYSCALE[0] * color.r + GRAYSCALE[1] * color.g + GRAYSCALE[2] * color.b;
      gray *= 1 - lighting;
      return {
        r: (lighting * color.r) + gray,
        g: (lighting * color.g) + gray,
        b: (lighting * color.b) + gray
      };
    };

    TerrainTile.prototype.getBackbuffer = function() {
      var _ref;

      if ((_ref = this.backbuffer) != null) {
        _ref.remove();
      }
      this.backbuffer = $('<canvas>');
      $.extend(this.backbuffer[0], {
        width: BBWIDTH,
        height: BBHEIGHT
      });
      this.backbufferContext = this.backbuffer[0].getContext('2d');
      $(this.backbufferContext).enableSmoothing();
      this.backbufferContext.fillRect(0, 0, BBWIDTH, BBHEIGHT);
      return this.backbufferContext;
    };

    TerrainTile.prototype.swapBuffer = function() {
      this.context.save();
      this.context.drawImage(this.backbuffer[0], 0, 0, BBWIDTH, BBHEIGHT, -5, -2, this.width() + 2, this.height() + 2);
      return this.context.restore();
    };

    TerrainTile.prototype.redraw = function() {
      var backbufferContext, c, center, cmp, color, dataOffset, field, i, imageData, lighting, mod, offset, offsetX, offsetY, pixel, rCenterX, rCenterY, size, x, y, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref, _ref1, _ref2;

      size = Math.round(this.radius * 2);
      backbufferContext = this.getBackbuffer();
      imageData = backbufferContext.getImageData(0, 0, BBWIDTH, BBHEIGHT);
      offset = {
        x: this.center.x - this.radius,
        y: this.center.y - this.radius
      };
      lighting = this.lighting;
      c = {};
      center = this.center;
      rCenterX = Math.round(center.x);
      rCenterY = Math.round(center.y);
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (field.loc.x === rCenterX && field.loc.y === rCenterY) {
          color = field.land.color;
          break;
        }
      }
      c = color != null ? Alcarin.Color.intToRGB(color) : this.background;
      console.log("drawing minimap:");
      console.log(center);
      for (y = _j = 0; 0 <= BBHEIGHT ? _j <= BBHEIGHT : _j >= BBHEIGHT; y = 0 <= BBHEIGHT ? ++_j : --_j) {
        for (x = _k = 0; 0 <= BBWIDTH ? _k <= BBWIDTH : _k >= BBWIDTH; x = 0 <= BBWIDTH ? ++_k : --_k) {
          offsetX = (BBWIDTH * center.x / 2) + x;
          offsetY = (BBHEIGHT * center.y / 2) + y;
          mod = Math.abs(noise.get(offsetX / NOISE_DENSITY, offsetY / NOISE_DENSITY));
          pixel = {};
          _ref1 = ['r', 'g', 'b'];
          for (_l = 0, _len1 = _ref1.length; _l < _len1; _l++) {
            cmp = _ref1[_l];
            pixel[cmp] = c[cmp] * (1 - NOISE_IMPACT * (1 - mod));
          }
          if (lighting) {
            pixel = this.applyGrayscale(pixel, lighting);
          }
          dataOffset = 4 * (y * BBWIDTH + x);
          _ref2 = ['r', 'g', 'b'];
          for (i = _m = 0, _len2 = _ref2.length; _m < _len2; i = ++_m) {
            cmp = _ref2[i];
            imageData.data[dataOffset + i] = ~~pixel[cmp];
          }
        }
      }
      backbufferContext.putImageData(imageData, 0, 0);
      return this.swapBuffer();
    };

    return TerrainTile;

  })();
});

/*
//@ sourceMappingURL=terrain-tile.js.map
*/
