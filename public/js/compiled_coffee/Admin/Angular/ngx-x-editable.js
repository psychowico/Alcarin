'use strict';
namespace('Admin.Angular', function(exports, Alcarin) {
  $.fn.editable.defaults.ajaxOptions = {
    type: 'put',
    dataType: 'json'
  };
  return angular.module('@x-editable').directive('alcXEditable', function() {
    return {
      restrict: 'A',
      scope: {
        options: "&alcXEditable"
      },
      link: function($scope, element, attrs) {
        var options, _success;
        options = $scope.options();
        if (options.success) {
          _success = options.success;
          options.success = function(response, newVal) {
            if ($scope.$$phase) {
              return _success(response, newVal);
            } else {
              return $scope.$apply(function() {
                return _success(response, newVal);
              });
            }
          };
        }
        return element.editable(options);
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-x-editable.js.map
*/
