'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    exports.GameEvents = ngcontroller ['GameServer', 'GameEventsTranslator', (GameServer, Translate)->
        @gameEvents  = []
        @sending     = false

        GameServer.on 'reset-events', (data)=>
            @waiting = false
            @gameEvents  = (Translate ev for ev in data)
        GameServer.on 'game-event', (evData)=>
            gameEvent = Translate evData
            @gameEvents.splice 0, 0, gameEvent
            @sending = false if evData.response

        @talkToAll = (content)=>
            return if content.length == 0
            @sending = true
            GameServer.emit 'public-talk', content

        @charClicked = (_char)=>
            # _char.text = window.prompt 'Przezwisko:', _char.text
            _char.resolve().then (c)->
                console.log c
    ]

    Alcarin.Game.module.filter('EventTime', ->
        (time)->
            return time if isNaN time
            _time = new GameTime time
            return _time.print_long()
    ).factory('GameEventsTranslator', ->
        reg = /%([0-9])+/g
        return (gameEvent)->
            _text = gameEvent.text
            output = []
            offset = 0
            # time: gameEvent.time
            while match = reg.exec _text
                arg_index = parseInt match[1]
                arg = gameEvent.args[arg_index]

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
                time: gameEvent.time
            }
    )

    class GameTime
        @resolved = false

        pad = (number)->
            return "0#{number}" if number < 10
            return number + ''

        constructor: (@timestamp)->

        _resolve: ->
            return true if @resolved
            @day  = Math.floor @timestamp / 345600
            @hour = pad Math.floor (@timestamp % 345600) / 3600
            @min  = pad Math.floor (@timestamp % 3600) / 60
            @sec  = pad @timestamp % 60
            @resolved = true

        print_short: ->
            @_resolve()
            "#{@hour}:#{@min}:#{@sec}"

        print_long: ->
            @_resolve()
            "#{@day} - #{@hour}:#{@min}:#{@sec}"
