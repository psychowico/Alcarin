'use strict';
namespace('Alcarin.Game.Views.Place', function(exports, Alcarin) {
  return exports.Default = ngcontroller([
    'GameServer', function(GameServer) {
      var TagTranslator;
      TagTranslator = Alcarin.Game.Tools.TagTranslator;
      GameServer.on('description.place', (function(_this) {
        return function(dList) {
          var tag;
          _this.description = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = dList.length; _i < _len; _i++) {
              tag = dList[_i];
              _results.push(TagTranslator(tag));
            }
            return _results;
          })();
          return console.log(_this.description);
        };
      })(this));
      return GameServer.emit('place.description');
    }
  ]);
});

/*
//@ sourceMappingURL=default.js.map
*/
