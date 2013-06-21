'use strict';
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  var canvas_events;

  canvas_events = function($scope, map, element) {
    var events;

    events = (function() {
      function events() {
        this.mouse_painting = __bind(this.mouse_painting, this);
        this.mouse_move = __bind(this.mouse_move, this);
        this.mouse_up = __bind(this.mouse_up, this);
        this.mouse_down = __bind(this.mouse_down, this);
      }

      events.prototype.mouse_down = function(e) {
        if ($(e.currentTarget).disabled()) {
          return false;
        }
        element.on('mousemove', this.mouse_painting);
        return this.mouse_painting(e);
      };

      events.prototype.mouse_up = function() {
        return element.off('mousemove', this.mouse_painting);
      };

      events.prototype.mouse_move = function(e) {
        return map.draw_shadow({
          x: e.offsetX,
          y: e.offsetY
        }, $scope.mapBrush);
      };

      events.prototype.mouse_painting = function(e) {
        var brush, coords, ox, oy, range, range_2, _i, _j;

        coords = map.pixels_to_coords(e.offsetX, e.offsetY);
        brush = $scope.mapBrush;
        if (brush.size > 1) {
          range = brush.size - 1;
          range_2 = range * range;
          for (oy = _i = -range; -range <= range ? _i <= range : _i >= range; oy = -range <= range ? ++_i : --_i) {
            for (ox = _j = -range; -range <= range ? _j <= range : _j >= range; ox = -range <= range ? ++_j : --_j) {
              if (oy * oy + ox * ox <= range_2) {
                map.put_field(coords.x + ox, coords.y + oy, brush);
              }
            }
          }
        } else {
          map.put_field(coords.x, coords.y, brush);
        }
        return map.confirm_changes();
      };

      return events;

    })();
    return new events();
  };
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
          var ev, map;

          map = new Alcarin.Orbis.Editor.MapManager($scope, canvas);
          map.init();
          map.change_happen = function() {
            if ($scope.$$phase) {
              return $scope.onMapChange();
            } else {
              return $scope.$apply(function() {
                return $scope.onMapChange();
              });
            }
          };
          $scope.$watch('mapFields', function(val) {
            if ((val != null) && $scope.mapSize > 0) {
              map.set_center($scope.mapCenter.x, $scope.mapCenter.y);
              return map.redraw($scope.mapSize, val);
            }
          });
          ev = canvas_events($scope, map, canvas.parent());
          canvas.parent().on('mousedown', ev.mouse_down).on('mousemove', ev.mouse_move);
          return $(document).on('mouseup', ev.mouse_up);
        }
      };
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-map-manager.js.map
*/
