
namespace('Alcarin.Orbis.Editor', function(exports, Alcarin) {
  return exports.MapRenderer = (function() {

    function MapRenderer(canvas, c_x, c_y) {
      this.canvas = canvas;
      this.center = {
        x: c_x,
        y: c_y
      };
    }

    MapRenderer.prototype.init = function() {
      this.context = this.canvas[0].getContext('2d');
      this.context.fillStyle = "rgb(0, 0, 255)";
      this.context.fillRect(0, 0, this.canvas.width(), this.canvas.height());
      return this.context.webkitImageSmoothingEnabled = this.context.mozImageSmoothingEnabled = false;
    };

    MapRenderer.prototype.redraw = function(size, fields) {
      var b, backbuffer, color, field, g, i, image_data, offset, r, _i, _j, _len, _offset, _x, _y;
      backbuffer = this._prepare_empty_canvas(size, size);
      image_data = backbuffer.getImageData(0, 0, size, size);
      offset = {
        x: this.center.x - size / 2,
        y: this.center.y - size / 2
      };
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        color = field.land.color;
        r = color & 255;
        g = (color >> 8) & 255;
        b = (color >> 16) & 255;
        _x = field.loc.x - offset.x;
        _y = field.loc.y - offset.y;
        _offset = 4 * (_y * size + _x);
        for (i = _j = 0; _j <= 2; i = ++_j) {
          image_data.data[_offset + i] = (color >> (8 * i)) & 255;
        }
      }
      backbuffer.putImageData(image_data, 0, 0);
      this.context.save();
      this.context.drawImage(this.backbuffer_canvas, 0, 0, size, size, 0, 0, this.canvas.width(), this.canvas.height());
      return this.context.restore();
    };

    MapRenderer.prototype._prepare_empty_canvas = function(sizeW, sizeH) {
      if (!(this.backbuffer_canvas != null)) {
        this.backbuffer_canvas = $('<canvas>')[0];
        this.backbuffer_canvas.width = sizeW;
        this.backbuffer_canvas.height = sizeH;
        this.backbuffer = this.backbuffer_canvas.getContext('2d');
      }
      this.backbuffer.fillStyle = "rgb(0, 0, 255)";
      this.backbuffer.fillRect(0, 0, sizeW, sizeH);
      return this.backbuffer;
    };

    return MapRenderer;

  })();
});
