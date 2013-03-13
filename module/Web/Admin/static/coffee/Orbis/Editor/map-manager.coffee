namespace 'Alcarin.Orbis.Editor', (exports, Alcarin) ->

    class exports.MapManager
        changes: {}

        constructor: (@canvas, c_x, c_y)->
            @set_center c_x, c_y

        set_center: (c_x, c_y)->
            @center = {x: c_x, y: c_y}

        init_backbuffer: (sizeW, sizeH)->
            if not @backbuffer_canvas?
                @backbuffer_canvas = $('<canvas>', {width: sizeW, height: sizeH})
                _canvas = @backbuffer_canvas[0]
                @backbuffer = _canvas.getContext '2d'
                $(@backbuffer).disableSmoothing()

            @backbuffer.fillStyle = "rgb(0, 0, 255)";
            @backbuffer.fillRect 0, 0, sizeW, sizeH
            @backbuffer

        init: ->
            @context = @canvas[0].getContext '2d'

            @context.fillStyle = "rgb(0, 0, 255)";
            @context.fillRect 0, 0, @canvas.width(), @canvas.height()

            $(@context).disableSmoothing()

        redraw: (size, fields)->
            @size = size
            backbuffer = @init_backbuffer size, size
            @image_data = image_data = backbuffer.getImageData 0, 0, size, size

            offset = {x: @center.x - size / 2, y: @center.y - size / 2}

            for field in fields
                color = field.land.color

                _x = field.loc.x - offset.x
                _y = field.loc.y - offset.y

                _offset = 4 * (_y * size + _x)

                for i in [0..2]
                    image_data.data[_offset + i] = (color >> (8 * (2 - i) ) ) & 0xFF

            @_buffer_to_front true
            @unsaved_changes = false

        pixels_to_coords: (x, y)->
            offset = {x: @center.x - @size / 2, y: @center.y - @size / 2}
            return {
                x: offset.x + Math.round x * @backbuffer_canvas.width() / @canvas.width()
                y: offset.y + Math.round y * @backbuffer_canvas.height() / @canvas.height()
            }

        put_field: (x, y, field_brush)->
            if x? and y?
                color = field_brush.color

                bb_pos = @_coords_to_backbuffer_pixels x, y
                offset = 4 * (bb_pos.y * @size + bb_pos.x)

                @image_data.data[offset] = color.r
                @image_data.data[offset + 1] = color.g
                @image_data.data[offset + 2] = color.b

                @_buffer_to_front true

                @unsaved_changes = true

                _data = $.extend {}, field_brush

                _data.color = (color.r << 16) + (color.g << 8) + color.b

                @changes["#{x},#{y}"] = {
                    x: x
                    y: y
                    field: _data
                }
                @canvas.trigger 'mapchange'

        _buffer_to_front: (with_swap = false)->
            @backbuffer.putImageData @image_data, 0, 0 if with_swap
            @context.save()
            _w = @canvas.width()
            _h = @canvas.height()
            @context.drawImage @backbuffer_canvas[0], 0, 0, @size, @size, 0, 0, _w, _h
            @context.restore()

        _coords_to_backbuffer_pixels: (x, y)->
            offset = {x: @center.x - @size / 2, y: @center.y - @size / 2}
            return {
                x: x - offset.x
                y: y - offset.y
            }