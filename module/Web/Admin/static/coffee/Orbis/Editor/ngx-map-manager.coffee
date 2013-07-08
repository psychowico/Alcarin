'use strict'

namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    angular.module('@map-manager').directive 'alcMapManager',
        ['@EventsBus', (EventsBus)->
            restrict:'A'
            scope:
                onMapChange: '&mapChange'
                changes: '=mapChanges'
                mapFields : '='
                mapCenter : '='
                mapSize   : '='
                mapBrush  : '='
            link: ($scope,canvas,attrs)->
                plugins = [
                    Admin.Map.Layers.EditableTerrain
                ]
                painter = new Alcarin.Map.Painter canvas, plugins
                canvas.data 'map-painter', painter

                painter.$on 'changes-confirmed', ->
                    if $scope.$$phase
                        $scope.onMapChange()
                    else
                        $scope.$apply -> $scope.onMapChange()
                painter.$on 'field-changed', (field,data)->
                    $scope.changes["#{field.x},#{field.y}"] = data

                $scope.$watch 'mapFields', (val)->
                    if val? and $scope.mapSize > 0
                        painter.$broadcast 'set-center', $scope.mapCenter.x, $scope.mapCenter.y
                        painter.$broadcast 'fields-fetched', $scope.mapSize, val

                $scope.$watch 'mapBrush', (brush)->
                    painter.$broadcast 'brush-changed', brush
        ]