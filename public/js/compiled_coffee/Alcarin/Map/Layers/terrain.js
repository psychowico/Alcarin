var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Map.Layers', function(exports, Alcarin) {
  return exports.Terrain = (function(_super) {
    __extends(Terrain, _super);

    Terrain.prototype.background = [0, 0, 255];

    function Terrain(element) {
      this.table = $(element);
      this.table.append(this.prepareCanvas());
      this.$on('terrain.swap', this.onTerrainSwap);
    }

    Terrain.prototype.width = function() {
      var _ref;

      return (_ref = this.canvas[0]) != null ? _ref.width : void 0;
    };

    Terrain.prototype.height = function() {
      var _ref;

      return (_ref = this.canvas[0]) != null ? _ref.height : void 0;
    };

    Terrain.prototype.prepareCanvas = function() {
      var bg;

      if (this.canvas) {
        this.context = null;
        this.canvas.remove();
      }
      this.canvas = $('<canvas>');
      $.extend(this.canvas[0], {
        width: this.table.width(),
        height: this.table.height()
      });
      this.context = this.canvas[0].getContext('2d');
      bg = this.background;
      this.context.fillStyle = "rgb(" + bg[0] + ", " + bg[1] + ", " + bg[2] + ")";
      this.context.fillRect(0, 0, this.width(), this.height());
      $(this.context).disableSmoothing();
      return this.canvas;
    };

    Terrain.prototype.onTerrainSwap = function(radius, fields) {};

    return Terrain;

  })(Alcarin.EventsEmitter);
});

/*
//@ sourceMappingURL=terrain.js.map
*/
