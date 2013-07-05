'use strict'

namespace 'Alcarin.GameObject', (exports, Alcarin) ->

    class exports.Character
        @count : 0

        constructor: (_id)->
            Alcarin.GameObject.Character.count++

    cache = {}
    condition = (obj)-> obj.type == 'char'
    Alcarin.GameObject.Factory.register condition, (obj)->
        return cache[obj.id] if cache[obj.id]?
        cache[obj.id] = character = new Alcarin.GameObject.Character obj.id
        return character
