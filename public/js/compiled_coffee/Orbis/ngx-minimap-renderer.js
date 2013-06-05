'use strict';

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  return angular.module('@minimap-renderer').directive('alcMinimapRenderer', function() {
    return {
      restrict: 'A',
      link: function($scope, el, attrs) {
        var renderer;
        renderer = new Alcarin.Orbis.MinimapRenderer(el);
        el.data('minimap', renderer);
        return renderer.init();
      }
    };
  });
});
