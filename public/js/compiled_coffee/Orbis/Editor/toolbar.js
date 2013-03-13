var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis.Editor', function(exports, Alcarin) {
  return exports.Toolbar = (function() {

    Toolbar.prototype.Current = {
      color: '#007700'
    };

    function Toolbar(base, renderer) {
      this.base = base;
      this.renderer = renderer;
      this.onhashchange = __bind(this.onhashchange, this);

      this.canvas_mouse_painting = __bind(this.canvas_mouse_painting, this);

      this.canvas_mouse_up = __bind(this.canvas_mouse_up, this);

      this.canvas_mouse_down = __bind(this.canvas_mouse_down, this);

    }

    Toolbar.prototype.canvas_mouse_down = function(e) {
      this.renderer.canvas.on('mousemove', this.canvas_mouse_painting);
      return this.canvas_mouse_painting(e);
    };

    Toolbar.prototype.canvas_mouse_up = function() {
      return this.renderer.canvas.off('mousemove', this.canvas_mouse_painting);
    };

    Toolbar.prototype.canvas_mouse_painting = function(e) {
      var pos;
      pos = {
        x: e.offsetX,
        y: e.offsetY
      };
      return console.log(pos);
    };

    Toolbar.prototype.onhashchange = function() {
      var state;
      state = $.bbq.get();
      if (state.color != null) {
        this.Current.color = state.color;
        return this.color_picker.css('background-color', state.color);
      }
    };

    Toolbar.prototype.init = function() {
      var _this = this;
      this.renderer.canvas.on('mousedown', this.canvas_mouse_down).on('mouseup', this.canvas_mouse_up);
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
