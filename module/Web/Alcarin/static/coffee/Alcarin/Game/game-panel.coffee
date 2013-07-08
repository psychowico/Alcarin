'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    socket_port = 8080

    module = angular.module 'game-panel', ['@game-events', '@spin', 'ui.event', 'ngCookies']

    exports.App = ngcontroller ['$timeout', '$location', '$cookies',
        ($timeout, $location, cookies)->
            @waiting     = false
            @initialized = false
            @charid      = null

            @onGameEvent = (ev)=>
                @$safeApply => @$broadcast 'game-event', ev

            @onGameEventReset = (events)=>
                @$safeApply => @$broadcast 'reset-events', events

            authorize = =>
                @waiting = true
                @socket.emit 'auth',
                    charid : @charid
                    session: cookies.alcarin

            reinitalize_socket_connection = =>
                if io?
                    @socket = socket = io.connect $location.host() + ":#{socket_port}"
                    socket.on 'reset-events', @onGameEventReset
                    socket.on 'game-event', @onGameEvent
                    socket.on 'reconnect', authorize
                    socket.on 'authorized', -> socket.emit 'test-event'
                    authorize()

            @$watch 'charid', =>
                if @charid?
                    # Events.init @charid
                    if not @initialized
                        host = $location.host()
                        # lazy loadlocation socket.io.js script
                        loading = Alcarin.Game.loadSocketLibrary(host, socket_port)
                        loading.then reinitalize_socket_connection
                    else
                        reinitalize_socket_connection()
    ]

    exports.GameEvents = ngcontroller ->
        @events = []
        @talkContent = ''
        @sending = false

        @talkToAll = =>
            @sending = true
            content = @talkContent
            @talkContent = ''
            @socket.emit 'public-talk', content

        @onKeyDown = (event)=>
            if event.keyCode is 13
                if not event.shiftKey
                    @talkToAll()
                    event.preventDefault()

        @t = (x)=>
            console.log x

        @$on 'reset-events', (ev, data)=>
            @waiting = false
            @events  = (translate_event ev for ev in data)

        @$on 'game-event', (ev, data)=>
            @events.splice 0, 0, translate_event data

        reg = /%([0-9])+/g
        translate_event = (ev)->
            _text = ev.text
            output = []
            offset = 0
            # time: ev.time
            while match = reg.exec _text
                arg_index = parseInt match[1]
                arg = ev.args[arg_index]

                if $.isPlainObject arg
                    fArg = $.extend {text: arg.text}, arg.__base
                    Alcarin.GameObject.Factory fArg
                else
                    fArg =
                        text: arg
                        type: 'text'

                pre_text = _text.substr offset, match.index
                output.push {text: pre_text, type: 'text'} if pre_text.length > 0
                output.push fArg

                _text = _text.substr match.index + match[0].length
            {
                body: output
                time: ev.time
            }

        translate_events = (events_data)->
            result = []
            for ev in events_data
                _text = ev.text or ''
                if _text.length is 0 then continue
                result.push translate_event ev
            return result

        @charClicked = (_char)=>
            # _char.text = window.prompt 'Przezwisko:', _char.text
            _char.resolve().then (c)->
                console.log c
