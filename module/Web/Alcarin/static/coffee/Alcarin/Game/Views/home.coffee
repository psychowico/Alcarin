'use strict'

namespace 'Alcarin.Game.Views', (exports, Alcarin) ->

    exports.Home = ngcontroller ->

        @$on 'initialized', (ev, socket)->
            socket.on 'terrain.update', (fields)->
                console.log fields
            socket.emit 'terrain.fetch'