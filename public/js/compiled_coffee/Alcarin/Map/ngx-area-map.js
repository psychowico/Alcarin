'use strict';namespace('Alcarin.Map', function(exports, Alcarin) {
  var MapAreaServices, mapLayers;

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
  mapLayers = [Alcarin.Map.Layers.Terrain, Alcarin.Map.Layers.CharViewRange, Alcarin.Map.Layers.Characters];
  return angular.module('@area-map', ['@game-services']).directive('alcAreaMap', [
    'GameServer', 'CurrentCharacter', function(GameServer, Character) {
      return {
        restrict: 'A',
        link: function($scope, element, attrs) {
          var painter, services;

          services = new MapAreaServices();
          services.set('GameServer', GameServer);
          services.set('CoordConverter', Alcarin.Map.CoordConverter);
          painter = new Alcarin.Map.Painter(element, mapLayers, services);
          painter.setTarget(Character);
          return element.data('map-painter', painter);
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-area-map.js.map
*/
