namespace('Alcarin.Map.Layers', function(exports, Alcarin) {
  return exports.Terrain = (function() {
    Terrain.prototype.background = [0, 0, 255];

    function Terrain(element) {
      this.table = $(element);
      this.table.append(this.prepareCanvas());
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

    return Terrain;

  })();
});

/*
//@ sourceMappingURL=terrain.js.map
*/
