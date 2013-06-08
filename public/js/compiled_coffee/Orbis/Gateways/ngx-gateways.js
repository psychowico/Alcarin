
namespace('Alcarin.Orbis.Gateways', function(exports, Alcarin) {
  return angular.module('@gateways', ['@proxy']).factory('GatewaysGroup', [
    'alc-resource', function($res) {
      var Group;
      Group = $res(urls.orbis.gatewaysgroups + '/:groupid', {
        groupid: '@id'
      });
      Group.prototype.displayname = function() {
        if (this.name === "0") {
          return 'Ungrouped';
        } else {
          return this.name;
        }
      };
      return Group;
    }
  ]).factory('Gateway', [
    'alc-resource', function($res) {
      return $res(urls.orbis.gateways + '/:id', {
        id: "@id"
      });
    }
  ]).factory('MapInfo', [
    '$http', function($http) {
      return function() {
        return $http.get("" + urls.orbis.map + "/get-info").then(function(response) {
          return response.data;
        });
      };
    }
  ]);
});
