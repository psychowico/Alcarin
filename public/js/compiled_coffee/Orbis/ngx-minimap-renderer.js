'use strict';

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  return angular.module('@minimap-renderer').directive('alcMinimapRenderer', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'A',
        link: function($scope, el, attrs) {
          var map,
            _this = this;
          map = new Alcarin.Orbis.MinimapRenderer(el);
          map.init();
          $scope.$on('mouse-enter-gateway', function(ev, x, y) {
            var flag, _ref;
            if ((_ref = el.data('flag')) != null) {
              _ref.destroy();
            }
            flag = map.create_flag(x, y);
            flag.drop(function(ev) {
              var coords, p;
              p = ev.position;
              coords = map.to_coords(p.left, p.top);
              return $rootScope.$broadcast('flag-updated', coords.x, coords.y);
            });
            el.data('flag', flag);
            return flag.show();
          });
          return $scope.$on('mouse-leave-gateway', function() {
            var _ref;
            if ((_ref = el.data('flag')) != null) {
              _ref.destroy();
            }
            return el.removeData('flag');
          });
        }
      };
    }
  ]);
});
