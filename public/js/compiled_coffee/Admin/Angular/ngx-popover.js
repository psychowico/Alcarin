'use strict';

namespace('Admin.Angular', function(exports, Alcarin) {
  return angular.module('@popover').directive('alcPopover', function() {
    return {
      restrict: 'A',
      scope: {
        _content: "@alcPopover"
      },
      link: function($scope, element, attrs) {
        $scope.$watch('_content', function(val) {
          return element.data('popover').options.content = val;
        });
        return element.popover();
      }
    };
  });
});
