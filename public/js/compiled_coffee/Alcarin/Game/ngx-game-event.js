'use strict';namespace('Alcarin.Game', function(exports, Alcarin) {
  return angular.module('@game-event').directive('alcGameEvent', function() {
    return {
      restrict: 'A',
      scope: {
        alcGameEvent: '='
      },
      link: function($scope, element, attrs) {
        var ev, source, _i, _len, _ref, _results;

        _ref = $scope.alcGameEvent;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ev = _ref[_i];
          if ($.isPlainObject(ev)) {
            source = ev.__base;
            _results.push(element.append($('<a>', {
              text: ev.text,
              href: "#",
              'ng-click': function() {
                return console.log('test');
              }
            })));
          } else {
            _results.push(element.append($('<span>', {
              text: ev
            })));
          }
        }
        return _results;
      }
    };
  });
});

/*
//@ sourceMappingURL=ngx-game-event.js.map
*/
