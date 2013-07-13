'use strict';namespace('Alcarin.Game.Services', function(exports, Alcarin) {
  var Character;

  Character = Alcarin.Game.Services.GameObject.Character;
  return exports.module.factory('CurrentCharacter', [
    'GameObjectFactory', '$rootScope', '$q', function(GameObjectFactory, $rootScope, $q) {
      var charPromise, deferred, waitingId;

      deferred = $q.defer();
      waitingId = deferred.promise;
      charPromise = waitingId.then(GameObjectFactory.character);
      charPromise.init = function(_charid) {
        return deferred.resolve(_charid);
      };
      return charPromise;
    }
  ]);
});

/*
//@ sourceMappingURL=ngx-current-character.js.map
*/
