'use strict'

namespace 'Alcarin.Game.Views', (exports, Alcarin) ->

    exports.SimpleMenu = ngcontroller ['MapBackground', 'CurrentCharacter'
        (MapBackground, CurrentChar)->
            @playerOnPlot = false

            MapBackground.$on 'swap', (map)=>
                CurrentChar.then (current)=>
                    plots = MapBackground.info.plots
                    key = plots.getKey current.loc
                    @playerOnPlot = plots.dict[key]
    ]
