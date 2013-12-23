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

    Color.RGBToInt = function(rgb) {
      return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
    };

    Color.mix = function(color1, color2, percentage) {
      if (percentage == null) {
        percentage = 0.5;
      }
      return {
        r: (1 - percentage) * color1.r + color2.r * percentage,
        g: (1 - percentage) * color1.g + color2.g * percentage,
        b: (1 - percentage) * color1.b + color2.b * percentage
      };
    };

    return Color;

  })();
});

/*
//@ sourceMappingURL=color.js.map
*/
