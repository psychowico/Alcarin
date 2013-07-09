'use strict';
var __slice = [].slice;

angular.module('@area-map', ['@game-services']).directive('alcAreaMap', [
  'GameServer', 'CurrentCharacter', function(GameServer, Character) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var layers, painter;

        Character.then(function(character) {
          return console.log(character);
        });
        layers = [Alcarin.Map.Layers.Terrain];
        painter = new Alcarin.Map.Painter(element, layers);
        element.data('map-painter', painter);
        return ['terrain.swap'].forEach(function(eventId) {
          return GameServer.on(eventId, function() {
            var args;

            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return painter.$broadcast.apply(painter, [eventId].concat(__slice.call(args)));
          });
        });
      }
    };
  }
]);

/*
//@ sourceMappingURL=ngx-area-map.js.map
*/
