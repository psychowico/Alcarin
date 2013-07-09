namespace 'Alcarin.Map.Layers', (exports, Alcarin) ->

    class exports.Terrain extends Alcarin.EventsEmitter
        background: [0, 0, 255]

        constructor: (element)->
            @table = $(element)
            @table.append @prepareCanvas()

            @$on 'terrain.swap', @onTerrainSwap

        width: -> @canvas[0]?.width
        height: -> @canvas[0]?.height

        setTarget: (@charPromise)->

        prepareCanvas: ->
            if @canvas
                @context = null
                @canvas.remove()

            @canvas  = $ '<canvas>'
            $.extend @canvas[0], {width: @table.width(), height: @table.height()}

            @context = @canvas[0].getContext '2d'

            bg = @background
            @context.fillStyle = "rgb(#{bg[0]}, #{bg[1]}, #{bg[2]})";
            @context.fillRect 0, 0, @width(), @height()

            $(@context).disableSmoothing()

            return @canvas

        onTerrainSwap: (radius, fields)->
            @charPromise.then (character)->
                console.log 'tutaj'
                console.log radius
            # image_data = @context.getImageData 0, 0, size, size

            # offset = {x: @center.x - size / 2, y: @center.y - size / 2}

            # for field in fields
            #     color = field.land.color

            #     _x = field.loc.x - offset.x
            #     _y = field.loc.y - offset.y

            #     mod = Math.abs @noise().get field.loc.x / @noise_density, field.loc.y / @noise_density

            #     _offset = 4 * (_y * size + _x)

            #     for i in [0..2]
            #         c = ((color >> (8 * (2 - i) ) ) & 0xFF)
            #         @plain_colors[_offset + i] = c

            #         c *= 1 - @noise_impact * ( 1 - mod )
            #         image_data.data[_offset + i] = ~~c

            # @_buffer_to_front true
            # @init_foreground()
            # @unsaved_changes = false