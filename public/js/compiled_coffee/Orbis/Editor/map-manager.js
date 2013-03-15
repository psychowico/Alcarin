
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

    MapManager.prototype.draw_shadow = function(p, size) {
      var c, up, x, y, _size;
      if (!(this.foreground != null)) {
        return false;
      }
      c = this.foreground_canvas[0];
      this.foreground.clearRect(0, 0, c.width, c.height);
      up = this.unit_pixel_size();
      _size = up * (-0.5 + size);
      if (_size > 0) {
        this.foreground.beginPath();
        x = p.x;
        y = p.y;
        this.foreground.arc(x, y, _size, 0, 360);
        this.foreground.lineWidth = 2;
        this.foreground.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        return this.foreground.stroke();
      }
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
        this.backbuffer_canvas = $('<canvas>');
        _canvas = this.backbuffer_canvas[0];
        _canvas.width = sizeW;
        _canvas.height = sizeH;
        this.backbuffer = _canvas.getContext('2d');
        $(this.backbuffer).disableSmoothing();
      }
      this.backbuffer.fillStyle = "rgb(0, 0, 255)";
      this.backbuffer.fillRect(0, 0, sizeW, sizeH);
      return this.backbuffer;
    };

    MapManager.prototype.init_foreground = function() {
      var _canvas;
      if (!(this.foreground != null)) {
        this.foreground_canvas = $('<canvas>', {
          "class": 'foreground'
        });
        _canvas = this.foreground_canvas[0];
        _canvas.width = this.canvas.width();
        _canvas.height = this.canvas.height();
        this.foreground = _canvas.getContext('2d');
        this.foreground_canvas.appendTo(this.canvas.parent());
      }
      return this.foreground;
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
      this.init_foreground();
      return this.unsaved_changes = false;
    };

    MapManager.prototype.unit_pixel_size = function() {
      return this.canvas[0].width / this.backbuffer_canvas[0].width;
    };

    MapManager.prototype.pixels_to_coords = function(x, y) {
      var offset;
      offset = {
        x: this.center.x - this.size / 2,
        y: this.center.y - this.size / 2
      };
      return {
        x: offset.x + Math.round(x * this.backbuffer_canvas[0].width / this.canvas[0].width),
        y: offset.y + Math.round(y * this.backbuffer_canvas[0].height / this.canvas[0].height)
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
