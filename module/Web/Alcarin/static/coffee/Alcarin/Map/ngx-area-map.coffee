'use strict'

angular.module('@area-map').directive 'alcAreaMap', ->
        restrict:'A'
        link: ($scope, element, attrs)->
            layers = [
                Alcarin.Map.Layers.Terrain
            ]
            painter = new Alcarin.Map.Painter element, layers
            element.data 'map-painter', painter

            ['terrain.update'].forEach (eventId)->
                $scope.$on eventId, (ev, args...)->
                    painter.$broadcast.apply painter, [eventId].concat args