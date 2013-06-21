'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    socket_port = 8080

    angular.module 'game-panel', ['@game-events', '@spin', 'ui.event', 'ngCookies']

    exports.App = ngcontroller ['GameEvents', '$timeout', '$location',
        (Events, $timeout, $location)->
            @initialized   = false
            @charid   = null

            @onGameEvent = (ev)=>
                if @$root.$$phase
                    @$broadcast 'game-event', ev
                else
                    @$apply => @$broadcast 'game-event', ev

            authorize = =>
                @socket.emit 'auth',
                    charid : @charid

            reinitalize_socket_connection = =>
                if io?
                    @socket = socket = io.connect $location.host() + ":#{socket_port}"
                    socket.on 'game-event', @onGameEvent
                    socket.on 'reconnect', (_socket)-> authorize()
                    authorize()

            @$watch 'charid', =>
                if @charid?
                    Events.init @charid
                    @$broadcast 'page-init'
                    if not @initialized
                        host = $location.host()
                        # lazy load socket.io.js script
                        $.getScript "http://#{host}:#{socket_port}/socket.io/socket.io.js", ->
                            reinitalize_socket_connection()
                    else
                        reinitalize_socket_connection()
    ]

    exports.GameEvents = ngcontroller ['GameEvents', (Events)->
        @events = null
        @talkContent = ''
        @sending = false

        @talkToAll = =>
            @sending = true
            content = @talkContent
            @talkContent = ''
            Events.talk(content).then => @sending = false

        @onKeyDown = (event)=>
            if event.keyCode is 13
                if not event.shiftKey
                    @talkToAll()
                    event.preventDefault()

        @$on 'game-event', (ev, data)=>
            @events.splice 0, 0, translate_event data

        translate_event = (ev)->
            _text = ev.text
            for arg, ind in ev.args
                _text = _text.replace "%#{ind}", arg
            return {
                text: _text
                time: ev.time
            }

        translate_events = (events_data)->
            result = []
            for ev in events_data
                _text = ev.text or ''
                if _text.length is 0 then continue
                result.push translate_event ev
            return result

        @$on 'page-init', =>
            Events.fetch().then (response)=>
                @events = translate_events response.data
    ]