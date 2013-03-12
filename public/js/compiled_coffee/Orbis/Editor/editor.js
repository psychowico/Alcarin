var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis.Editor', function(exports, Alcarin) {
  return exports.Editor = (function() {

    function Editor(base) {
      var canvas;
      this.base = base;
      this.on_fields_loaded = __bind(this.on_fields_loaded, this);

      this.proxy = new Alcarin.EventProxy(urls.orbis.map);
      this.center = {
        x: this.base.data('center-x'),
        y: this.base.data('center-y')
      };
      canvas = this.base.find('canvas');
      this.renderer = new Alcarin.Orbis.Editor.MapRenderer(canvas, this.center.x, this.center.y);
    }

    Editor.prototype.on_fields_loaded = function(response) {
      return this.renderer.redraw(response.size, response.fields);
    };

    Editor.prototype.init = function() {
      this.renderer.init();
      this.proxy.on('fields.loaded', this.on_fields_loaded);
      return this.proxy.emit('fields.fetch', {
        x: this.center.x,
        y: this.center.y
      });
    };

    return Editor;

  })();
});
