'use strict';

namespace('Alcarin.Angular', function(exports, Alcarin) {
  var module;
  module = angular.module('alc-proxy', ['ngResource']);
  return module.factory('alc-resource', [
    '$resource', function($res) {
      return function(uri, params, methods) {
        methods = $.extend(methods || {}, {
          create: {
            method: 'POST'
          },
          save: {
            method: 'PUT'
          }
        });
        return $res(uri, params, methods);
      };
    }
  ]);
});
