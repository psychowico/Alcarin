'use strict';namespace('Alcarin.Game.Views.Map', function(exports, Alcarin) {
  return exports.Chars = ngcontroller([
    'GameServer', 'CurrentCharacter', 'CharEnvironment', 'MapBackground', function(GameServer, CurrentCharacter, CharEnvironment, MapBackground) {
      var _this = this;

      this.charslist = {};
      GameServer.on('chars.swap', function(chars) {
        return MapBackground.then(function(units) {
          var _char, _i, _len, _results;

          _this.charslist = {};
          _results = [];
          for (_i = 0, _len = chars.length; _i < _len; _i++) {
            _char = chars[_i];
            _char.pixelLoc = units.toPixels(_char.loc.x, _char.loc.y);
            _char.type = 'char';
            _results.push(CharEnvironment.character(_char).then(function(obj) {
              return _this.charslist[obj._id] = obj;
            }));
          }
          return _results;
        });
      });
      return GameServer.on('game-event.add', function(gameEvent) {
        var applyCurrentChar, charid, currentid, loc, _char;

        if (gameEvent.system && gameEvent.id === 'char.update') {
          currentid = _this.charid;
          charid = gameEvent.args[0];
          loc = gameEvent.args[1];
          applyCurrentChar = currentid === charid;
          if (applyCurrentChar) {
            return CurrentCharacter.then(function(current) {
              current.loc = loc;
              return _this.redrawMap();
            });
          } else {
            _char = _this.charslist[charid];
            _char.loc = loc;
            return MapBackground.then(function(units) {
              return _char.pixelLoc = units.toPixels(_char.loc.x, _char.loc.y);
            });
          }
        }
      });
    }
  ]);
});

/*
//@ sourceMappingURL=characters.js.map
*/
