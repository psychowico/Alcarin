'use strict'

namespace 'Alcarin.Game.Directives.Map', (exports, Alcarin) ->

    # this directive will observe target object position and update it on
    # map, related with map scale etc.
    exports.module.directive 'alcMapTracker', ['MapBackground', '$q',
        (MapBackground, $q)->
            restrict: 'A'
            scope:
                alcMapTracker: '='
                alcOnPositionChange: '&'
            link: ($scope, $token, attrs)->
                MapBackground.dataReady().then (map)->
                    setPosition = ->
                        target = $scope.alcMapTracker
                        $token.data 'rel', target
                        loc = target?.loc
                        console.warn "Not found 'loc' property in #{target}" if not loc?
                        return if not loc?
                        ploc = map.units().toPixels loc.x, loc.y
                        $token.position {top: ploc.y, left: ploc.x}
                        $scope.alcOnPositionChange?()
                        $token.show()

                    $scope.$watch 'alcMapTracker.loc', setPosition
                    MapBackground.$on 'swap', setPosition
                    MapBackground.$on 'zoom', setPosition
    ]
