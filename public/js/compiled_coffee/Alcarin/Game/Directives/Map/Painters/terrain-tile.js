'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Game.Directives.Map.Painters', function(exports, Alcarin) {
  var BBHEIGHT, BBWIDTH, BLUR, NOISE_DENSITY, NOISE_IMPACT;

  NOISE_DENSITY = 10;
  NOISE_IMPACT = 0.1;
  BBWIDTH = 40;
  BBHEIGHT = 40;
  BLUR = 0.2;
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
      this.Terrain = exports.Terrain;
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
      var GRAYSCALE, gray;

      GRAYSCALE = this.Terrain.GRAYSCALE;
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

    TerrainTile.prototype.prepareColors = function() {
      var Terrain, bg, center, cmp, color, colors, diffX, diffY, field, i, mod, rCenterX, rCenterY, x, y, _i, _j, _k, _l, _len, _len1, _ref, _ref1;

      center = this.center;
      rCenterX = Math.floor(center.x);
      rCenterY = Math.floor(center.y);
      colors = [];
      bg = this.background;
      for (i = _i = 0; _i <= 8; i = ++_i) {
        colors.push(bg);
      }
      i = 0;
      _ref = this.fields;
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        field = _ref[_j];
        diffX = field.loc.x - rCenterX;
        diffY = field.loc.y - rCenterY;
        if (Math.abs(diffY) <= 1 && Math.abs(diffX) <= 1) {
          color = field.land.color;
          colors[(diffY + 1) * 3 + (diffX + 1)] = Alcarin.Color.intToRGB(color);
          i++;
          if (i > 8) {
            break;
          }
        }
      }
      Terrain = this.Terrain;
      for (i = _k = 0; _k <= 8; i = ++_k) {
        x = rCenterX - 1 + i % 3;
        y = rCenterY - 1 + Math.floor(i / 3);
        mod = Math.abs(Terrain.noise.get(x / Terrain.NOISE_DENSITY, y / Terrain.NOISE_DENSITY));
        _ref1 = ['r', 'g', 'b'];
        for (_l = 0, _len1 = _ref1.length; _l < _len1; _l++) {
          cmp = _ref1[_l];
          colors[i][cmp] *= 1 - Terrain.NOISE_IMPACT * (1 - mod);
        }
      }
      return colors;
    };

    TerrainTile.prototype.redraw = function() {
      var Terrain, backbufferContext, blur, c, center, cmp, colors, dataOffset, i, imageData, lighting, mod, offset, offsetX, offsetY, pixel, pixelUnitsH, pixelUnitsW, rCenterX, rCenterY, selectColor, size, x, y, _i, _j, _k, _l, _len, _len1, _ref, _ref1;

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
      colors = this.prepareColors();
      pixelUnitsW = 1 / (BBWIDTH / 2);
      pixelUnitsH = 1 / (BBHEIGHT / 2);
      rCenterX = Math.floor(center.x);
      rCenterY = Math.floor(center.y);
      blur = function(cX, cY, realX, realY) {
        var baseColor, i, index, newCX, newCY, realXDec, realYDec, second, usage, _index;

        index = function(x, y) {
          return (y + 1) * 3 + (x + 1);
        };
        _index = index(cX, cY);
        if (_index < 0 || _index > 8) {
          throw Error("Something wrong with drawing alghoritm.. Index: " + _index);
        }
        baseColor = colors[_index];
        realXDec = Math.abs(realX % 1);
        if (realXDec < BLUR) {
          newCX = realX < 0 ? Math.min(cX + 1, 1) : Math.max(cX - 1, -1);
          i = index(newCX, cY);
          second = colors[i];
          usage = 0.5 * (BLUR - realXDec) / BLUR;
          baseColor = Alcarin.Color.mix(baseColor, second, usage);
        } else if (realXDec > 1 - BLUR) {
          newCX = realX >= 0 ? Math.min(cX + 1, 1) : Math.max(cX - 1, -1);
          i = index(newCX, cY);
          second = colors[i];
          usage = -0.5 * (1 - BLUR - realXDec) / BLUR;
          baseColor = Alcarin.Color.mix(baseColor, second, usage);
        }
        realYDec = Math.abs(realY % 1);
        if (realYDec < BLUR) {
          newCY = realY < 0 ? Math.min(cY + 1, 1) : Math.max(cY - 1, -1);
          i = index(cX, newCY);
          second = colors[i];
          usage = 0.5 * (BLUR - realYDec) / BLUR;
          baseColor = Alcarin.Color.mix(baseColor, second, usage);
        } else if (realYDec > 1 - BLUR) {
          newCY = realY >= 0 ? Math.min(cY + 1, 1) : Math.max(cY - 1, -1);
          i = index(cX, newCY);
          second = colors[i];
          usage = -0.5 * (1 - BLUR - realYDec) / BLUR;
          baseColor = Alcarin.Color.mix(baseColor, second, usage);
        }
        return baseColor;
      };
      selectColor = function(x, y) {
        var cX, cY, realX, realY;

        x -= BBWIDTH / 2;
        y -= BBHEIGHT / 2;
        realX = center.x + x * pixelUnitsW;
        realY = center.y + y * pixelUnitsH;
        cX = Math.floor(realX - Math.floor(center.x));
        cY = Math.floor(realY - Math.floor(center.y));
        return blur(cX, cY, realX, realY);
      };
      Terrain = this.Terrain;
      for (y = _i = 0; 0 <= BBHEIGHT ? _i <= BBHEIGHT : _i >= BBHEIGHT; y = 0 <= BBHEIGHT ? ++_i : --_i) {
        for (x = _j = 0; 0 <= BBWIDTH ? _j <= BBWIDTH : _j >= BBWIDTH; x = 0 <= BBWIDTH ? ++_j : --_j) {
          c = selectColor(x, y);
          offsetX = (BBWIDTH * center.x / 2) + x;
          offsetY = (BBHEIGHT * center.y / 2) + y;
          mod = Math.abs(Terrain.noise.get(offsetX / NOISE_DENSITY, offsetY / NOISE_DENSITY));
          pixel = {};
          _ref = ['r', 'g', 'b'];
          for (_k = 0, _len = _ref.length; _k < _len; _k++) {
            cmp = _ref[_k];
            pixel[cmp] = c[cmp] * (1 - NOISE_IMPACT * (1 - mod));
          }
          if (lighting) {
            pixel = this.applyGrayscale(pixel, lighting);
          }
          dataOffset = 4 * (y * BBWIDTH + x);
          _ref1 = ['r', 'g', 'b'];
          for (i = _l = 0, _len1 = _ref1.length; _l < _len1; i = ++_l) {
            cmp = _ref1[i];
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
