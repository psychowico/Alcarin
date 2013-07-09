'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    socket_port = 8080

    exports.module = angular.module('game', ['@spin', 'ui.event', '@talk-input',
            '@area-map', '@game-server'])
           .config ['$routeProvider', ($routeProvider)->
                $routeProvider
                    .when '/home',
                        controller: Alcarin.Game.Views.Home
                        templateUrl: urls.game.panel + '/__home'
                    .otherwise
                        redirectTo:'/home'
            ]

    exports.App = ngcontroller ['$window', 'GameServer', ($window, GameServer)->
        GameServer.init $window.charid
    ]