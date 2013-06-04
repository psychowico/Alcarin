
namespace('Alcarin.Orbis.Gateways', function(exports, Alcarin) {
  return angular.module('ng-gateways', ['ngResource']).factory('GatewaysGroup', [
    '$resource', function($resource) {
      var Group;
      Group = $resource(urls.orbis.gatewaysgroups + '/:groupid', {
        groupid: '@id'
      }, {
        create: {
          method: 'POST'
        },
        save: {
          method: 'PUT'
        }
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
    '$resource', function($resource) {
      return $resource(urls.orbis.gateways + '/:id');
    }
  ]);
});
