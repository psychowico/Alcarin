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
            data['__action'] = 'emit'
            Rest().$create @url, data, @_onStateChanged

        _$wrapper: (method, url, data, on_done)->
            if $.isFunction data
                on_done = data
                data = {}
            Rest()[method] url, data, (response)=>
                on_done?(response)
                @_onStateChanged response


        $getList: (data, on_done)->
            @_$wrapper '$get', @url, data, on_done

        $get: (id, data, on_done)->
            url = Alcarin.Path.combine @url, id
            @_$wrapper '$get', url, data, on_done

        $create: (data, on_done)->
            @_$wrapper '$create', @url, data, on_done

        $update: (id, data, on_done)->
            url = Alcarin.Path.combine @url, id
            @_$wrapper '$update', url, data, on_done

        $delete: (id, data = {}, on_done)->
            url = Alcarin.Path.combine @url, id
            @_$wrapper '$delete', url, data, on_done

        _onStateChanged: (state) =>
            state = {_events: [state]} if not state._events?
            for _event in state._events
                _callbacks = @register_events[_event.id]
                _callbacks?.fire _event.data
            true

        stateChangeMock: ( changes_object ) ->
            @_onStateChanged changes_object