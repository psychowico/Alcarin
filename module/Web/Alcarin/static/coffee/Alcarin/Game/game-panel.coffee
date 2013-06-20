'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    angular.module 'game-panel', ['@game-events', '@spin', 'ui.event', 'ngCookies']

    exports.App = ngcontroller ['$timeout', ($timeout)->
        fetchGameEvents = =>
            socket = io.connect 'http://localhost:8080'
            socket.emit 'japko'
            $timeout fetchGameEvents, 1500
        # $timeout fetchGameEvents
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