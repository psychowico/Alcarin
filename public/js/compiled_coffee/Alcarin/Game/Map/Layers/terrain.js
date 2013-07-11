var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Game.Map.Layers', function(exports, Alcarin) {
  var NOISE_DENSITY, NOISE_IMPACT, noise;

  NOISE_DENSITY = 25;
  NOISE_IMPACT = 0.22;
  noise = new ROT.Noise.Simplex();
  return exports.Terrain = (function(_super) {
    __extends(Terrain, _super);

    Terrain.prototype.background = [0, 0, 255];

    function Terrain(element, Services) {
      var GameServer;

      this.Services = Services;
      this.onTerrainSwap = __bind(this.onTerrainSwap, this);
      this.table = $(element);
      this.table.append(this.prepareCanvas());
      GameServer = this.Services.get('GameServer');
      GameServer.on('terrain.swap', this.onTerrainSwap);
    }

    Terrain.prototype.width = function() {
      var _ref;

      return (_ref = this.canvas[0]) != null ? _ref.width : void 0;
    };

    Terrain.prototype.height = function() {
      var _ref;

      return (_ref = this.canvas[0]) != null ? _ref.height : void 0;
    };

    Terrain.prototype.setTarget = function(charPromise) {
      this.charPromise = charPromise;
    };

    Terrain.prototype.prepareCanvas = function() {
      var bg, pixelSize;

      if (this.canvas) {
        this.context = null;
        this.canvas.remove();
      }
      this.canvas = $('<canvas>', {
        "class": 'terrain'
      });
      pixelSize = this.table.width() + 5;
      $.extend(this.canvas[0], {
        width: pixelSize,
        height: pixelSize
      });
      this.context = this.canvas[0].getContext('2d');
      bg = this.background;
      this.context.fillStyle = "rgb(" + bg[0] + ", " + bg[1] + ", " + bg[2] + ")";
      this.context.fillRect(0, 0, this.width(), this.height());
      $(this.context).disableSmoothing();
      return this.canvas;
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
      this.backbufferContext.fillStyle = "rgb(0, 0, 255)";
      this.backbufferContext.fillRect(0, 0, sizeW, sizeH);
      return this.backbufferContext;
    };

    Terrain.prototype.swapBuffer = function() {
      var h, w;

      this.context.save();
      w = this.backbuffer[0].width;
      h = this.backbuffer[0].height;
      this.context.drawImage(this.backbuffer[0], 0, 0, w, h, 0, 0, this.width(), this.height());
      return this.context.restore();
    };

    Terrain.prototype.onTerrainSwap = function(fields, radius) {
      var _this = this;

      return this.charPromise.done(function(character) {
        var bufferContext, c, center, color, dataOffset, field, i, imageData, mod, offset, pixelX, pixelY, size, _i, _j, _len;

        center = {
          x: Math.round(character.loc.x),
          y: Math.round(character.loc.y)
        };
        console.log(center);
        size = radius * 2;
        bufferContext = _this.getBackbuffer(size, size);
        _this.Services.get('CoordConverter').init(center, radius, _this.width() / 2);
        imageData = bufferContext.getImageData(0, 0, size, size);
        offset = {
          x: center.x - radius,
          y: center.y - radius
        };
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
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
        return _this.swapBuffer();
      });
    };

    return Terrain;

  })(Alcarin.EventsEmitter);
});

/*
//@ sourceMappingURL=terrain.js.map
*/
