'use strict';namespace('Alcarin.Angular', function(exports, Alcarin) {
  var cthtml;

  cthtml = function(c) {
    return "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
  };
  return angular.module('@color-picker').directive('alcColorPicker', function() {
    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      link: function($scope, element, attrs) {
        var _this = this;

        element.data('color', cthtml($scope.ngModel));
        $scope.$watch('ngModel', function(val) {
          if (val != null) {
            return element.css('background-color', cthtml(val));
          }
        });
        element.colorpicker().on('hide', function(e) {
          var rgb;

          rgb = e.color.toRGB();
          delete rgb['a'];
          return $scope.$apply(function() {
            return $scope.ngModel = rgb;
          });
        });
        return element.colorpicker();
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-color-picker.js.map
*/
