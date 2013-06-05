'use strict';

namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('alc-chosen').directive('alcChosenWatch', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var model;
        model = attrs['ngModel'];
        $scope.$watch(attrs['alcChosenWatch'], function() {
          return element.trigger('liszt:updated');
        });
        return $scope.$watch(model, function() {
          return element.trigger("liszt:updated");
        });
      }
    };
  });
});
