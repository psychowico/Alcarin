'use strict';
namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('@slider').directive('jslider', function() {
    return {
      restrict: 'E',
      scope: {
        options: '&',
        value: '='
      },
      link: function($scope, element, attrs) {
        var options;
        element.addClass('slider');
        options = $.extend({
          change: function(e, ui) {
            if ($scope.$parent.$$phase) {
              return $scope.value = ui.value;
            } else {
              return $scope.$apply(function() {
                return $scope.value = ui.value;
              });
            }
          }
        }, $scope.options());
        $scope.$watch('value', function(_val) {
          if (_val != null) {
            return element.slider('value', _val);
          }
        });
        return element.slider(options);
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-slider.js.map
*/
