'use strict';namespace('Alcarin.Game.Services', function(exports, Alcarin) {
  var Character;

  Character = Alcarin.Game.Services.GameObject.Character;
  return exports.module.factory('CurrentCharacter', [
    'CharEnvironment', '$rootScope', '$q', function(CharEnvironment, $rootScope, $q) {
      var charPromise, deferred, waitingId;

      deferred = $q.defer();
      waitingId = deferred.promise;
      charPromise = waitingId.then(CharEnvironment.character);
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
