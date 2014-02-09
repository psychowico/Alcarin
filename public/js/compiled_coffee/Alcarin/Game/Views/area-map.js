'use strict';
namespace('Alcarin.Game.Views', function(exports, Alcarin) {
  return exports.AreaMap = ngcontroller([
    'GameServer', 'CurrentCharacter', '$q', '$safeApply', 'MapBackground', function(GameServer, CurrentCharacter, $q, $safeApply, MapBackground) {
      var lastClick;
      this.showGreatTower = true;
      this.showMoveTarget = true;
      this.showChars = true;
      this.showEyeRange = true;
      this.redrawMap = (function(_this) {
        return function() {
          return $safeApply(_this, function() {
            MapBackground.reset();
            return GameServer.emit('swap.all');
          });
        };
      })(this);
      this.toggleZoomMap = (function(_this) {
        return function() {
          _this.zoomMap = !_this.zoomMap;
          return MapBackground.enableZoom(_this.zoomMap);
        };
      })(this);
      this._radiusDescr = '';
      this.radiusWithUnits = (function(_this) {
        return function() {
          var km, _ref;
          if (((_ref = MapBackground.info) != null ? _ref.radius : void 0) != null) {
            km = MapBackground.info.radius / 10;
            _this._radiusDescr = km < 1 ? "" + (km * 1000) + "m" : "" + km + "km";
          }
          return _this._radiusDescr;
        };
      })(this);
      lastClick = new Date();
      this.mapClicked = (function(_this) {
        return function(ev) {
          var current, diff;
          current = new Date();
          diff = (current.getTime() - lastClick.getTime()) / 1000;
          if (diff > 1) {
            _this.chooseClickType(ev);
            return lastClick = current;
          }
        };
      })(this);
      this.chooseClickType = (function(_this) {
        return function(ev) {
          var target;
          target = $(ev.target).closest('.character,.place').data('rel');
          return MapBackground.dataReady().then(function(map) {
            var offset, x, y;
            if (target == null) {
              offset = $(ev.currentTarget).offset();
              x = ev.pageX - offset.left;
              y = ev.pageY - offset.top;
              target = map.units().toUnits(x, y);
            }
            return CurrentCharacter.then(function(character) {
              return character.moveTo(target);
            });
          });
        };
      })(this);
      return MapBackground.setPixelRadius($('.area-map canvas.terrain').width() / 2);
    }
  ]);
});

/*
//@ sourceMappingURL=area-map.js.map
*/
