var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis.Editor', function(exports, Alcarin) {
  return exports.Editor = (function() {

    function Editor(base) {
      var canvas;
      this.base = base;
      this.on_fields_updated = __bind(this.on_fields_updated, this);

      this.save_map = __bind(this.save_map, this);

      this.on_fields_loaded = __bind(this.on_fields_loaded, this);

      this.on_before_unload = __bind(this.on_before_unload, this);

      this.move_btn_click = __bind(this.move_btn_click, this);

      this.onhashchange = __bind(this.onhashchange, this);

      this.proxy = new Alcarin.EventProxy(urls.orbis.map);
      canvas = this.base.find('canvas');
      this.renderer = new Alcarin.Orbis.Editor.MapManager(canvas);
      this.step_size = 1;
      this.toolbar = new Alcarin.Orbis.Editor.Toolbar(this.base.find('.toolbar'), this.renderer);
    }

    Editor.prototype.onhashchange = function() {
      var state, _ref, _ref1;
      state = $.bbq.getState();
      state.x = parseInt(state.x || 0);
      state.y = parseInt(state.y || 0);
      if (state.x !== ((_ref = this.center) != null ? _ref.x : void 0) || state.y !== ((_ref1 = this.center) != null ? _ref1.y : void 0)) {
        this.renderer.unsaved_changes = {};
        this.center = {
          x: state.x,
          y: state.y
        };
        this.renderer.canvas.parent().spin(true);
        this.proxy.emit('fields.fetch', {
          x: this.center.x,
          y: this.center.y
        });
      }
      return false;
    };

    Editor.prototype.move_btn_click = function(e) {
      var btn_click,
        _this = this;
      btn_click = function() {
        var btn, diff_x, diff_y, new_center, step;
        btn = $(e.currentTarget);
        step = _this.step_size - 1;
        diff_x = btn.data('diff-x');
        diff_y = btn.data('diff-y');
        new_center = $.extend({}, _this.center);
        if (diff_x != null) {
          new_center.x += Math.round(step * parseFloat(diff_x));
        }
        if (diff_y != null) {
          new_center.y += Math.round(step * parseFloat(diff_y));
        }
        return $.bbq.pushState({
          x: new_center.x,
          y: new_center.y
        });
      };
      if (this.renderer.unsaved_changes) {
        Alcarin.Dialogs.Confirms.admin('You will lost all unsaved changes. Are you sure you want to continue?', function() {
          return btn_click();
        });
      } else {
        btn_click();
      }
      return false;
    };

    Editor.prototype.on_before_unload = function() {
      if (this.renderer.unsaved_changes) {
        return 'You lost your unsaved changes! You are sure?';
      }
    };

    Editor.prototype.on_fields_loaded = function(response) {
      this.renderer.canvas.parent().spin(false);
      if (response.success) {
        this.step_size = response.size;
        this.renderer.set_center(this.center.x, this.center.y);
        return this.renderer.redraw(response.size, response.fields);
      }
    };

    Editor.prototype.save_map = function(e) {
      var changes, map_c;
      map_c = this.renderer.canvas.closest('.map-viewport');
      map_c.disable(true).spin(true);
      this.toolbar.save_btn.disable();
      changes = $.map(this.renderer.changes, function(value, key) {
        return value;
      });
      return this.proxy.emit('fields.update', {
        fields: JSON.stringify(changes)
      });
    };

    Editor.prototype.on_fields_updated = function(response) {
      var map_c;
      if (response.success) {
        map_c = this.renderer.canvas.closest('.map-viewport');
        map_c.spin(false).enable(true, true);
        this.toolbar.save_btn.closest('.alert').fadeOut();
        this.renderer.unsaved_changes = false;
        return this.renderer.changes = {};
      }
    };

    Editor.prototype.init = function() {
      $(window).on('hashchange', this.onhashchange).on('beforeunload', this.on_before_unload);
      this.renderer.init();
      this.proxy.on('fields.loaded', this.on_fields_loaded);
      $('.map-viewport .btn').on('click', this.move_btn_click);
      this.proxy.on('fields.updated', this.on_fields_updated);
      this.toolbar.init();
      return this.toolbar.save_btn.click(this.save_map);
    };

    return Editor;

  })();
});
