'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    socket_port = 8080

    exports.module = angular.module('game', ['@spin', 'ui.event', '@talk-input',
            '@game-services', '@alcarin-map'])
           .config ['$routeProvider', ($routeProvider)->
                $routeProvider
                    .when '/home',
                        controller: Alcarin.Game.Views.Home
                        templateUrl: urls.game.panel + '/__home'
                    .otherwise
                        redirectTo:'/home'
            ]

    exports.App = ngcontroller ['$window', 'CurrentCharacter', 'GameServer',
        ($window, CurrentCharacter, GameServer)->
            @charid = $window.charid

            GameServer.init charid
            CurrentCharacter.init charid

    ]