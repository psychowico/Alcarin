'use strict';
var __slice = [].slice;

angular.module('@area-map').directive('alcAreaMap', function() {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var layers, painter;

      layers = [Alcarin.Map.Layers.Terrain];
      painter = new Alcarin.Map.Painter(element, layers);
      element.data('map-painter', painter);
      return ['terrain.update'].forEach(function(eventId) {
        return $scope.$on(eventId, function() {
          var args, ev;

          ev = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return painter.$broadcast.apply(painter, [eventId].concat(args));
        });
      });
    }
  };
});

/*
//@ sourceMappingURL=ngx-area-map.js.map
*/
