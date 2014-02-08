'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    exports.module.directive 'alcPlaceToken', ['MapBackground',
        (MapBackground)->
            scope:
                alcPlaceToken: '='
            link: ($scope,$token,attrs)->
                setPosition = ->
                    loc = $scope.alcPlaceToken?.loc
                    return if not loc?
                    MapBackground.dataReady().then (map)->
                        ploc = map.units().toPixels loc.x, loc.y
                        $token.position {top: ploc.y, left: ploc.x}
                        $token.show()

                $scope.$watch 'alcPlaceToken.loc', setPosition
                # MapBackground.$on 'zoom', resetPosition
    ]
