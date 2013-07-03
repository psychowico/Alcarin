'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    socket_port = 8080

    #only test code
    # my333 = ['$routeParams', (params)->
    #     console.log params
    # ]


    module = angular.module 'game-panel', ['@game-events', '@spin', '@game-event', 'ui.event', 'ngCookies']
    # module.config ['$routeProvider', ($routeProvider)->
    #     $routeProvider
    #         .when '/action/:type/:id',
    #             resolve: {controller: my333}
    #         .otherwise
    #             redirectTo:'/'
    # ]

    exports.App = ngcontroller ['GameEvents', '$timeout', '$location',
        (Events, $timeout, $location)->
            @initialized   = false
            @charid   = null

            @onGameEvent = (ev)=>
                @$safeApply => @$broadcast 'game-event', ev

            @onGameEventReset = (events)=>
                @$safeApply => @$broadcast 'reset-events', events

            authorize = =>
                @socket.emit 'auth',
                    charid : @charid

            reinitalize_socket_connection = =>
                if io?
                    @socket = socket = io.connect $location.host() + ":#{socket_port}"
                    socket.on 'reset-events', @onGameEventReset
                    socket.on 'game-event', @onGameEvent
                    socket.on 'reconnect', (_socket)-> authorize()
                    socket.on 'authorized', => @$safeApply => @$broadcast 'initialized'
                    authorize()

            @$watch 'charid', =>
                if @charid?
                    Events.init @charid
                    if not @initialized
                        host = $location.host()
                        # lazy load socket.io.js script
                        loading = Alcarin.Game.loadSocketLibrary(host, socket_port)
                        loading.then reinitalize_socket_connection
                    else
                        reinitalize_socket_connection()
    ]

    exports.GameEvents = ngcontroller ['GameEvents', (Events)->
        @events = []
        @talkContent = ''
        @sending = @waiting = false

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

                fArg = if $.isPlainObject arg
                    $.extend arg.__base, {text: arg.text}
                else
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
            _char.text = window.prompt 'Przezwisko:', _char.text

        @$on 'initialized', =>
            @waiting = true
            Events.fetch()
    ]