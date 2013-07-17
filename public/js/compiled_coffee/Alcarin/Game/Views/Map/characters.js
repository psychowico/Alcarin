'use strict';namespace('Alcarin.Game.Views.Map', function(exports, Alcarin) {
  return exports.Chars = ngcontroller([
    'GameServer', 'CurrentCharacter', 'CharEnvironment', 'MapBackground', function(GameServer, CurrentCharacter, CharEnvironment, MapBackground) {
      var _this = this;

      this.charslist = CharEnvironment.characters();
      return CurrentCharacter.then(function(current) {
        return current.$on('update-location', function() {
          return _this.redrawMap();
        });
      });
    }
  ]);
});

/*
//@ sourceMappingURL=characters.js.map
*/
