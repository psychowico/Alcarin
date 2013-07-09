'use strict'

namespace 'Alcarin.Game.Services.GameObject', (exports, Alcarin) ->

    class Character
        @count : 0

        constructor: (_id)->
            Character.count++

    cache = {}
    condition = (obj)-> obj.type == 'char'
    factory = (GameServer, obj)->
        return cache[obj.id] if cache[obj.id]?
        cache[obj.id] = character = new Character obj.id
        return character

    exports.Factory.register condition, factory