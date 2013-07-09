'use strict'

namespace 'Alcarin.Game.Services', (exports, Alcarin) ->


    exports.module = angular.module('@game-services', ['ngCookies'])
        .factory 'GameServer', ['$location', '$cookies', '$rootScope',
            ($location, cookies, $rootScope)->
                console.info 'creating server service..'
                service = new ServerConnector $location.host(), socket_port,
                                              cookies.alcarin, $rootScope
                return service
    ]

    socket_port = 8080

    class ServerConnector

        constructor: (@host, @port, @sessionid, @$scope)->
            @initSocket         = @_loadSocketLibrary @host, @port
            @resetAuth()

        resetAuth: =>
            @authorizationToken = Q.defer()
            @authorization      = @authorizationToken.promise
            # after authorization we ask server or all full pack
            # of datas, to swap events, map, etc.
            @authorization.then => @emit 'swap.all'

        init: (@charid)->
            @initSocket.then @socketInitialized

        on: (eventId, callback)->
            scope = @$scope
            safeCallback = (args...)-> scope.$safeApply -> callback.apply @, args
            @initSocket.then (socket)->
                socket.on eventId, safeCallback
            return @

        emit: (eventId, _args)->
            Q.all(@initSocket, @authorization).then (socket)->
                socket.emit.apply socket, [eventId].concat _args
            return @

        socketInitialized: (socket)=>
            socket.on 'connect', @authorize
            socket.on 'disconnect', =>
                console.warn 'GameServer disconnected.'
                @resetAuth()
            socket.on 'authorized', => @authorizationToken.resolve()

        authorize: =>
            @initSocket.then (socket)=>
                socket.emit 'auth',
                    charid : @charid
                    session: @sessionid

        _loadSocketLibrary: (host, socket_port)->

            # we need use this trick, because error callback is never call by
            # jquery when we use crossdomain (diffrent port is crossdomain :/)
            # GET.
            deffered = Q.defer()

            loaded = false

            host = @host
            port = @port
            url = "http://#{host}:#{port}/socket.io/socket.io.js"

            loadScript = (intId)->
                $.getScript url, ->
                    window.clearInterval intId
                    socket = io.connect "#{host}:#{port}"
                    deffered.resolve socket

            intId = window.setInterval (-> loadScript intId), 5000
            loadScript intId

            deffered.promise