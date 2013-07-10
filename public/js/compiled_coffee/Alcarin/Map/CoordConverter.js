'use strict';namespace('Alcarin.Map', function(exports, Alcarin) {
  var CoordConverter, deffered;

  CoordConverter = (function() {
    function CoordConverter(center, radius, pixelRadius) {
      this.center = center;
      this.radius = radius;
      this.pixelRadius = pixelRadius;
    }

    CoordConverter.prototype.toPixels = function(x, y) {};

    CoordConverter.prototype.toUnits = function(pixelX, pixelY) {
      var offset;

      offset = {
        x: this.center - this.radius,
        y: this.center - this.radius
      };
      return {
        x: offset.x + Math.round(x * 2 * this.radius / this.pixelRadius),
        y: offset.y + Math.round(y * 2 * this.radius / this.pixelRadius)
      };
    };

    return CoordConverter;

  })();
  deffered = Q.defer();
  exports.CoordConverter = deffered.promise;
  return exports.CoordConverter.init = function(center, radius, pixelRadius) {
    var converter;

    converter = new CoordConverter(center, radius, pixelRadius);
    return deffered.resolve(converter);
  };
});

/*
//@ sourceMappingURL=CoordConverter.js.map
*/
