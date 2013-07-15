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

        constructor: (@GameServer, @$q)->
            @GameServer.on 'char.fetch', @onServerResponse
            @GameServer.on 'chars.swap', @onCharsSwap

        onCharsSwap: (chars)=>
            # @BackgroundReady.then (units)=>
            #     @charslist = {}
            #     for _char in chars
            #         _char.pixelLoc = units.toPixels(_char.loc.x, _char.loc.y)
            #         _char.type = 'char'
            #         CharEnvironment.character(_char).then (obj)=>
            #             @charslist[obj._id] = obj

        onServerResponse: (obj)=>
            throw Error 'Wrong server answer.' if typeof obj is 'string'
            _id = obj._id
            result = @factory obj

            if @cache[_id]?
                character = @cache[_id]
                character[key]= val for key, val of obj
                character.$emit 'update'
            if @waitingPromises[_id]?
                deffered.resolve result for deffered in @waitingPromises[_id]

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