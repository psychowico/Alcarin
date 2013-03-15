namespace 'Alcarin.Orbis.Editor', (exports, Alcarin) ->

    class exports.Toolbar

        Current: {
            color: { r: 0, g: 128, b:0 }
        }

        constructor: (@base, @renderer)->
            @brush_size 1

        brush_size: (val)->
            if val
                @_brush_size = val
                #@renderer.shadow @brush_size()
            else
                return @_brush_size

        canvas_mouse_down: (e)=>
            return false if $(e.currentTarget).disabled()
            @renderer.canvas.parent().on 'mousemove', @canvas_mouse_painting
            @canvas_mouse_painting(e)

        canvas_mouse_up: =>
            @renderer.canvas.parent().off 'mousemove', @canvas_mouse_painting

        canvas_mouse_move: (e)=>
            @renderer.draw_shadow {x: e.offsetX, y: e.offsetY}, @brush_size()

        canvas_mouse_painting: (e)=>
            coords = @renderer.pixels_to_coords e.offsetX, e.offsetY
            if @brush_size() > 1
                range   = @brush_size() - 1
                range_2 = range * range
                for oy in [-range..range]
                    for ox in [-range..range]
                        if oy * oy + ox * ox <= range_2
                            @renderer.put_field coords.x + ox, coords.y + oy, @Current
            else
                @renderer.put_field coords.x, coords.y, @Current

            @renderer.confirm_changes()


        map_change: =>
            @save_btn.enable()
            @base.find('.alert').fadeIn()

        size_changed: (e, ui)=>
            $.bbq.push {'size': ui.value}

        onhashchange: =>
            state = $.bbq.get()
            if state.color?
                @Current.color = Alcarin.Color.hexToRGB state.color
                @color_picker.css 'background-color', state.color
            if state.size?
                size = parseInt state.size
                @brush_slider.slider 'value', size
                @brush_size size

        init: ->
            @base.find('.alert .close').click -> $(@).parent().fadeOut()
            @brush_slider = @base.find('.slider')
            @brush_slider.slider {
                min: 1
                max: 10
                value: 1
                change: @size_changed
            }
            @save_btn = @base.find('.alert .btn')

            @renderer.canvas.on('mapchange', @map_change)
                            .parent()
                                .on('mousedown', @canvas_mouse_down)
                                .on('mousemove', @canvas_mouse_move)
            $(document).on 'mouseup', @canvas_mouse_up
            @color_picker = @base.find('a.color-picker')
            @color_picker.colorpicker()
                .on 'hide', (e)=> $.bbq.push {'color': e.color.toHex()}

            $(window).hashchange @onhashchange