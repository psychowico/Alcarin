var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

namespace('Alcarin.Map', function(exports, Alcarin) {
  return exports.Painter = (function(_super) {
    __extends(Painter, _super);

    Painter.prototype.layers = [];

    Painter.prototype.$broadcast = function() {
      var args, layerInstance, name, _args, _i, _len, _ref, _results;

      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.layers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layerInstance = _ref[_i];
        if (layerInstance.$emit) {
          _args = [name].concat(args);
          _results.push(layerInstance.$emit.apply(layerInstance, _args));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    function Painter(element, layers) {
      var layerClass, layerInstance, _i, _len,
        _this = this;

      for (_i = 0, _len = layers.length; _i < _len; _i++) {
        layerClass = layers[_i];
        if (layerClass == null) {
          throw Error("Painter layer class not exists.");
        }
        layerInstance = new layerClass(element);
        if (layerInstance.$on) {
          layerInstance.$on('*', function(obj) {
            return _this.$emit.apply(_this, [obj.name].concat(obj.args));
          });
        }
        this.layers.push(layerInstance);
      }
    }

    return Painter;

  })(Alcarin.EventsEmitter);
});

/*
//@ sourceMappingURL=painter.js.map
*/
