'use strict';namespace('Alcarin.Game.Directives', function(exports, Alcarin) {
  return angular.module('@talk-input').directive('alcTalkingInput', function() {
    return {
      restrict: 'A',
      scope: {
        alcTalkingInput: '&'
      },
      link: function($scope, input, attrs) {
        return input.on('keydown', function(ev) {
          var content, wantSending;

          wantSending = ev.keyCode === 13 && !ev.shiftKey;
          if (wantSending) {
            ev.preventDefault();
            content = input.val();
            input.val('');
            return $scope.alcTalkingInput({
              $content: content
            });
          }
        });
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-talking-input.js.map
*/
