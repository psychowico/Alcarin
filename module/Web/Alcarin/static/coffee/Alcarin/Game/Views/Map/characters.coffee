'use strict'

namespace 'Alcarin.Game.Views.Map', (exports, Alcarin) ->

    exports.Chars = ngcontroller ['GameServer', 'CurrentCharacter', 'CharEnvironment', 'MapBackground',
        (GameServer, CurrentCharacter, CharEnvironment, MapBackground)->
            @charslist  = CharEnvironment.characters()

            CurrentCharacter.then (current)=>
                # when current chacater is changed, we need redraw full map
                current.$on 'update-location', => @redrawMap()
    ]