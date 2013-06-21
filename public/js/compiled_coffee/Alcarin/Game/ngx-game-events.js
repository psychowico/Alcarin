var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Game', function(exports, Alcarin) {
  var GameTime;

  angular.module('@game-events').factory('GameEvents', [
    '$http', function($http) {
      var GameEvents;

      GameEvents = (function() {
        function GameEvents() {
          this.talk = __bind(this.talk, this);
          this.fetch = __bind(this.fetch, this);
          this.init = __bind(this.init, this);
        }

        GameEvents.prototype.init = function(charid) {
          return this.charid = charid;
        };

        GameEvents.prototype._meth = function(action, _data) {
          if (_data != null) {
            return $http({
              url: "" + urls.game.character.events + "/" + this.charid + "/" + action,
              method: 'POST',
              data: $.param(_data),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            });
          } else {
            return $http.get("" + urls.game.character.events + "/" + this.charid + "/" + action);
          }
        };

        GameEvents.prototype.fetch = function() {
          return this._meth('fetch');
        };

        GameEvents.prototype.talk = function(_content) {
          return this._meth('publicTalk', {
            content: _content
          });
        };

        return GameEvents;

      })();
      return new GameEvents();
    }
  ]).filter('EventTime', function() {
    return function(time) {
      var _time;

      if (isNaN(time)) {
        return time;
      }
      _time = new GameTime(time);
      return _time.print_long();
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
//@ sourceMappingURL=ngx-game-events.js.map
*/
