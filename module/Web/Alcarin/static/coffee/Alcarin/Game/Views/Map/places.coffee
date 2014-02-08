'use strict'

namespace 'Alcarin.Game.Views.Map', (exports, Alcarin) ->

    exports.Places = ngcontroller ['MapBackground',
        (MapBackground)->
            @placesList = []

            # we need "avarage" places position too, for "home" icon on map
            MapBackground.dataReady().then (map)=>
                plots = map.info.plots
                table = {}
                getKey = (loc)-> Math.floor(loc.x) + ';' + Math.floor(loc.y)
                places = {}
                for place, _plots of plots.data
                    x = 0
                    y = 0
                    for plot in _plots
                        x += plot.loc.x
                        y += plot.loc.y
                    x /= _plots.length
                    y /= _plots.length
                    places[place] =
                        loc: {x: x, y: y}
                @placesList = places

            # CurrentCharacter.then (current)=>
            #     # when current chacater is changed, we need redraw full map
            #     current.$on 'update-location', => @redrawMap()
    ]
