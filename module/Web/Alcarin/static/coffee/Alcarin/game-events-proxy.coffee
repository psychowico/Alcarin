namespace 'Alcarin', (exports, Alcarin) ->

    ###
    Events proxy, others object can register his functions on specific event call
    and react in some way
    ###
    class exports.GameEventsProxy

        constructor: ->
            @register_events = {}

        on: (event_name, callback) ->
            _callbacks = @register_events[event_name]
            if _callbacks is undefined
                _callbacks = $.Callbacks()
                @register_events[event_name] = _callbacks
            _callbacks.add callback
            @


        off: ( event_name, callback ) ->
            _callbacks = @register_events[event_name]
            if _callbacks is undefined then return @
            _callbacks.remove callback
            @

        _onStateChanged: ( state ) ->
            for _eventid, _event of state.events
                _callbacks = @register_events[ _event.id ]
                if _callbacks then _callbacks.fire _event.data
            @

        stateChangeMock: ( changes_object ) ->
            @_onStateChanged changes_object

    class exports.Test1

        constructor: (proxy, val)->
            @japko = val
            proxy.on 'test.test', this.onTest

        onTest: (data)=>
            #console.log @japko

    $ ->
        proxy = new Alcarin.GameEventsProxy()

        test = new Alcarin.Test1( proxy, 13 )
        test = new Alcarin.Test1( proxy, 7 )

        proxy.stateChangeMock {
            'events': [
                {
                    'id': 'test.test',
                    'data': 'and what?'
                }
            ]
        }

