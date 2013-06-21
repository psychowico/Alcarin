namespace('Alcarin.Orbis.Editor', function(exports, Alcarin) {
  return exports.MapManager = (function() {
    MapManager.prototype.background = [0, 0, 255];

    MapManager.prototype.noise_density = 25;

    MapManager.prototype.noise_impact = 0.22;

    function MapManager($scope, canvas, c_x, c_y) {
      this.$scope = $scope;
      this.canvas = canvas;
      this.set_center(c_x, c_y);
    }

    MapManager.prototype.noise = function() {
      if (this._noise == null) {
        this._noise = new ROT.Noise.Simplex;
      }
      return this._noise;
    };

    MapManager.prototype.set_center = function(c_x, c_y) {
      this.rect = void 0;
      return this.center = {
        x: c_x,
        y: c_y
      };
    };

    MapManager.prototype.draw_shadow = function(p, size) {
      var c, up, x, y, _size;

      if (this.foreground == null) {
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

      if (this.backbuffer_canvas == null) {
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

      if (this.foreground == null) {
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
      var bg;

      this.context = this.canvas[0].getContext('2d');
      bg = this.background;
      this.context.fillStyle = "rgb(" + bg[0] + ", " + bg[1] + ", " + bg[2] + ")";
      this.context.fillRect(0, 0, this.canvas.width(), this.canvas.height());
      return $(this.context).disableSmoothing();
    };

    MapManager.prototype.redraw = function(size, fields) {
      var backbuffer, c, color, field, i, image_data, mod, offset, _i, _j, _len, _offset, _x, _y;

      this.plain_colors = [];
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
        mod = Math.abs(this.noise().get(field.loc.x / this.noise_density, field.loc.y / this.noise_density));
        _offset = 4 * (_y * size + _x);
        for (i = _j = 0; _j <= 2; i = ++_j) {
          c = (color >> (8 * (2 - i))) & 0xFF;
          this.plain_colors[_offset + i] = c;
          c *= 1 - this.noise_impact * (1 - mod);
          image_data.data[_offset + i] = ~~c;
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
      var bb_pos, color, current, i, mod, offset, rgb, target, _data, _i;

      if ((x != null) && (y != null) && this.in_view_rect(x, y)) {
        mod = Math.abs(this.noise().get(x / this.noise_density, y / this.noise_density));
        color = field_brush.color;
        bb_pos = this._coords_to_backbuffer_pixels(x, y);
        offset = 4 * (bb_pos.y * this.size + bb_pos.x);
        rgb = [color.r, color.g, color.b];
        for (i = _i = 0; _i <= 2; i = ++_i) {
          current = this.background[i];
          if (this.plain_colors[offset + i] != null) {
            current = this.plain_colors[offset + i];
          }
          rgb[i] = 0.7 * current + 0.3 * rgb[i];
          this.plain_colors[offset + i] = rgb[i];
          target = rgb[i] * (1 - this.noise_impact * (1 - mod));
          this.image_data.data[offset + i] = ~~target;
        }
        _data = $.extend({}, field_brush);
        _data.color = (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
        return this.$scope.changes["" + x + "," + y] = {
          x: x,
          y: y,
          field: _data
        };
      }
    };

    MapManager.prototype.confirm_changes = function() {
      this._buffer_to_front(true);
      this.unsaved_changes = true;
      if (this.change_happen != null) {
        this.change_happen();
      }
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

/*
//@ sourceMappingURL=map-manager.js.map
*/
