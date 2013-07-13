'use strict'

namespace 'Alcarin.Game.Views.Map', (exports, Alcarin) ->

    pixelRadius = 0

    exports.Chars = ngcontroller ['GameServer', 'CurrentCharacter', '$safeApply', 'GameObjectFactory',
        (GameServer, CurrentCharacter, $safeApply, Factory)->
            @charslist  = {}

            GameServer.on 'chars.swap', (chars)=>
                @BackgroundReady.then (units)=>
                    @charslist = {}
                    for _char in chars
                        _char.pixelLoc = units.toPixels(_char.loc.x, _char.loc.y)
                        _char.type = 'char'
                        Factory.character(_char).then (obj)=>
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
                        @BackgroundReady.then (units)=>
                            _char.pixelLoc = units.toPixels _char.loc.x, _char.loc.y
                            console.log _char.pixelLoc
    ]

    class exports.Characters extends Alcarin.EventsEmitter
        charsbyId          : {}

        constructor: (element, @Services)->
            @table = $ '<div>', {class: 'characters', position: 'relative'}
            $(element).append @table

            GameServer      = @Services.get('GameServer')
            @CoordConverter = @Services.get('CoordConverter')
            @CurrentCharacter = @Services.get('CurrentCharacter')
            GameServer.on 'chars.swap', @onCharactersSwap

        onGameEvent: (gameEvent)=>
            if gameEvent.system and gameEvent.id is 'char.update'
                charid = gameEvent.args[0]
                @CurrentCharacter.then (current)=>
                    loc    = gameEvent.args[1]
                    if current._id == charid
                        current.loc = loc
                        # we not move current character, but swap full map
                        @Services.get('MapReset')()
                    else
                        element = @charsbyId[charid]
                        @CoordConverter.done (Coords)=>
                            pLoc = Coords.toPixels loc.x, loc.y
                            element.position {left: pLoc.x, top: pLoc.y}

        clearChars: ->
            console.log 'removing..'
            element.remove() for id, element of @charsbyId
            @charsbyId = {}

        createCharacterElement: (pLoc, character)->
            # grouping characters
            # for $element in @charsRepresentation
            #     loc = $element.position()
            #     distance = Math.sqrt Math.pow(loc.left - pLoc.x, 2) + Math.pow(loc.top - pLoc.y, 2)
            #     if distance < 5
            #         title = $element.children().attr 'title'
            #         $element.children().attr 'title', "#{title}\n#{character.name}"
            #         $element.data('rel').push character
            #         return $element

            element = $ '<div>', {class: 'character'}
            element.position {left: pLoc.x, top: pLoc.y}
            element.append $ '<div>'
            element.children().attr 'title', "#{character.name}"
            element.data 'rel', [character]

            @table.append element
            @charsbyId[character._id] = element
            return element

        onCharactersSwap: (chars)=>
            @CurrentCharacter.then (currChar)=>
                    for character in chars
                        loc  = character.loc
                        pLoc = Coords.toPixels loc.x, loc.y
                        $element = @createCharacterElement pLoc, character
                        $element.addClass 'current' if currChar._id == character._id

