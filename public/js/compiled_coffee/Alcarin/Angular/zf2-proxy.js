'use strict';

namespace('Alcarin.Angular', function(exports, Alcarin) {
  var module;
  module = angular.module('zf2-proxy');
  return module.factory('ZF2Action', [
    '$http', function($http) {
      return function($uri) {
        var zf2action, zf2query;
        zf2query = function(_action, _params, _callback) {
          var result, _url;
          _url = "" + $uri + "/" + _action;
          _params.url = _url;
          result = $http(_params);
          if (_callback) {
            return result.success(_callback);
          }
          return result.then(function(response) {
            return response.data;
          });
        };
        zf2action = function(_action, _data, _callback) {
          return zf2action.get.call(zf2action, _action, _data, _callback);
        };
        zf2action.get = function(_action, _data, _callback) {
          return zf2query(_action, {
            method: 'GET',
            params: _data
          }, _callback);
        };
        zf2action.post = function(_action, _data, _callback) {
          return zf2query(_action, {
            method: 'POST',
            data: $.param(_data),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }, _callback);
        };
        return zf2action;
      };
    }
  ]);
});
