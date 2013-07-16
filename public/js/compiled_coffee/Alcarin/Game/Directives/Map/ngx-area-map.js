'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Game.Directives.Map', function(exports, Alcarin) {
  var GRAYSCALE, NOISE_DENSITY, NOISE_IMPACT, Terrain, noise;

  exports.module.directive('alcAreaMap', [
    'MapBackground', function(MapBackground) {
      return {
        restrict: 'A',
        link: function($scope, element, attrs) {
          return $(function() {
            var terrain;

            terrain = new Terrain(element);
            terrain.$on('drawn', MapBackground.onDrawn);
            MapBackground.$on('fieldsChanged', function() {
              terrain.setCenter(MapBackground.center);
              terrain.setRadius(MapBackground.radius);
              terrain.setFields(MapBackground.fields);
              terrain.setLighting(MapBackground.lighting);
              return terrain.redraw();
            });
            return element.data('rel', terrain);
          });
        }
      };
    }
  ]);
  NOISE_DENSITY = 25;
  NOISE_IMPACT = 0.22;
  noise = new ROT.Noise.Simplex();
  GRAYSCALE = [0.3, 0.59, 0.11];
  return Terrain = (function(_super) {
    __extends(Terrain, _super);

    Terrain.prototype.background = {
      r: 0,
      g: 0,
      b: 255
    };

    function Terrain(canvas) {
      this.canvas = canvas;
      this.redraw = __bind(this.redraw, this);
      this.prepareCanvas();
    }

    Terrain.prototype.setCenter = function(center) {
      this.center = center;
      if (this.center) {
        return this.center = {
          x: Math.round(center.x),
          y: Math.round(center.y)
        };
      }
    };

    Terrain.prototype.setRadius = function(radius) {
      this.radius = radius;
    };

    Terrain.prototype.setFields = function(fields) {
      this.fields = fields;
    };

    Terrain.prototype.setLighting = function(lighting) {
      if (lighting) {
        return this.lighting = (lighting + 0.4) / 1.4;
      }
    };

    Terrain.prototype.width = function() {
      var _ref;

      return (_ref = this.canvas[0]) != null ? _ref.width : void 0;
    };

    Terrain.prototype.height = function() {
      var _ref;

      return (_ref = this.canvas[0]) != null ? _ref.height : void 0;
    };

    Terrain.prototype.prepareCanvas = function() {
      this.context = this.canvas[0].getContext('2d');
      this.context.fillStyle = "black";
      this.context.fillRect(0, 0, this.width(), this.height());
      return $(this.context).disableSmoothing();
    };

    Terrain.prototype.getBackbuffer = function(sizeW, sizeH) {
      var c, _ref;

      if ((_ref = this.backbuffer) != null) {
        _ref.remove();
      }
      this.backbuffer = $('<canvas>');
      $.extend(this.backbuffer[0], {
        width: sizeW,
        height: sizeH
      });
      this.backbufferContext = this.backbuffer[0].getContext('2d');
      $(this.backbufferContext).disableSmoothing();
      c = this.background;
      if (this.lighting) {
        c = this.applyGrayscale(c, this.lighting);
      }
      this.backbufferContext.fillStyle = "rgb(" + (~~c.r) + "," + (~~c.g) + "," + (~~c.b) + ")";
      this.backbufferContext.fillRect(0, 0, sizeW, sizeH);
      return this.backbufferContext;
    };

    Terrain.prototype.swapBuffer = function() {
      var h, w;

      this.context.save();
      w = this.backbuffer[0].width;
      h = this.backbuffer[0].height;
      this.context.drawImage(this.backbuffer[0], 0, 0, w, h, -5, -2, this.width() + 2, this.height() + 2);
      this.context.restore();
      return this.$emit('drawn');
    };

    Terrain.prototype.applyGrayscale = function(color, lighting) {
      var gray;

      gray = GRAYSCALE[0] * color.r + GRAYSCALE[1] * color.g + GRAYSCALE[2] * color.b;
      gray *= 1 - lighting;
      return {
        r: (lighting * color.r) + gray,
        g: (lighting * color.g) + gray,
        b: (lighting * color.b) + gray
      };
    };

    Terrain.prototype.redraw = function() {
      var bufferContext, c, cmp, color, dataOffset, field, i, imageData, lighting, mod, offset, pixelX, pixelY, result, size, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

      size = this.radius * 2;
      bufferContext = this.getBackbuffer(size, size);
      imageData = bufferContext.getImageData(0, 0, size, size);
      offset = {
        x: this.center.x - this.radius,
        y: this.center.y - this.radius
      };
      lighting = this.lighting;
      c = {};
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        color = field.land.color;
        pixelX = field.loc.x - offset.x;
        pixelY = field.loc.y - offset.y;
        mod = Math.abs(noise.get(field.loc.x / NOISE_DENSITY, field.loc.y / NOISE_DENSITY));
        dataOffset = 4 * (pixelY * size + pixelX);
        result = 0;
        _ref1 = ['r', 'g', 'b'];
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          cmp = _ref1[i];
          c[cmp] = (color >> (8 * (2 - i))) & 0xFF;
          c[cmp] *= 1 - NOISE_IMPACT * (1 - mod);
        }
        if (lighting) {
          c = this.applyGrayscale(c, lighting);
        }
        _ref2 = ['r', 'g', 'b'];
        for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
          cmp = _ref2[i];
          imageData.data[dataOffset + i] = ~~c[cmp];
        }
      }
      bufferContext.putImageData(imageData, 0, 0);
      return this.swapBuffer();
    };

    return Terrain;

  })(Alcarin.EventsEmitter);
});

/*
//@ sourceMappingURL=ngx-area-map.js.map
*/
