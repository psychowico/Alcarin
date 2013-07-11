'use strict';namespace('Alcarin.Game.Map', function(exports, Alcarin) {
  var MapAreaServices;

  MapAreaServices = (function() {
    function MapAreaServices() {}

    MapAreaServices.prototype.services = {};

    MapAreaServices.prototype.set = function(key, service) {
      return this.services[key] = service;
    };

    MapAreaServices.prototype.get = function(key) {
      if (this.services[key]) {
        return this.services[key];
      }
    };

    return MapAreaServices;

  })();
  return angular.module('@area-map', ['@game-services']).directive('alcAreaMap', [
    'GameServer', 'CurrentCharacter', function(GameServer, Character) {
      return {
        restrict: 'A',
        link: function($scope, element, attrs) {
          return $(function() {
            var mapLayers, painter, services;

            mapLayers = [Alcarin.Game.Map.Layers.Terrain, Alcarin.Game.Map.Layers.CharViewRange, Alcarin.Game.Map.Layers.Characters];
            services = new MapAreaServices();
            services.set('GameServer', GameServer);
            services.set('CoordConverter', Alcarin.Game.Map.CoordConverter);
            painter = new Alcarin.Map.Painter(element, mapLayers, services);
            painter.setTarget(Character);
            return element.data('map-painter', painter);
          });
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-area-map.js.map
*/
