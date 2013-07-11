namespace 'Alcarin.Game.Map.Layers', (exports, Alcarin) ->

    class exports.CharViewRange extends Alcarin.EventsEmitter

        constructor: (element, @Services)->
            @table = $(element)

            GameServer = @Services.get 'GameServer'
            GameServer.on 'terrain.swap', @onTerrainSwap

        setTarget: (@characterPromise)->

        onTerrainSwap: (fields, radius, charViewRange)=>
            @characterPromise.done (character)=>
                @Services.get('CoordConverter').done (Coords)=>
                    shadowRadius = charViewRange * Coords.pixelRadius / Coords.radius
                    @shadow.remove() if @shadow?
                    @shadow = $ '<div>', {class: 'shadow'}
                    $child  = $ '<div>'
                    @shadow.append $child

                    center = character.loc
                    pos = Coords.toPixels center.x, center.y

                    @shadow.position {left: pos.x, top: pos.y}

                    $child.width 2 * shadowRadius
                    $child.height 2 * shadowRadius
                    $child.position {left: -shadowRadius, top: -shadowRadius}

                    @table.append @shadow