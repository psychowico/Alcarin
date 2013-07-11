'use strict'

namespace 'Alcarin.Game.Services.GameObject', (exports, Alcarin) ->

    class Character
        @count : 0

        constructor: (_id)->
            Character.count++

    class Factory
        @cache: {}
        @waitingPromises: {}

        @init: (@GameServer)=>
            @GameServer.on 'char.fetch', (charData)=>
                @cache[charData._id] = character = new Character charData._id
                character[key] = val for key, val of charData
                if @waitingPromises[charData._id]?
                    for deffered in @waitingPromises[charData._id]
                        deffered.resolve character
                    @waitingPromises[charData._id] = []

        @condition: (obj)-> obj.type == 'char'

        @factory: (obj)=>
            return @cache[obj.id] if @cache[obj.id]?

            deffered = Q.defer()
            @waitingPromises[obj.id] = [] if not @waitingPromises[obj.id]
            @waitingPromises[obj.id].push deffered
            @GameServer.emit 'fetch.char', obj.id
            deffered.promise

    $ ->
        exports.Factory.register Factory.init, Factory.condition, Factory.factory