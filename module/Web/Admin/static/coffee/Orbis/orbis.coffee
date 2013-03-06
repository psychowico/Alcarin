namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    class exports.Orbis

        constructor : ( $orbis )->
            @$orbis    = $orbis

        init : ->
            $gateways = @$orbis.find '.gateways-list'

            @gateways = new Alcarin.Orbis.Gateways $gateways
            @gateways.init()
