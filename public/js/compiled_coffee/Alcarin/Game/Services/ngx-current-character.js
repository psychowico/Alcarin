'use strict';namespace('Alcarin.Game.Services', function(exports, Alcarin) {
  return exports.module.factory('CurrentCharacter', [
    'GameObjectFactory', function(GameObjectFactory) {
      var charPromise, deferred, waitingId;

      deferred = Q.defer();
      waitingId = deferred.promise;
      charPromise = waitingId.then(GameObjectFactory).invoke('resolve');
      charPromise.init = function(_charid) {
        return deferred.resolve({
          type: 'char',
          id: _charid
        });
      };
      return charPromise;
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-current-character.js.map
*/
