'use strict'

namespace 'Alcarin.Game.Views.Place', (exports, Alcarin) ->

    exports.Default = ngcontroller ['GameServer', 'CurrentCharacter',
        (GameServer, CurrentChar)->
            TagTranslator = Alcarin.Game.Tools.TagTranslator
            CurrentChar.then (currentChar)=>
                @leavePlace = =>
                    GameServer.emit 'leave-place' if @toggleOutside()

                GameServer.on 'description.place', (dList)=>
                    @description = (TagTranslator tag for tag in dList)
                GameServer.emit 'place.description'
    ]
