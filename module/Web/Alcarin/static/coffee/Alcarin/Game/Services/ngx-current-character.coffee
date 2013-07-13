'use strict'

namespace 'Alcarin.Game.Services', (exports, Alcarin) ->

    Character = Alcarin.Game.Services.GameObject.Character

    # factory returning promise of current playing character GameObject
    exports.module.factory 'CurrentCharacter', ['GameObjectFactory', '$rootScope', '$q',
        (GameObjectFactory, $rootScope, $q)->
            deferred = $q.defer()
            waitingId = deferred.promise

            charPromise = waitingId.then(GameObjectFactory.character)
            charPromise.init = (_charid)->
                deferred.resolve _charid

            return charPromise
    ]