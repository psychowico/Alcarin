'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    socket_port = 8080

    angular.module 'game-panel', ['@game-events', '@spin', 'ui.event', 'ngCookies']

    exports.App = ngcontroller ['$timeout', '$location',
        ($timeout, $location)->
            @initialized   = false
            @charid   = null

            onGameEvent = =>
                console.log 'event?'

            authorize = =>
                @socket.emit 'auth',
                    charid : @charid

            reinitalize_socket_connection = =>
                if io?
                    @socket = socket = io.connect $location.host() + ":#{socket_port}"
                    socket.on 'game-event', @onGameEvent
                    socket.on 'reconnect', (_socket)-> authorize()
                    authorize()
                    x = => @socket.disconnect()
                    $timeout x, 5000

            @$watch 'charid', =>
                if @charid?
                    if not @initialized
                        host = $location.host()
                        # lazy load socket.io.js script
                        $.getScript "http://#{host}:#{socket_port}/socket.io/socket.io.js", ->
                            reinitalize_socket_connection()
                    else
                        reinitalize_socket_connection()



    ]

    exports.GameEvents = ngcontroller ['Events', (Events)->
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


        translate_events = (events_data)->
            result = []
            for ev in events_data
                _text = ev.text
                if _text.length is 0 then continue
                for arg, ind in ev.args
                    _text = _text.replace "%#{ind}", arg
                result.push
                    text: _text
                    time: ev.time
            return result


        Events.fetch().then (response)=>
            @events = translate_events response.data
    ]