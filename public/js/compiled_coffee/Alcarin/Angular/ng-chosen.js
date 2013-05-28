'use strict';

namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('ng-chosen').directive('ngChosenWatch', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var model;
        model = attrs['ngModel'];
        $scope.$watch(attrs['ngChosenWatch'], function() {
          return element.trigger('liszt:updated');
        });
        return $scope.$watch(model, function() {
          return element.trigger("liszt:updated");
        });
      }
    };
  });
});
