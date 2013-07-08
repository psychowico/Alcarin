namespace 'Alcarin.Map.Layers', (exports, Alcarin) ->

    class exports.Terrain
        background: [0, 0, 255]

        constructor: (element)->
            @table = $(element)
            @table.append @prepareCanvas()

        width: -> @canvas[0]?.width
        height: -> @canvas[0]?.height

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