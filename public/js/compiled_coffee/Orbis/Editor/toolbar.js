var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis.Editor', function(exports, Alcarin) {
  return exports.Toolbar = (function() {

    Toolbar.prototype.Current = {
      color: {
        r: 0,
        g: 128,
        b: 0
      }
    };

    function Toolbar(base, renderer) {
      this.base = base;
      this.renderer = renderer;
      this.onhashchange = __bind(this.onhashchange, this);

      this.size_changed = __bind(this.size_changed, this);

      this.map_change = __bind(this.map_change, this);

      this.canvas_mouse_painting = __bind(this.canvas_mouse_painting, this);

      this.canvas_mouse_move = __bind(this.canvas_mouse_move, this);

      this.canvas_mouse_up = __bind(this.canvas_mouse_up, this);

      this.canvas_mouse_down = __bind(this.canvas_mouse_down, this);

      this.brush_size(1);
    }

    Toolbar.prototype.brush_size = function(val) {
      if (val) {
        return this._brush_size = val;
      } else {
        return this._brush_size;
      }
    };

    Toolbar.prototype.canvas_mouse_down = function(e) {
      if ($(e.currentTarget).disabled()) {
        return false;
      }
      this.renderer.canvas.parent().on('mousemove', this.canvas_mouse_painting);
      return this.canvas_mouse_painting(e);
    };

    Toolbar.prototype.canvas_mouse_up = function() {
      return this.renderer.canvas.parent().off('mousemove', this.canvas_mouse_painting);
    };

    Toolbar.prototype.canvas_mouse_move = function(e) {
      return this.renderer.draw_shadow({
        x: e.offsetX,
        y: e.offsetY
      }, this.brush_size());
    };

    Toolbar.prototype.canvas_mouse_painting = function(e) {
      var coords, ox, oy, range, range_2, _i, _j;
      coords = this.renderer.pixels_to_coords(e.offsetX, e.offsetY);
      if (this.brush_size() > 1) {
        range = this.brush_size() - 1;
        range_2 = range * range;
        for (oy = _i = -range; -range <= range ? _i <= range : _i >= range; oy = -range <= range ? ++_i : --_i) {
          for (ox = _j = -range; -range <= range ? _j <= range : _j >= range; ox = -range <= range ? ++_j : --_j) {
            if (oy * oy + ox * ox <= range_2) {
              this.renderer.put_field(coords.x + ox, coords.y + oy, this.Current);
            }
          }
        }
      } else {
        this.renderer.put_field(coords.x, coords.y, this.Current);
      }
      return this.renderer.confirm_changes();
    };

    Toolbar.prototype.map_change = function() {
      this.save_btn.enable();
      return this.base.find('.alert').fadeIn();
    };

    Toolbar.prototype.size_changed = function(e, ui) {
      return $.bbq.push({
        'size': ui.value
      });
    };

    Toolbar.prototype.onhashchange = function() {
      var size, state;
      state = $.bbq.get();
      if (state.color != null) {
        this.Current.color = Alcarin.Color.hexToRGB(state.color);
        this.color_picker.css('background-color', state.color);
      }
      if (state.size != null) {
        size = parseInt(state.size);
        this.brush_slider.slider('value', size);
        return this.brush_size(size);
      }
    };

    Toolbar.prototype.init = function() {
      var _this = this;
      this.base.find('.alert .close').click(function() {
        return $(this).parent().fadeOut();
      });
      this.brush_slider = this.base.find('.slider');
      this.brush_slider.slider({
        min: 1,
        max: 10,
        value: 1,
        change: this.size_changed
      });
      this.save_btn = this.base.find('.alert .btn');
      this.renderer.canvas.on('mapchange', this.map_change).parent().on('mousedown', this.canvas_mouse_down).on('mousemove', this.canvas_mouse_move);
      $(document).on('mouseup', this.canvas_mouse_up);
      this.color_picker = this.base.find('a.color-picker');
      this.color_picker.colorpicker().on('hide', function(e) {
        return $.bbq.push({
          'color': e.color.toHex()
        });
      });
      return $(window).hashchange(this.onhashchange);
    };

    return Toolbar;

  })();
});
