
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

    return Color;

  })();
});
