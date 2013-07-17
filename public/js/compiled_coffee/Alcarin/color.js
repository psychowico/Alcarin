namespace('Alcarin', function(exports, Alcarin) {
  return exports.Color = (function() {
    function Color() {}

    Color.hexToRGB = function(hex) {
      var result;

      result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    };

    Color.RGBToHex = function(rgb) {
      var cth;

      cth = function(c) {
        var hex;

        hex = c.toString(16);
        if (hex.length === 1) {
          return "0" + hex;
        } else {
          return hex;
        }
      };
      return "#" + cth(rgb.r + cth(rgb.g + cth(rgb.b)));
    };

    Color.intToRGB = function(color) {
      var c, cmp, i, _i, _len, _ref;

      c = {};
      _ref = ['r', 'g', 'b'];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        cmp = _ref[i];
        c[cmp] = (color >> (8 * (2 - i))) & 0xFF;
      }
      return c;
    };

    return Color;

  })();
});

/*
//@ sourceMappingURL=color.js.map
*/
