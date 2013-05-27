'use strict';

namespace('Alcarin.Angular', function(exports, Alcarin) {
  var module;
  module = angular.module('zf2-proxy');
  return module.factory('ZF2Action', [
    '$http', function($http) {
      return function($uri) {
        return function(_action, _data) {
          var _url;
          _url = "" + $uri + "/" + _action;
          return $http({
            method: 'POST',
            url: _url,
            data: $.param(_data),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(function(response) {
            return response.data;
          });
        };
      };
    }
  ]);
});
