'use strict'

namespace 'Alcarin.Game.Services', (exports, Alcarin) ->


    exports.module = angular.module('@game-services', ['ngCookies'])
        .factory 'GameServer', ['$location', '$cookies', '$rootScope', '$q',
            ($location, cookies, $rootScope, $q)->
                console.info 'creating server service..'
                service = new ServerConnector $location.host(), socket_port,
                                              cookies.alcarin, $rootScope, $q
                return service
    ]

    socket_port = 8080

    # in ServerConnector we use normal Q promises, not angularjs $q
    class ServerConnector

        constructor: (@host, @port, @sessionid, @$scope, @$q)->
            @initSocket         = @_loadSocketLibrary @host, @port
            @resetAuth()

        resetAuth: =>
            @authorizationToken = Q.defer()
            @authorization      = @authorizationToken.promise
            # after authorization we ask server or all full pack
            # of datas, to swap events, map, etc.
            @authorization.then =>
                console.log 'authorized..'
                @emit 'swap.all'

        init: (@charid)->
            @initSocket.then @socketInitialized

        on: (eventId, callback)->
            if not callback?
                throw Error "Can not react on undefined event. Event name: #{eventId}"
            scope = @$scope
            safeCallback = (args...)-> scope.$safeApply -> callback.apply @, args
            @initSocket.done (socket)->
                socket.on eventId, safeCallback
            return @

        # one called 'on' but return promise instead using callback
        one: (eventId)->
            scope    = @$scope
            deffered = @$q.defer()

            @initSocket.done (socket)->
                callback = (args...)->
                    socket.of callback
                    scope.$safeApply -> deffered.resolve args

                socket.on eventId, callback

            return deffered.promise

        emit: (eventId, _args...)->
            emitting = Q.all([@initSocket, @authorization]).spread (socket)->
                socket.emit eventId, _args...
            emitting.done()
            return @

        socketInitialized: (socket)=>
            socket.on 'connect', @authorize
            socket.on 'disconnect', =>
                console.warn 'GameServer disconnected.'
                @resetAuth()
            socket.on 'client.authorized', => @authorizationToken.resolve()

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