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
                    .otherwise
                        redirectTo:'/home'
            ]

    # don't delete MapBackground - it need initialization somewhere
    exports.App = ngcontroller ['$window', 'CurrentCharacter', 'GameServer', 'MapBackground',
        ($window, CurrentCharacter, GameServer, MapBackground)->
            @charid = $window.charid
            @interface = Alcarin.Game.Interfaces.Test

            GameServer.init charid
            CurrentCharacter.init charid

    ]
