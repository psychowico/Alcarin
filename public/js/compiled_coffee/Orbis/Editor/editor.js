namespace('Alcarin.Orbis.Editor', function(exports, Alcarin) {
  angular.module('orbis.editor', ['@slider', '@map-manager', '@spin', 'ui.event', '@disabled', '@color-picker']).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/x=:x&y=:y', {
        controller: exports.Editor
      }).otherwise({
        redirectTo: '/x=0&y=0'
      });
    }
  ]).factory('Map', [
    '$http', function($http) {
      return {
        fetch: function(_x, _y, callback) {
          var service;
          service = $http.get("" + urls.orbis.map + "/fetch-fields", {
            params: {
              x: _x,
              y: _y
            }
          }).then(function(response) {
            return response.data;
          });
          if (callback != null) {
            service.then(callback);
          }
          return service;
        },
        update: function(_fields, callback) {
          var changes;
          changes = $.map(_fields, function(value, key) {
            return value;
          });
          changes = JSON.stringify(changes);
          return $http({
            url: "" + urls.orbis.map + "/update-fields",
            method: 'POST',
            data: $.param({
              fields: changes
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(callback);
        }
      };
    }
  ]);
  exports.App = ngcontroller([
    '$route', '$window', function($r, $window) {
      var _this = this;
      this.mapsaving = false;
      this.has_changes = false;
      this.brush = {
        color: {
          r: 0,
          g: 128,
          b: 0
        },
        size: 4
      };
      this.$on('map.changed', function() {
        _this.has_changes = true;
        return _this.ignored_changes = false;
      });
      this.$on('map.reset', function() {
        return _this.ignored_changes = _this.has_changes = false;
      });
      $($window).on('beforeunload', function() {
        if (_this.has_changes) {
          return 'You lost your unsaved changes! You are sure?';
        }
      });
      return this.saveChanges = function() {
        _this.mapsaving = true;
        return _this.$broadcast('save.demand');
      };
    }
  ]);
  return exports.Map = ngcontroller([
    'Map', '$location', function(Map, $loc) {
      var _this = this;
      this.maploading = false;
      this.loc = {
        x: 0,
        y: 0
      };
      this.fields = [];
      this.step = 0;
      this.changes = {};
      this.$on('$locationChangeStart', function(ev) {
        if (_this.has_changes && !Alcarin.Dialogs.Confirms.admin('You lost your unsaved changes! You are sure?')) {
          return ev.preventDefault();
        }
      });
      this.$on('$routeChangeSuccess', function(e, route) {
        _this.loc.x = parseInt(route.params.x);
        _this.loc.y = parseInt(route.params.y);
        _this.$emit('map.reset');
        return _this.fetchFields();
      });
      this.dragMap = function(offsetx, offsety) {
        this.loc.x += Math.round(offsetx * (this.step - 1));
        this.loc.y += Math.round(offsety * (this.step - 1));
        if (this.loc != null) {
          return $loc.path("/x=" + this.loc.x + "&y=" + this.loc.y);
        }
      };
      this.fetchFields = function() {
        _this.maploading = true;
        return Map.fetch(_this.loc.x, _this.loc.y, function(result) {
          _this.step = result.size;
          _this.fields = result.fields;
          return _this.maploading = false;
        });
      };
      this.$on('save.demand', function() {
        return Map.update(_this.changes, function() {
          _this.$parent.mapsaving = false;
          return _this.$emit('map.reset');
        });
      });
      return this.mapChange = function() {
        return _this.$emit('map.changed');
      };
    }
  ]);
});

/*
//@ sourceMappingURL=editor.js.map
*/
