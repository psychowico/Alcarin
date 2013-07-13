'use strict'

###
We need getting all GameObject from this factory. This provides us that this same
GameObject will be related with this same GameObject instance.
To use it, first you need register GameObject factory type (one time, when adding new
GameObject) type to system.
Alcarin.GameObject.Factory.register can_resolve, resolving
Where "can_resolve" is method, that will be called with base object and return true/false
if you factory can resolve this object. Registered factory should take care about
caching they results.

Next, when we have base object, we call Alcarin.GameObject.Factory(arg) method for it.
From now, "arg" will have "resolve()" method that return GameObject promise (Q promise).
It is because we want lazy resolving game objects.

Alcarin.GameObject.Factory(char)
char.resolve().then (charGameObject)->
    console.log charGameObject.name
###

namespace 'Alcarin.Game.Services.GameObject', (exports, Alcarin) ->

    class exports.BaseFactory
        cache          : {}

        constructor: (@$q, @_class, @idKey='_id')->

        _factoryObject: (obj)->
            id = obj[@idKey]
            if not id?
                throw Error "Factory: Can not create object withot '#{@idKey}' id key."

            if @cache[id]?
                instance = @cache[id]
            else
                instance = new @_class()
            instance[key] = val for key, val of obj
            instance.update obj if instance.update
            return instance

        factory: (obj)->
            @$q.when @_factoryObject obj

    class GameObjectFactory

        constructor: (@GameServer, $q)->
            CharacterFactory = Alcarin.Game.Services.GameObject.CharacterFactory
            @factories =
                chars: new CharacterFactory @GameServer, $q

        character: (charObjOrId)=> @factories.chars.factory charObjOrId


    module = Alcarin.Game.Services.module
    module.factory 'GameObjectFactory', ['GameServer', '$q',
        (GameServer, $q)->
            return new GameObjectFactory GameServer, $q
    ]