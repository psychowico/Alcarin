'use strict';

namespace('Admin.Angular', function(exports, Alcarin) {
  return angular.module('ng-popover').directive('ngPopover', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        return element.popover();
      }
    };
  });
});
