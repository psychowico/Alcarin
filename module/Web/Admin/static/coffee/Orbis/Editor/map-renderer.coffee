namespace 'Alcarin.Orbis.Editor', (exports, Alcarin) ->

    class exports.MapRenderer

        constructor: (@canvas, c_x, c_y)->
            @set_center c_x, c_y

        set_center: (c_x, c_y)->
            @center = {x: c_x, y: c_y}

        init: ->
            @context = @canvas[0].getContext '2d'

            @context.fillStyle = "rgb(0, 0, 255)";
            @context.fillRect 0, 0, @canvas.width(), @canvas.height()

            @context.webkitImageSmoothingEnabled = @context.mozImageSmoothingEnabled = false

        redraw: (size, fields)->
            backbuffer = @_prepare_empty_canvas size, size
            image_data = backbuffer.getImageData 0, 0, size, size

            offset = {x: @center.x - size / 2, y: @center.y - size / 2}

            for field in fields
                color = field.land.color
                r = color & 255
                g = (color >> 8) & 255
                b = (color >> 16) & 255

                _x = field.loc.x - offset.x
                _y = field.loc.y - offset.y

                _offset = 4 * (_y * size + _x)

                for i in [0..2]
                    image_data.data[_offset + i] = (color >> (8 * i) ) & 255

            backbuffer.putImageData image_data, 0, 0

            @context.save()
            @context.drawImage @backbuffer_canvas, 0, 0, size, size, 0, 0, @canvas.width(), @canvas.height()
            @context.restore()

        draw_fields: (fields)->

        _prepare_empty_canvas: (sizeW, sizeH)->
            if not @backbuffer_canvas?
                @backbuffer_canvas = $('<canvas>')[0]
                @backbuffer_canvas.width = sizeW;
                @backbuffer_canvas.height = sizeH;
                @backbuffer = @backbuffer_canvas.getContext '2d'

            @backbuffer.fillStyle = "rgb(0, 0, 255)";
            @backbuffer.fillRect 0, 0, sizeW, sizeH
            @backbuffer

