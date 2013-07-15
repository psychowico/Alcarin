'use strict'

namespace 'Alcarin.Game.Views', (exports, Alcarin) ->

    exports.AreaMap = ngcontroller ['GameServer', 'CurrentCharacter', '$q', '$safeApply', 'MapBackground',
        (GameServer, CurrentCharacter, $q, $safeApply, MapBackground)->

            lastClick = new Date()
            @mapClicked = (ev)=>
                current = new Date()
                diff = (current.getTime() - lastClick.getTime()) / 1000
                # we can click one per second
                if diff > 1
                    if MapBackground.isReady
                        MapBackground.then (units)->
                            target = units.toUnits ev.offsetX, ev.offsetY
                            CurrentCharacter.then (character)-> character.moveTo target
                    lastClick = current

            @redrawMap = =>
                $safeApply @, =>
                    MapBackground.reset()
                    GameServer.emit 'swap.all'

            GameServer.on 'terrain.swap', (terrain, info)=>
                CurrentCharacter.then (character)=>
                    MapBackground.init character.loc, info
                    MapBackground.setFields terrain

            # no idea how to get canvas size without breaking angularjs rules ;)
            # so threat it as exception.
            MapBackground.setPixelRadius $('.area-map canvas.terrain').width() / 2
    ]
