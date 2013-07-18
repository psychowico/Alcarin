'use strict'

namespace 'Alcarin.Game.Services.GameObject', (exports, Alcarin) ->

    class Character extends Alcarin.EventsEmitter
        @count : 0

        constructor: (@GameServer)->
            Character.count++

        moveTo: (target)->
            @GameServer.emit 'move.char', target

    class exports.CharacterFactory
        waitingPromises: {}
        cache          : {}

        constructor: (@GameServer, @$q)->
            @GameServer.on 'char.fetch', @onCharFetch
            @GameServer.on 'game-event.add', @onGameEvent
            @GameServer.on 'chars.swap', @onCharsSwap

        _factoryObject: (obj)->
            id = obj._id
            if not id?
                throw Error "Factory: Can not create Character withot '_id' id key."

            if @cache[id]?
                instance = @cache[id]
            else
                @cache[id] = instance = new Character @GameServer
            instance[key] = val for key, val of obj
            instance.update obj if instance.update
            return instance

        addCharFromServer: (obj)->
            _id = obj._id
            result = @factory obj

            if @cache[_id]?
                character = @cache[_id]
                character[key] = val for key, val of obj
                character.$emit 'update'
            if @waitingPromises[_id]?
                deffered.resolve result for deffered in @waitingPromises[_id]

        onCharsSwap: (chars)=>
            @charslist = {}
            byids = {}
            for _char in chars
                byids[_char._id] = _char
                @addCharFromServer _char
            for key of @cache
                delete @cache[key] if not byids[key]?

        onCharFetch: (obj)=>
            throw Error 'Wrong server answer.' if typeof obj is 'string'
            @addCharFromServer obj

        onGameEvent: (gameEvent)=>
            if gameEvent.system
                id = gameEvent.id
                switch id
                    when 'char.update-location'
                        _char = gameEvent.args[0]
                        loc = _char.loc
                        if @cache[_char._id]?
                            item = @cache[_char._id]
                            oldloc = item.loc
                            if oldloc.x != loc.x or oldloc.y != loc.y
                                item.loc = loc
                                item.$emit 'update-location'

        all: => @cache

        factory: (objOrId)=>
            if typeof objOrId is 'string'
                _id = objOrId
                deffered = @$q.defer()
                @waitingPromises[_id] = [] if not @waitingPromises[_id]
                @waitingPromises[_id].push deffered
                @GameServer.emit 'fetch.char', _id
                return deffered.promise
            else
                return @$q.when @_factoryObject objOrId