var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis.Editor', function(exports, Alcarin) {
  return exports.Editor = (function() {

    function Editor(base) {
      var canvas;
      this.base = base;
      this.on_fields_loaded = __bind(this.on_fields_loaded, this);

      this.move_btn_click = __bind(this.move_btn_click, this);

      this.hashchange = __bind(this.hashchange, this);

      this.proxy = new Alcarin.EventProxy(urls.orbis.map);
      canvas = this.base.find('canvas');
      this.renderer = new Alcarin.Orbis.Editor.MapRenderer(canvas);
      this.center = {
        x: 0,
        y: 0
      };
      this.step_size = 1;
      this.toolbar = new Alcarin.Orbis.Editor.Toolbar(this.base.find('.toolbar'), this.renderer);
    }

    Editor.prototype.hashchange = function() {
      var state, _ref, _ref1;
      state = $.bbq.getState();
      if (state.x !== ((_ref = this.center) != null ? _ref.x : void 0) || state.y !== ((_ref1 = this.center) != null ? _ref1.y : void 0)) {
        this.center = {
          x: parseInt(state.x || 0),
          y: parseInt(state.y || 0)
        };
        return this.proxy.emit('fields.fetch', {
          x: this.center.x,
          y: this.center.y
        });
      }
    };

    Editor.prototype.move_btn_click = function(e) {
      var btn, diff_x, diff_y, step;
      btn = $(e.currentTarget);
      step = this.step_size - 1;
      diff_x = btn.data('diff-x');
      if (diff_x != null) {
        this.center.x += step * parseInt(diff_x);
      }
      diff_y = btn.data('diff-y');
      if (diff_y != null) {
        this.center.y += step * parseInt(diff_y);
      }
      return $.bbq.pushState({
        x: this.center.x,
        y: this.center.y
      });
    };

    Editor.prototype.on_fields_loaded = function(response) {
      if (response.success) {
        this.step_size = response.size;
        this.renderer.set_center(this.center.x, this.center.y);
        return this.renderer.redraw(response.size, response.fields);
      }
    };

    Editor.prototype.init = function() {
      this.renderer.init();
      this.proxy.on('fields.loaded', this.on_fields_loaded);
      $('.map-viewport .btn').on('click', this.move_btn_click);
      $(window).on('hashchange', this.hashchange);
      return this.toolbar.init();
    };

    return Editor;

  })();
});
