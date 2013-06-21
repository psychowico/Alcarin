namespace 'Alcarin.Game', (exports, Alcarin) ->

    angular.module('@game-events')
        .factory('Events', ['$http', ($http)->
            meth = (action, _data)->
                if _data?
                    $http
                        url    : "#{urls.game.character.events}/#{action}",
                        method : 'POST'
                        data   : $.param _data
                        headers:
                            'Content-Type': 'application/x-www-form-urlencoded'
                else
                    $http.get "#{urls.game.character.events}/#{action}"
            {
                fetch: -> meth 'fetch'
                talk: (_content)-> meth 'publicTalk',
                    content: _content
            }
        ])
        .filter('EventTime', ->
            (time)->
                return time if isNaN time
                _time = new GameTime time
                return _time.print_long()
        )

    class GameTime
        @resolved = false

        pad = (number)->
            return "0#{number}" if number < 10
            return number + ''

        constructor: (@timestamp)->

        _resolve: ->
            return true if @resolved
            @day  = Math.floor @timestamp / 345600
            @hour = pad Math.floor (@timestamp % 345600) / 3600
            @min  = pad Math.floor (@timestamp % 3600) / 60
            @sec  = pad @timestamp % 60
            @resolved = true

        print_short: ->
            @_resolve()
            "#{@hour}:#{@min}:#{@sec}"

        print_long: ->
            @_resolve()
            "#{@day} - #{@hour}:#{@min}:#{@sec}"
