'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    exports.GameEvents = ngcontroller ['GameServer', 'GameEventsTranslator',
        (GameServer, Translate)->
            @gameEvents  = null
            @sending     = false

            GameServer.on 'game-event.swap', (data)=>
                @gameEvents  = (Translate ev for ev in data)
            GameServer.on 'game-event.add', (evData)=>
                if not evData.system
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

    TagTranslator = Alcarin.Game.Tools.TagTranslator
    Alcarin.Game.module.filter('EventTime', ->
        (time)->
            return time if isNaN time
            _time = new GameTime time
            return _time.print_long()
    ).factory('GameEventsTranslator', [->#'GameObjectFactory', (GameObjectFactory)->
        return (gameEvent)->
            body: TagTranslator gameEvent
            time: gameEvent.time
    ])

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
