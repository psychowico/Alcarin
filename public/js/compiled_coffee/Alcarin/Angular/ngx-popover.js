'use strict';
namespace('Admin.Angular', function(exports, Alcarin) {
  return angular.module('@popover').directive('alcPopover', function() {
    return {
      restrict: 'A',
      scope: {
        _content: "@alcPopover"
      },
      link: function($scope, element, attrs) {
        console.log('param');
        $scope.$watch('_content', function(val) {
          console.log(val);
          return element.data('popover').options.content = val;
        });
        return element.popover();
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-popover.js.map
*/
