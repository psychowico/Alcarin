'use strict'

namespace 'Alcarin.Game.Views', (exports, Alcarin) ->

    exports.Home = ngcontroller ['GameServer', (GameServer)->

        GameServer.on 'terrain.swap', (data)->
            console.log data
    ]