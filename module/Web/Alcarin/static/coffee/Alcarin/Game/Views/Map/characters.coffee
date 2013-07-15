'use strict'

namespace 'Alcarin.Game.Views.Map', (exports, Alcarin) ->

    exports.Chars = ngcontroller ['GameServer', 'CurrentCharacter', 'CharEnvironment', 'MapBackground',
        (GameServer, CurrentCharacter, CharEnvironment, MapBackground)->
            @charslist  = {}

            GameServer.on 'chars.swap', (chars)=>
                MapBackground.then (units)=>
                    @charslist = {}
                    for _char in chars
                        _char.pixelLoc = units.toPixels(_char.loc.x, _char.loc.y)
                        _char.type = 'char'
                        CharEnvironment.character(_char).then (obj)=>
                            @charslist[obj._id] = obj

            GameServer.on 'game-event.add', (gameEvent)=>
                if gameEvent.system and gameEvent.id is 'char.update'
                    currentid = @charid
                    charid    = gameEvent.args[0]
                    loc       = gameEvent.args[1]
                    applyCurrentChar = currentid == charid
                    if applyCurrentChar
                        CurrentCharacter.then (current)=>
                            current.loc = loc
                            @redrawMap()
                    else
                        _char = @charslist[charid]
                        _char.loc = loc
                        MapBackground.then (units)=>
                            _char.pixelLoc = units.toPixels _char.loc.x, _char.loc.y
    ]