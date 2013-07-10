namespace 'Alcarin.Map', (exports, Alcarin) ->

    class exports.Painter extends Alcarin.EventsEmitter
        layers: []

        # broadcast event to all layers
        $broadcast: (name, args...)->
            for layerInstance in @layers
                if layerInstance.$emit
                    _args = [name].concat args
                    layerInstance.$emit.apply layerInstance, _args

        constructor: (element, layers, @services)->
            for layerClass in layers
                throw Error "Painter layer class not exists." if not layerClass?

                layerInstance = new layerClass element, @services
                if layerInstance.$on
                    layerInstance.$on '*', (obj)=>
                        @$emit.apply @, [obj.name].concat obj.args

                @layers.push layerInstance

        setTarget: (@charPromise)->
            layer.setTarget @charPromise for layer in @layers when layer.setTarget
