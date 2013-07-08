var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Admin.Map.Layers', function(exports, Alcarin) {
  var canvas_events;

  canvas_events = function(map, element) {
    var events;

    events = (function() {
      function events() {
        this.mouse_painting = __bind(this.mouse_painting, this);
        this.mouse_move = __bind(this.mouse_move, this);
        this.mouse_up = __bind(this.mouse_up, this);
        this.mouse_down = __bind(this.mouse_down, this);
      }

      events.prototype.mouse_down = function(e) {
        if ($(e.currentTarget).disabled()) {
          return false;
        }
        element.on('mousemove', this.mouse_painting);
        return this.mouse_painting(e);
      };

      events.prototype.mouse_up = function() {
        return element.off('mousemove', this.mouse_painting);
      };

      events.prototype.mouse_move = function(e) {
        return map.draw_shadow({
          x: e.offsetX,
          y: e.offsetY
        }, map.mapBrush);
      };

      events.prototype.mouse_painting = function(e) {
        var brush, coords, ox, oy, range, range_2, _i, _j;

        coords = map.pixels_to_coords(e.offsetX, e.offsetY);
        brush = map.mapBrush;
        if (brush.size > 1) {
          range = brush.size - 1;
          range_2 = range * range;
          for (oy = _i = -range; -range <= range ? _i <= range : _i >= range; oy = -range <= range ? ++_i : --_i) {
            for (ox = _j = -range; -range <= range ? _j <= range : _j >= range; ox = -range <= range ? ++_j : --_j) {
              if (oy * oy + ox * ox <= range_2) {
                map.put_field(coords.x + ox, coords.y + oy, brush);
              }
            }
          }
        } else {
          map.put_field(coords.x, coords.y, brush);
        }
        return map.confirm_changes();
      };

      return events;

    })();
    return new events();
  };
  return exports.EditableTerrain = (function(_super) {
    __extends(EditableTerrain, _super);

    EditableTerrain.prototype.background = [0, 0, 255];

    EditableTerrain.prototype.noise_density = 25;

    EditableTerrain.prototype.noise_impact = 0.22;

    EditableTerrain.prototype.mapBrush = null;

    function EditableTerrain(canvas, c_x, c_y) {
      var ev,
        _this = this;

      this.canvas = canvas;
      this.redraw = __bind(this.redraw, this);
      this.set_center = __bind(this.set_center, this);
      this.set_center(c_x, c_y);
      this.$on('set-center', this.set_center);
      this.$on('fields-fetched', this.redraw);
      this.$on('brush-changed', function(brush) {
        return _this.mapBrush = brush;
      });
      this.init();
      ev = canvas_events(this, this.canvas.parent());
      this.canvas.parent().on('mousedown', ev.mouse_down).on('mousemove', ev.mouse_move);
      $(document).on('mouseup', ev.mouse_up);
    }

    EditableTerrain.prototype.noise = function() {
      if (this._noise == null) {
        this._noise = new ROT.Noise.Simplex;
      }
      return this._noise;
    };

    EditableTerrain.prototype.set_center = function(c_x, c_y) {
      this.rect = void 0;
      return this.center = {
        x: c_x,
        y: c_y
      };
    };

    EditableTerrain.prototype.draw_shadow = function(p, size) {
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

    EditableTerrain.prototype.in_view_rect = function(x, y) {
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

    EditableTerrain.prototype.init_backbuffer = function(sizeW, sizeH) {
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

    EditableTerrain.prototype.init_foreground = function() {
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

    EditableTerrain.prototype.init = function() {
      var bg;

      this.context = this.canvas[0].getContext('2d');
      bg = this.background;
      this.context.fillStyle = "rgb(" + bg[0] + ", " + bg[1] + ", " + bg[2] + ")";
      this.context.fillRect(0, 0, this.canvas.width(), this.canvas.height());
      return $(this.context).disableSmoothing();
    };

    EditableTerrain.prototype.redraw = function(size, fields) {
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

    EditableTerrain.prototype.unit_pixel_size = function() {
      return this.canvas[0].width / this.backbuffer_canvas[0].width;
    };

    EditableTerrain.prototype.pixels_to_coords = function(x, y) {
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

    EditableTerrain.prototype.put_field = function(x, y, field_brush) {
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
        return this.$emit('field-changed', {
          x: x,
          y: y
        }, {
          x: x,
          y: y,
          field: _data
        });
      }
    };

    EditableTerrain.prototype.confirm_changes = function() {
      this._buffer_to_front(true);
      this.unsaved_changes = true;
      this.$emit('changes-confirmed');
      return this.canvas.trigger('mapchange');
    };

    EditableTerrain.prototype._buffer_to_front = function(with_swap) {
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

    EditableTerrain.prototype._coords_to_backbuffer_pixels = function(x, y) {
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

    return EditableTerrain;

  })(Alcarin.EventsEmitter);
});

/*
//@ sourceMappingURL=editable-terrain.js.map
*/
