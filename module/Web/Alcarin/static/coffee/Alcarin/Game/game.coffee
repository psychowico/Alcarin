'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    socket_port = 8080

    exports.module = angular.module('game', ['@spin', 'ui.event', '@talk-input',
            '@game-services', '@alcarin-map', '@popover', 'ngRoute'])
           .config ['$routeProvider', ($routeProvider)->
                $routeProvider
                    .when '/home',
                        controller: Alcarin.Game.Views.Home
                        templateUrl: urls.game.panel + '/__home'
                    .when '/chars',
                        controller: Alcarin.Game.Views.Chars
                        templateUrl: urls.game.panel + '/__chars'
                    .when '/place-default',
                        controller: Alcarin.Game.Views.Place.Default
                        templateUrl: urls.game.panel + '/__place-default'
                    .otherwise
                        redirectTo:'/home'
            ]

    # core controller, root in game custom controllers hierarchy
    AppBody = ($window, $safeApply, CurrentCharacter, GameServer, MapBackground,
        $location)->
            @charid    = $window.charid
            @interface = null
            @outside   = true

            GameServer.init charid
            CurrentCharacter.init charid

            @$watch 'outside', => @updateInterface()
            @toggleOutside = => @outside = not @outside

            @updateInterface = =>
                I = Alcarin.Game.Interfaces
                _interface = I.Default
                if not @outside
                    _interface = I.Place

                if @interface != _interface
                    $location.path _interface.mainbar[0].href
                    @interface = _interface

            CurrentCharacter.then (current)=>
                @outside = !current.loc.place?
                # set starting interface
            @updateInterface()

    # don't delete MapBackground - it need initialization somewhere
    exports.App = ngcontroller ['$window', '$safeApply', 'CurrentCharacter',
            'GameServer', 'MapBackground', '$location', AppBody]

