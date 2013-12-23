'use strict';
namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('@disabled').directive('alcDisabled', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        return $scope.$watch(attrs.alcDisabled, function(val) {
          return element.enable(!val, true);
        });
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-disabled.js.map
*/
