'use strict'

namespace 'Alcarin.Game.Views', (exports, Alcarin) ->

    exports.Home = ngcontroller ['GameServer', (GameServer)->
        @mainDescription = ''

        GameServer.on 'descriptions.swap', (descr)=>
            @mainDescription = descr
    ]
