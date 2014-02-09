'use strict';
namespace('Alcarin.Game.Views.Map', function(exports, Alcarin) {
  return exports.Chars = ngcontroller([
    'CurrentCharacter', 'CharEnvironment', function(CurrentCharacter, CharEnvironment) {
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
