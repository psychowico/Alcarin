'use strict'

namespace 'Alcarin.Game.Directives', (exports, Alcarin) ->

    angular.module('@talk-input').directive 'alcTalkingInput', ['$rootScope', ($rootScope)->
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
                    $rootScope.$safeApply -> $scope.alcTalkingInput {$content: content}
    ]