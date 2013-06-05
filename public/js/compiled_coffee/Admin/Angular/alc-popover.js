'use strict';

namespace('Admin.Angular', function(exports, Alcarin) {
  return angular.module('alc-popover').directive('alcPopover', function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        return element.popover();
      }
    };
  });
});
