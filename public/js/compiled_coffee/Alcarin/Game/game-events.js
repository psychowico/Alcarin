'use strict';namespace('Alcarin.Game', function(exports, Alcarin) {
  var GameTime;

  exports.GameEvents = ngcontroller([
    'GameServer', 'GameEventsTranslator', function(GameServer, Translate) {
      var _this = this;

      this.gameEvents = null;
      this.sending = false;
      GameServer.on('reset-events', function(data) {
        var ev;

        return _this.gameEvents = (function() {
          var _i, _len, _results;

          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            ev = data[_i];
            _results.push(Translate(ev));
          }
          return _results;
        })();
      });
      GameServer.on('game-event', function(evData) {
        var gameEvent;

        gameEvent = Translate(evData);
        _this.gameEvents.splice(0, 0, gameEvent);
        if (evData.response) {
          return _this.sending = false;
        }
      });
      this.talkToAll = function(content) {
        if (content.length === 0) {
          return;
        }
        _this.sending = true;
        return GameServer.emit('public-talk', content);
      };
      return this.charClicked = function(_char) {
        return _char.resolve().then(function(c) {
          return console.log(c);
        });
      };
    }
  ]);
  Alcarin.Game.module.filter('EventTime', function() {
    return function(time) {
      var _time;

      if (isNaN(time)) {
        return time;
      }
      _time = new GameTime(time);
      return _time.print_long();
    };
  }).factory('GameEventsTranslator', function() {
    var reg;

    reg = /%([0-9])+/g;
    return function(gameEvent) {
      var arg, arg_index, fArg, match, offset, output, pre_text, _text;

      _text = gameEvent.text;
      output = [];
      offset = 0;
      while (match = reg.exec(_text)) {
        arg_index = parseInt(match[1]);
        arg = gameEvent.args[arg_index];
        if ($.isPlainObject(arg)) {
          fArg = $.extend({
            text: arg.text
          }, arg.__base);
          Alcarin.GameObject.Factory(fArg);
        } else {
          fArg = {
            text: arg,
            type: 'text'
          };
        }
        pre_text = _text.substr(offset, match.index);
        if (pre_text.length > 0) {
          output.push({
            text: pre_text,
            type: 'text'
          });
        }
        output.push(fArg);
        _text = _text.substr(match.index + match[0].length);
      }
      return {
        body: output,
        time: gameEvent.time
      };
    };
  });
  return GameTime = (function() {
    var pad;

    GameTime.resolved = false;

    pad = function(number) {
      if (number < 10) {
        return "0" + number;
      }
      return number + '';
    };

    function GameTime(timestamp) {
      this.timestamp = timestamp;
    }

    GameTime.prototype._resolve = function() {
      if (this.resolved) {
        return true;
      }
      this.day = Math.floor(this.timestamp / 345600);
      this.hour = pad(Math.floor((this.timestamp % 345600) / 3600));
      this.min = pad(Math.floor((this.timestamp % 3600) / 60));
      this.sec = pad(this.timestamp % 60);
      return this.resolved = true;
    };

    GameTime.prototype.print_short = function() {
      this._resolve();
      return "" + this.hour + ":" + this.min + ":" + this.sec;
    };

    GameTime.prototype.print_long = function() {
      this._resolve();
      return "" + this.day + " - " + this.hour + ":" + this.min + ":" + this.sec;
    };

    return GameTime;

  })();
});

/*
//@ sourceMappingURL=game-events.js.map
*/
