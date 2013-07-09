'use strict'

namespace 'Alcarin.Game.Directives', (exports, Alcarin) ->

    angular.module('@talk-input').directive 'alcTalkingInput', ->
        restrict:'A'
        scope:
            alcTalkingInput: '&'
        link: ($scope, input, attrs)->
            input.on 'keydown', (ev)->
                wantSending = ev.keyCode is 13 and not ev.shiftKey
                if wantSending
                    ev.preventDefault()
                    content = input.val()
                    input.val ''
                    $scope.alcTalkingInput {$content: content}