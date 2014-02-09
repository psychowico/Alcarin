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

            @_radiusDescr = ''
            @radiusWithUnits = =>
                if MapBackground.info?.radius?
                    km = MapBackground.info.radius / 10
                    @_radiusDescr = if km < 1 then "#{km*1000}m" else "#{km}km"
                return @_radiusDescr


            lastClick = new Date()
            @mapClicked = (ev)=>
                current = new Date()
                diff = (current.getTime() - lastClick.getTime()) / 1000
                # we can click one per second
                if diff > 1
                    @chooseClickType ev
                    lastClick = current

            @chooseClickType = (ev)=>
                target = $(ev.target).closest('.character,.place').data 'rel'
                MapBackground.dataReady().then (map)->
                    if not target?
                        offset = $(ev.currentTarget).offset()
                        x = ev.pageX - offset.left
                        y = ev.pageY - offset.top
                        target = map.units().toUnits x, y
                    CurrentCharacter.then (character)-> character.moveTo target

            # no idea how to get canvas size without breaking angularjs rules ;)
            # so threat it as exception.
            MapBackground.setPixelRadius $('.area-map canvas.terrain').width() / 2
    ]
