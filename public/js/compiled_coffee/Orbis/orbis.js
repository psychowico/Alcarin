'use strict';
namespace('Alcarin.Orbis', function(exports, Alcarin) {
  angular.module('orbis', ['@popover', '@x-editable', '@gateways', '@minimap-renderer', '@animate', 'ui.event']).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/groups', {
        controller: Alcarin.Orbis.Gateways.List,
        templateUrl: urls.orbis.panel + '/__gateways-list'
      }).when('/gateway/edit/:gatewayid', {
        controller: Alcarin.Orbis.Gateways.Item,
        templateUrl: urls.orbis.panel + '/__gateway-edit'
      }).when('/gateway/new/:group', {
        controller: Alcarin.Orbis.Gateways.Item,
        templateUrl: urls.orbis.panel + '/__gateway-edit'
      }).otherwise({
        redirectTo: '/groups'
      });
    }
  ]);
  return exports.App = ngcontroller([
    '$routeParams', 'MapInfo', function(params, MapInfo) {
      var _this = this;
      this.active_group = 0;
      this.mapinfo = MapInfo();
      return this.$on('groupChanged', function(ev, group) {
        return _this.active_group = group;
      });
    }
  ]);
});

/*
//@ sourceMappingURL=orbis.js.map
*/
