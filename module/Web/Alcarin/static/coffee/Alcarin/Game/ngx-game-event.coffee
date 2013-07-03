'use strict'

namespace 'Alcarin.Game', (exports, Alcarin) ->

    angular.module('@game-event').directive 'alcGameEvent', ->
        restrict:'A'
        scope:
            alcGameEvent: '='
        link: ($scope,element,attrs)->
            for ev in $scope.alcGameEvent
                if $.isPlainObject ev
                    source = ev.__base
                    element.append $ '<a>',
                        text: ev.text
                        href: "#" #/action/#{source.type}/#{source.id}"
                        'ng-click': ->
                            console.log 'test'
                else
                    element.append $ '<span>', {text: ev}
            # model = attrs['ngModel']

            # $scope.$watch attrs['alcChosenWatch'], ->
            #     element.trigger 'liszt:updated'

            # # Added this in so that you could preselect items
            # $scope.$watch model, ->
            #     element.trigger "liszt:updated"
