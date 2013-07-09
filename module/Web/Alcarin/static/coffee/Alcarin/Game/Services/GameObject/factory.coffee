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

    _GameServer = null

    factories = []
    resolvingGameObject = (resolving_method, obj)->
        -> Q resolving_method obj

    exports.Factory =
        register: (initFun, can_resolve, resolving_method)->
            factory =
                init     : initFun
                condition: can_resolve
                resolving: resolving_method
            if _GameServer
                factory.init _GameServer
                delete factory.init
            factories.push factory



    module = Alcarin.Game.Services.module
    module.factory 'GameObjectFactory', ['GameServer', (GameServer)->
        _GameServer = GameServer

        (arg)->
            for factory in factories
                if factory.init?
                    factory.init? GameServer
                    delete factory.init

                if factory.condition arg
                    do (factory, arg)=>
                        arg.resolve = resolvingGameObject factory.resolving, arg
                    return arg
                    #return new Alcarin.GameObject.LazyGameObject arg, factory.resolving
            throw Error 'Can not resolve object: ' + JSON.stringify arg
    ]