'use strict'

namespace 'Alcarin.Game.Views.Place', (exports, Alcarin) ->

    exports.Default = ngcontroller ['GameServer', (GameServer)->
        TagTranslator = Alcarin.Game.Tools.TagTranslator

        GameServer.on 'description.place', (dList)=>
            @description = (TagTranslator tag for tag in dList)
            console.log @description
        GameServer.emit 'place.description'
    ]
