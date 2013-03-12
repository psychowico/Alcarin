namespace 'Alcarin.Orbis.Editor', (exports, Alcarin) ->

    class exports.Editor

        constructor: (@base)->
            @proxy = new Alcarin.EventProxy urls.orbis.map

            @center = {
                x: @base.data 'center-x'
                y: @base.data 'center-y'
            }
            canvas = @base.find 'canvas'
            @renderer = new Alcarin.Orbis.Editor.MapRenderer canvas, @center.x, @center.y

        on_fields_loaded: (response)=>
            @renderer.redraw response.size, response.fields

        init: ->
            @renderer.init()
            @proxy.on 'fields.loaded', @on_fields_loaded

            @proxy.emit 'fields.fetch', {x: @center.x, y: @center.y}
