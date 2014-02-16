'use strict'

namespace 'Alcarin.Game.Views', (exports, Alcarin) ->

    exports.SimpleMenu = ngcontroller ['MapBackground', 'CurrentCharacter', 'GameServer',
        (MapBackground, CurrentChar, GameServer)->
            @playerOnPlot = false

            @togglePlace = =>
                if @playerOnPlot and not @toggleOutside()
                    GameServer.emit 'enter-place', @playerOnPlot

            MapBackground.$on 'swap', (map)=>
                CurrentChar.then (current)=>
                    plots = MapBackground.info.plots
                    key = plots.getKey current.loc
                    @playerOnPlot = plots.dict[key]
    ]
