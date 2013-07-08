'use strict';namespace('Alcarin.Orbis', function(exports, Alcarin) {
  return angular.module('@map-manager').directive('alcMapManager', [
    '@EventsBus', function(EventsBus) {
      return {
        restrict: 'A',
        scope: {
          onMapChange: '&mapChange',
          changes: '=mapChanges',
          mapFields: '=',
          mapCenter: '=',
          mapSize: '=',
          mapBrush: '='
        },
        link: function($scope, canvas, attrs) {
          var painter, plugins;

          plugins = [Admin.Map.Layers.EditableTerrain];
          painter = new Alcarin.Map.Painter(canvas, plugins);
          canvas.data('map-painter', painter);
          painter.$on('changes-confirmed', function() {
            if ($scope.$$phase) {
              return $scope.onMapChange();
            } else {
              return $scope.$apply(function() {
                return $scope.onMapChange();
              });
            }
          });
          painter.$on('field-changed', function(field, data) {
            return $scope.changes["" + field.x + "," + field.y] = data;
          });
          $scope.$watch('mapFields', function(val) {
            if ((val != null) && $scope.mapSize > 0) {
              painter.$broadcast('set-center', $scope.mapCenter.x, $scope.mapCenter.y);
              return painter.$broadcast('fields-fetched', $scope.mapSize, val);
            }
          });
          return $scope.$watch('mapBrush', function(brush) {
            return painter.$broadcast('brush-changed', brush);
          });
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-map-manager.js.map
*/
