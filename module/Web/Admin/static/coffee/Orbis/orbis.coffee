namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    class exports.Orbis

        constructor : ($orbis)->
            @orbis    = $orbis

        load_map_info: =>
            btn = @map_info.parent().find('button')
            btn.spin()
            Rest().$get (response)=>
                if response.success
                    @map_info.data('popover').options.content = response.info
                    btn.spin()

        init : ->
            $gateways = @orbis.find '.gateways-list'

            @gateways = new Alcarin.Orbis.Gateways $gateways
            @gateways.init()

            @map_info = @orbis.find '.map-info > .info-popover'
            @map_info.popover {html: true, trigger: 'manual'}
            @map_info.parent().find('button').one('mouseover', @load_map_info)
                                    .on 'click', => @map_info.popover 'toggle'


