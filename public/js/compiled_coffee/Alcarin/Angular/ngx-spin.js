'use strict';
namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('@spin').directive('alcSpin', function() {
    return {
      restrict: 'A',
      scope: false,
      link: function($scope, element, attrs) {
        return $scope.$watch(attrs.alcSpin, function(val) {
          return element.spin(val);
        });
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-spin.js.map
*/
