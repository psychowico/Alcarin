'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Game.Map', function(exports, Alcarin) {
  var NOISE_DENSITY, NOISE_IMPACT, Terrain, noise;

  angular.module('@area-map', ['@game-services']).directive('alcAreaMap', function() {
    return {
      restrict: 'A',
      scope: {
        mapRadius: '=',
        mapFields: '=',
        mapCenter: '=',
        onDrawn: '&'
      },
      link: function($scope, element, attrs) {
        return $(function() {
          var terrain;

          terrain = new Terrain(element);
          terrain.$on('drawn', function() {
            if ($scope.onDrawn) {
              return $scope.onDrawn();
            }
          });
          $scope.$watch('mapRadius', function(val) {
            return terrain.setRadius(val);
          });
          $scope.$watch('mapFields', function(val) {
            return terrain.setFields(val);
          });
          $scope.$watch('mapCenter', function(val) {
            return terrain.setCenter(val);
          });
          return element.data('rel', terrain);
        });
      }
    };
  });
  NOISE_DENSITY = 25;
  NOISE_IMPACT = 0.22;
  noise = new ROT.Noise.Simplex();
  return Terrain = (function(_super) {
    __extends(Terrain, _super);

    Terrain.prototype.background = 'rgb(0,0,255)';

    Terrain.prototype.needRedraw = false;

    function Terrain(canvas) {
      this.canvas = canvas;
      this.redraw = __bind(this.redraw, this);
      this.prepareCanvas();
    }

    Terrain.prototype.setCenter = function(center) {
      this.center = center;
      if (this.center) {
        this.center = {
          x: Math.round(center.x),
          y: Math.round(center.y)
        };
      }
      if (this.needRedraw) {
        return this.redraw();
      }
    };

    Terrain.prototype.setRadius = function(radius) {
      this.radius = radius;
      if (this.needRedraw) {
        return this.redraw();
      }
    };

    Terrain.prototype.setFields = function(fields) {
      this.fields = fields;
      return this.redraw();
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
      this.context.fillStyle = this.background;
      this.context.fillRect(0, 0, this.width(), this.height());
      return $(this.context).disableSmoothing();
    };

    Terrain.prototype.getBackbuffer = function(sizeW, sizeH) {
      var _ref;

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
      this.backbufferContext.fillStyle = this.background;
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

    Terrain.prototype.redraw = function() {
      var bufferContext, c, color, dataOffset, field, i, imageData, mod, offset, pixelX, pixelY, size, _i, _j, _len, _ref;

      if ((this.fields != null) && (this.center != null) && (this.radius != null)) {
        this.needRedraw = false;
        size = this.radius * 2;
        bufferContext = this.getBackbuffer(size, size);
        imageData = bufferContext.getImageData(0, 0, size, size);
        offset = {
          x: this.center.x - this.radius,
          y: this.center.y - this.radius
        };
        _ref = this.fields;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          color = field.land.color;
          pixelX = field.loc.x - offset.x;
          pixelY = field.loc.y - offset.y;
          mod = Math.abs(noise.get(field.loc.x / NOISE_DENSITY, field.loc.y / NOISE_DENSITY));
          dataOffset = 4 * (pixelY * size + pixelX);
          for (i = _j = 0; _j <= 2; i = ++_j) {
            c = (color >> (8 * (2 - i))) & 0xFF;
            c *= 1 - NOISE_IMPACT * (1 - mod);
            imageData.data[dataOffset + i] = ~~c;
          }
        }
        bufferContext.putImageData(imageData, 0, 0);
        return this.swapBuffer();
      } else {
        return this.needRedraw = true;
      }
    };

    return Terrain;

  })(Alcarin.EventsEmitter);
});

/*
//@ sourceMappingURL=ngx-area-map.js.map
*/
