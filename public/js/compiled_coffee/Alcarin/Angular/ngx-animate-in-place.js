'use strict';

namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('@animate').directive('alcAnimateInPlace', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        return $scope.$on('$viewContentLoaded', function() {
          return element.children().css({
            position: 'absolute',
            left: '0',
            right: '0'
          });
        });
      }
    };
  });
});
