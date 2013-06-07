'use strict';

namespace('Alcarin.Angular', function(exports, Alcarin) {
  return angular.module('@jquery-anims').animation('$slideDown', function() {
    return {
      setup: function(element) {
        return element.hide();
      },
      start: function(element, done) {
        return element.slideDown(function() {
          return done();
        });
      }
    };
  }).animation('$slideUp', function() {
    return {
      start: function(e, done) {
        return e.slideUp(function() {
          return done();
        });
      }
    };
  });
});
