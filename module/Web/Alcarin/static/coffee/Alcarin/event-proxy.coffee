namespace 'Alcarin', (exports, Alcarin) ->

    ###
    Events proxy, others object can register his functions on specific event call
    and react in some way by use on/off methods. call emmit() to emit own events
    to server.
    ###
    class exports.EventProxy

        constructor: (@url)->
            @register_events = {}

        on: (event_name, callback)->
            _callbacks = @register_events[event_name]
            if _callbacks is undefined
                _callbacks = $.Callbacks()
                @register_events[event_name] = _callbacks
            _callbacks.add callback
            @

        off: (event_name, callback)->
            _callbacks = @register_events[event_name]
            if _callbacks is undefined then return @
            _callbacks.remove callback
            @

        emit: (event_name, data = {})->
            data['__id']     = event_name
            Rest().$create @url, data, @_onStateChanged

        _onStateChanged: (state) =>
            console.log state
            state = {_events: [state]} if not state._events?
            for _event in state._events
                _callbacks = @register_events[_event.id]
                console.error "Fail response: '#{_event.id}',", _event.data if not _event.data?.success
                _callbacks?.fire _event.data
            true

        stateChangeMock: ( changes_object ) ->
            @_onStateChanged changes_object