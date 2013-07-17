'use strict'

namespace 'Alcarin.Game.Views', (exports, Alcarin) ->

    exports.AreaMap = ngcontroller ['GameServer', 'CurrentCharacter', '$q', '$safeApply', 'MapBackground',
        (GameServer, CurrentCharacter, $q, $safeApply, MapBackground)->
            @showGreatTower = true
            @showMoveTarget = true
            @showChars      = true
            @showEyeRange   = true

            @redrawMap = =>
                $safeApply @, =>
                    MapBackground.reset()
                    GameServer.emit 'swap.all'

            @toggleZoomMap = =>
                @zoomMap = !@zoomMap
                MapBackground.enableZoom @zoomMap

            @radiusWithUnits = =>
                if MapBackground.radius
                    km = MapBackground.radius / 10
                    return "#{km*1000}m" if km < 1
                    return "#{km}km"


            lastClick = new Date()
            @mapClicked = (ev)=>
                current = new Date()
                diff = (current.getTime() - lastClick.getTime()) / 1000
                # we can click one per second
                if diff > 1
                    MapBackground.dataReady().then (map)->
                        target = map.units().toUnits ev.offsetX, ev.offsetY
                        CurrentCharacter.then (character)-> character.moveTo target
                    lastClick = current

            # no idea how to get canvas size without breaking angularjs rules ;)
            # so threat it as exception.
            MapBackground.setPixelRadius $('.area-map canvas.terrain').width() / 2
    ]
