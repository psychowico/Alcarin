'use strict'

namespace 'Alcarin.Game.Views', (exports, Alcarin) ->

    exports.AreaMap = ngcontroller ['GameServer', 'CurrentCharacter', '$q', '$safeApply', 'MapBackground',
        (GameServer, CurrentCharacter, $q, $safeApply, MapBackground)->

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
