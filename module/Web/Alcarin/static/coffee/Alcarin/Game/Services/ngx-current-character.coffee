'use strict'

namespace 'Alcarin.Game.Services', (exports, Alcarin) ->

    # factory returning promise of current playing character GameObject
    exports.module.factory 'CurrentCharacter', ['GameObjectFactory', (GameObjectFactory)->
        deferred = Q.defer()
        waitingId = deferred.promise

        charPromise = waitingId.then(GameObjectFactory).invoke('resolve')
        charPromise.init = (_charid)->
            deferred.resolve {type: 'char', id: _charid}

        return charPromise
    ]