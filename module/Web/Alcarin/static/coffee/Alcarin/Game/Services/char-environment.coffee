'use strict'

###
We need ensure that in all palce in code when we working with this same
Character/other GameObject we use this same object class instance. So when we
change character name it will automatically updated in all places in code.

This factory retreving all GameObject's available for player - so, visible characters,
things on ground etc.
It shouldn't storing things not related with player char surroundings.
###

namespace 'Alcarin.Game.Services', (exports, Alcarin) ->

    module = Alcarin.Game.Services.module
    module.factory 'CharEnvironment', ['GameServer', '$q',
        (GameServer, $q)->

            CharacterFactory = Alcarin.Game.Services.GameObject.CharacterFactory
            class GameObjectFactory

                constructor: ->
                    @factories =
                        chars: new CharacterFactory GameServer, $q

                character: (charObjOrId)=> @factories.chars.factory charObjOrId
                characters: => @factories.chars.all()

            return new GameObjectFactory()
    ]