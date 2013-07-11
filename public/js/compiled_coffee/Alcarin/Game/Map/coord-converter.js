'use strict';namespace('Alcarin.Game.Map', function(exports, Alcarin) {
  var CoordConverter, deffered;

  CoordConverter = (function() {
    function CoordConverter(center, radius, pixelRadius) {
      this.center = center;
      this.radius = radius;
      this.pixelRadius = pixelRadius;
    }

    CoordConverter.prototype.toPixels = function(x, y) {
      var offset;

      offset = {
        x: this.center.x - this.radius,
        y: this.center.y - this.radius
      };
      return {
        x: Math.round((x - offset.x) * this.pixelRadius / this.radius),
        y: Math.round((y - offset.y) * this.pixelRadius / this.radius)
      };
    };

    CoordConverter.prototype.toUnits = function(pixelX, pixelY) {
      var offset;

      offset = {
        x: this.center.x - this.radius,
        y: this.center.y - this.radius
      };
      return {
        x: offset.x + Math.round(x * this.radius / this.pixelRadius),
        y: offset.y + Math.round(y * this.radius / this.pixelRadius)
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
//@ sourceMappingURL=coord-converter.js.map
*/
