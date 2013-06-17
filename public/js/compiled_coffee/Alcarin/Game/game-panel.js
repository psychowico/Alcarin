'use strict';

namespace('Alcarin.Game', function(exports, Alcarin) {
  angular.module('game-panel');
  return exports.GameEvents = ngcontroller(function() {
    return this.events = [
      {
        text: 'test1'
      }, {
        text: 'test2'
      }
    ];
  });
});
