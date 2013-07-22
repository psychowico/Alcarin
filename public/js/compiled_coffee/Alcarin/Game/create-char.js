'use strict';namespace('Alcarin.Game', function(exports, Alcarin) {
  angular.module('create-char', ['ui.event']);
  return exports.CreateChar = ngcontroller(function() {
    var _this = this;

    return this.mouseMove = function(ev) {
      var $target;

      $target = $(ev.target);
      if ($target.hasClass('radio')) {
        $target = $target.children('input');
      }
      return _this.hover = $target.data('descr');
    };
  });
});

/*
//@ sourceMappingURL=create-char.js.map
*/
