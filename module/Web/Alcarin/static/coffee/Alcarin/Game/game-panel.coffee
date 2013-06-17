'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    angular.module 'game-panel'

    exports.GameEvents = ngcontroller ->
        @events = [
            {text: 'test1'}
            {text: 'test2'}
        ]