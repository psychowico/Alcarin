'use strict';
namespace('Alcarin.Game.Views.Place', function(exports, Alcarin) {
  return exports.Default = ngcontroller([
    'GameServer', 'CurrentCharacter', function(GameServer, CurrentChar) {
      var TagTranslator;
      TagTranslator = Alcarin.Game.Tools.TagTranslator;
      return CurrentChar.then((function(_this) {
        return function(currentChar) {
          _this.leavePlace = function() {
            if (_this.toggleOutside()) {
              return GameServer.emit('leave-place');
            }
          };
          GameServer.on('description.place', function(dList) {
            var tag;
            return _this.description = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = dList.length; _i < _len; _i++) {
                tag = dList[_i];
                _results.push(TagTranslator(tag));
              }
              return _results;
            })();
          });
          return GameServer.emit('place.description');
        };
      })(this));
    }
  ]);
});

/*
//@ sourceMappingURL=default.js.map
*/
