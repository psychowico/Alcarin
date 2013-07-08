namespace 'Alcarin.Map', (exports, Alcarin) ->

    class exports.Painter extends Alcarin.EventsEmitter
        layers: []

        # broadcast event to all layers
        $broadcast: (name, args...)->
            for layerInstance in @layers
                _args = [name].concat args
                layerInstance.$emit.apply layerInstance, _args

        constructor: (element, layers)->
            for layerClass in layers
                throw Error "Painter layer class not exists." if not layerClass?

                layerInstance = new layerClass element
                layerInstance.$on '*', (obj)=>
                    @$emit.apply @, [obj.name].concat obj.args

                @layers.push layerInstance