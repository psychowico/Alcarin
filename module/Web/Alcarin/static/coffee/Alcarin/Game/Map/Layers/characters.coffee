namespace 'Alcarin.Game.Map.Layers', (exports, Alcarin) ->

    class exports.Characters extends Alcarin.EventsEmitter
        # charsRepresentation: []
        charsbyId          : {}

        constructor: (element, @Services)->
            @table = $ '<div>', {class: 'characters', position: 'relative'}
            $(element).append @table

            GameServer = @Services.get('GameServer')
            @CoordConverter = @Services.get('CoordConverter')
            GameServer.on 'chars.swap', @onCharactersSwap
            GameServer.on 'game-event.add', @onGameEvent

        onGameEvent: (gameEvent)=>
            if gameEvent.system and gameEvent.id is 'char.update'
                charid = gameEvent.args[0]
                loc    = gameEvent.args[1]
                element = @charsbyId[charid]
                @CoordConverter.done (Coords)=>
                    pLoc = Coords.toPixels loc.x, loc.y
                    element.position {left: pLoc.x, top: pLoc.y}

        clearChars: ->
            element.remove() for id, element of @charsbyId
            @charsbyId = {}

        setTarget: (@charPromise)->

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
            @charPromise.done (currChar)=>
                @clearChars()
                @CoordConverter.done (Coords)=>
                    for character in chars
                        loc  = character.loc
                        pLoc = Coords.toPixels loc.x, loc.y
                        $element = @createCharacterElement pLoc, character
                        $element.addClass 'current' if currChar._id == character._id

