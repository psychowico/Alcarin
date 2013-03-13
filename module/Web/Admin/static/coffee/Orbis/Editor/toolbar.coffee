namespace 'Alcarin.Orbis.Editor', (exports, Alcarin) ->

    class exports.Toolbar

        Current: {
            color: '#007700'
        }

        constructor: (@base, @renderer)->

        canvas_mouse_down: (e)=>
            @renderer.canvas.on 'mousemove', @canvas_mouse_painting
            @canvas_mouse_painting(e)

        canvas_mouse_up: =>
            @renderer.canvas.off 'mousemove', @canvas_mouse_painting

        canvas_mouse_painting: (e)=>
            pos = {
                x: e.offsetX
                y: e.offsetY
            }

            console.log pos

        onhashchange: =>
            state = $.bbq.get()
            if state.color?
                @Current.color = state.color
                @color_picker.css 'background-color', state.color

        init: ->
            @renderer.canvas.on('mousedown', @canvas_mouse_down)
                            .on('mouseup', @canvas_mouse_up)
            @color_picker = @base.find('a.color-picker')
            @color_picker.colorpicker()
                .on 'hide', (e)=> $.bbq.push {'color': e.color.toHex()}

            $(window).hashchange @onhashchange