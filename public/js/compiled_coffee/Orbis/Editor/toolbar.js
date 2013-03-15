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

      this.canvas_mouse_up = __bind(this.canvas_mouse_up, this);

      this.canvas_mouse_down = __bind(this.canvas_mouse_down, this);

      this.brush_size = 1;
    }

    Toolbar.prototype.canvas_mouse_down = function(e) {
      this.renderer.canvas.on('mousemove', this.canvas_mouse_painting);
      return this.canvas_mouse_painting(e);
    };

    Toolbar.prototype.canvas_mouse_up = function() {
      return this.renderer.canvas.off('mousemove', this.canvas_mouse_painting);
    };

    Toolbar.prototype.canvas_mouse_painting = function(e) {
      var coords, ox, oy, range, range_2, _i, _j;
      coords = this.renderer.pixels_to_coords(e.offsetX, e.offsetY);
      if (this.brush_size > 1) {
        range = this.brush_size - 1;
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
      return this.base.find('.alert').fadeIn();
    };

    Toolbar.prototype.size_changed = function(e, ui) {
      return this.brush_size = ui.value;
    };

    Toolbar.prototype.onhashchange = function() {
      var state;
      state = $.bbq.get();
      if (state.color != null) {
        this.Current.color = Alcarin.Color.hexToRGB(state.color);
        return this.color_picker.css('background-color', state.color);
      }
    };

    Toolbar.prototype.init = function() {
      var _this = this;
      this.base.find('.alert .close').click(function() {
        return $(this).parent().fadeOut();
      });
      this.base.find('.slider').slider({
        min: 1,
        max: 10,
        value: 1,
        slide: this.size_changed
      });
      this.save_btn = this.base.find('.alert .btn');
      this.renderer.canvas.on('mousedown', this.canvas_mouse_down).on('mouseup', this.canvas_mouse_up).on('mapchange', this.map_change);
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
