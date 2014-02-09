'use strict'

namespace 'Alcarin.Game.Views.Map', (exports, Alcarin) ->

    exports.Chars = ngcontroller ['CurrentCharacter', 'CharEnvironment',
        (CurrentCharacter, CharEnvironment)->
            @charslist  = CharEnvironment.characters()

            CurrentCharacter.then (current)=>
                # when current chacater is changed, we need redraw full map
                current.$on 'update-location', => @redrawMap()
    ]
