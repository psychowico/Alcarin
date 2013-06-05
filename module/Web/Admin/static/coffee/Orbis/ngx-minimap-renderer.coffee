'use strict'

namespace 'Alcarin.Orbis', (exports, Alcarin) ->

    angular.module('@minimap-renderer').directive 'alcMinimapRenderer', ->
            restrict:'A',
            link: ($scope, el,attrs)->
                renderer = new Alcarin.Orbis.MinimapRenderer el
                el.data 'minimap', renderer
                renderer.init()