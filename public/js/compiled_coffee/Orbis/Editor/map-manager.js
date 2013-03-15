
namespace('Alcarin.Orbis.Editor', function(exports, Alcarin) {
  return exports.MapManager = (function() {

    MapManager.prototype.changes = {};

    function MapManager(canvas, c_x, c_y) {
      this.canvas = canvas;
      this.set_center(c_x, c_y);
    }

    MapManager.prototype.set_center = function(c_x, c_y) {
      this.rect = void 0;
      return this.center = {
        x: c_x,
        y: c_y
      };
    };

    MapManager.prototype.in_view_rect = function(x, y) {
      var _rect;
      _rect = this.rect || {
        left: this.center.x - this.size / 2,
        right: this.center.x + this.size / 2,
        top: this.center.y - this.size / 2,
        bottom: this.center.y + this.size / 2
      };
      this.rect = _rect;
      return (_rect.left <= x && x < _rect.right) && (_rect.top <= y && y < _rect.bottom);
    };

    MapManager.prototype.init_backbuffer = function(sizeW, sizeH) {
      var _canvas;
      if (!(this.backbuffer_canvas != null)) {
        this.backbuffer_canvas = $('<canvas>', {
          width: sizeW,
          height: sizeH
        });
        _canvas = this.backbuffer_canvas[0];
        this.backbuffer = _canvas.getContext('2d');
        $(this.backbuffer).disableSmoothing();
      }
      this.backbuffer.fillStyle = "rgb(0, 0, 255)";
      this.backbuffer.fillRect(0, 0, sizeW, sizeH);
      return this.backbuffer;
    };

    MapManager.prototype.init = function() {
      this.context = this.canvas[0].getContext('2d');
      this.context.fillStyle = "rgb(0, 0, 255)";
      this.context.fillRect(0, 0, this.canvas.width(), this.canvas.height());
      return $(this.context).disableSmoothing();
    };

    MapManager.prototype.redraw = function(size, fields) {
      var backbuffer, color, field, i, image_data, offset, _i, _j, _len, _offset, _x, _y;
      this.size = size;
      backbuffer = this.init_backbuffer(size, size);
      this.image_data = image_data = backbuffer.getImageData(0, 0, size, size);
      offset = {
        x: this.center.x - size / 2,
        y: this.center.y - size / 2
      };
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        color = field.land.color;
        _x = field.loc.x - offset.x;
        _y = field.loc.y - offset.y;
        _offset = 4 * (_y * size + _x);
        for (i = _j = 0; _j <= 2; i = ++_j) {
          image_data.data[_offset + i] = (color >> (8 * (2 - i))) & 0xFF;
        }
      }
      this._buffer_to_front(true);
      return this.unsaved_changes = false;
    };

    MapManager.prototype.pixels_to_coords = function(x, y) {
      var offset;
      offset = {
        x: this.center.x - this.size / 2,
        y: this.center.y - this.size / 2
      };
      return {
        x: offset.x + Math.round(x * this.backbuffer_canvas.width() / this.canvas.width()),
        y: offset.y + Math.round(y * this.backbuffer_canvas.height() / this.canvas.height())
      };
    };

    MapManager.prototype.put_field = function(x, y, field_brush) {
      var bb_pos, color, offset, _data;
      if ((x != null) && (y != null) && this.in_view_rect(x, y)) {
        color = field_brush.color;
        bb_pos = this._coords_to_backbuffer_pixels(x, y);
        offset = 4 * (bb_pos.y * this.size + bb_pos.x);
        this.image_data.data[offset] = color.r;
        this.image_data.data[offset + 1] = color.g;
        this.image_data.data[offset + 2] = color.b;
        _data = $.extend({}, field_brush);
        _data.color = (color.r << 16) + (color.g << 8) + color.b;
        return this.changes["" + x + "," + y] = {
          x: x,
          y: y,
          field: _data
        };
      }
    };

    MapManager.prototype.confirm_changes = function() {
      this._buffer_to_front(true);
      this.unsaved_changes = true;
      return this.canvas.trigger('mapchange');
    };

    MapManager.prototype._buffer_to_front = function(with_swap) {
      var _h, _w;
      if (with_swap == null) {
        with_swap = false;
      }
      if (with_swap) {
        this.backbuffer.putImageData(this.image_data, 0, 0);
      }
      this.context.save();
      _w = this.canvas.width();
      _h = this.canvas.height();
      this.context.drawImage(this.backbuffer_canvas[0], 0, 0, this.size, this.size, 0, 0, _w, _h);
      return this.context.restore();
    };

    MapManager.prototype._coords_to_backbuffer_pixels = function(x, y) {
      var offset;
      offset = {
        x: this.center.x - this.size / 2,
        y: this.center.y - this.size / 2
      };
      return {
        x: x - offset.x,
        y: y - offset.y
      };
    };

    return MapManager;

  })();
});
