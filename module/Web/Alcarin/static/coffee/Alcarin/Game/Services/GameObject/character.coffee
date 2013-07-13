'use strict'

namespace 'Alcarin.Game.Services.GameObject', (exports, Alcarin) ->

    class exports.Character
        @count : 0

        constructor: ->
            Character.count++

    BaseFactory = Alcarin.Game.Services.BaseFactory
    class exports.CharacterFactory extends BaseFactory
        waitingPromises: {}

        constructor: (@GameServer, @$q)->
            super @$q, exports.Character, '_id'
            @GameServer.on 'char.fetch', @onServerResponse

        onServerResponse: (obj)=>
            throw Error 'Wrong server answer.' if typeof obj is 'string'
            _id = obj[@idKey]
            result = @factory obj
            if @waitingPromises[_id]?
                deffered.resolve result for deffered in @waitingPromises[_id]

        factory: (objOrId)=>
            if typeof objOrId is 'string'
                _id = objOrId
                deffered = @$q.defer()
                @waitingPromises[_id] = [] if not @waitingPromises[_id]
                @waitingPromises[_id].push deffered
                @GameServer.emit 'fetch.char', _id
                deffered.promise
            else
                super objOrId