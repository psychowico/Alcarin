namespace 'Alcarin.Game.Map.Layers', (exports, Alcarin) ->

    NOISE_DENSITY = 25
    NOISE_IMPACT  = 0.22
    noise         = new ROT.Noise.Simplex()

    class exports.Terrain extends Alcarin.EventsEmitter
        background: [0, 0, 255]

        constructor: (element, @Services)->
            @table = $(element)
            @table.append @prepareCanvas()

            GameServer = @Services.get 'GameServer'
            GameServer.on 'terrain.swap', @onTerrainSwap

        width: -> @canvas[0]?.width
        height: -> @canvas[0]?.height

        setTarget: (@charPromise)->

        prepareCanvas: ->
            if @canvas
                @context = null
                @canvas.remove()

            @canvas  = $ '<canvas>', {class: 'terrain'}

            pixelSize = @table.width() + 5
            $.extend @canvas[0], {width: pixelSize, height: pixelSize}

            @context = @canvas[0].getContext '2d'

            bg = @background
            @context.fillStyle = "rgb(#{bg[0]}, #{bg[1]}, #{bg[2]})";
            @context.fillRect 0, 0, @width(), @height()

            $(@context).disableSmoothing()

            return @canvas

        getBackbuffer: (sizeW, sizeH)->
            @backbuffer?.remove()

            @backbuffer = $ '<canvas>'
            $.extend @backbuffer[0], {width: sizeW, height: sizeH}
            @backbufferContext = @backbuffer[0].getContext '2d'
            $(@backbufferContext).disableSmoothing()

            @backbufferContext.fillStyle = "rgb(0, 0, 255)";
            @backbufferContext.fillRect 0, 0, sizeW, sizeH
            @backbufferContext

        swapBuffer: ->
            @context.save()
            w = @backbuffer[0].width
            h = @backbuffer[0].height
            @context.drawImage @backbuffer[0], 0, 0, w, h, 0, 0, @width(), @height()
            @context.restore()

        onTerrainSwap: (fields, radius)=>
            @charPromise.done (character)=>
                center        = character.loc
                size          = radius * 2
                bufferContext = @getBackbuffer size, size

                @Services.get('CoordConverter').init center, radius, @width() / 2

                imageData = bufferContext.getImageData 0, 0, size, size
                offset = {x: center.x - radius, y: center.y - radius}

                # canvasTitle = "View radius: #{radius / 10}km"
                # @canvas.parent().tooltip {title: canvasTitle, placement: 'bottom'}

                for field in fields
                    color = field.land.color

                    pixelX = field.loc.x - offset.x
                    pixelY = field.loc.y - offset.y

                    mod = Math.abs noise.get field.loc.x / NOISE_DENSITY, field.loc.y / NOISE_DENSITY

                    dataOffset = 4 * (pixelY * size + pixelX)

                    for i in [0..2]
                        c = ((color >> (8 * (2 - i) ) ) & 0xFF)
                        # @plain_colors[_offset + i] = c
                        c *= 1 - NOISE_IMPACT * ( 1 - mod )
                        imageData.data[dataOffset + i] = ~~c

                bufferContext.putImageData imageData, 0, 0
                @swapBuffer()