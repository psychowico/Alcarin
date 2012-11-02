var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin', function(exports, Alcarin) {
  var _this = this;
  exports.TestClass = (function() {
    var hashchange;

    function TestClass() {
      this.init = __bind(this.init, this);

    }

    hashchange = function(e) {
      var state;
      state = $.bbq.getState() || {};
      window.scrollTo(0, 0);
      $('.pages-container > .current').removeClass('current').fadeOut();
      $('.pages-container > .page-' + state.href).addClass('current').fadeIn();
      return true;
    };

    TestClass.prototype.init = function() {
      $(window).bind('hashchange', hashchange);
      $('a').on('click', function() {
        var href, state;
        href = $(this).attr('href').replace(/^#/, '');
        state = {
          'href': href
        };
        $.bbq.pushState(state);
        return false;
      });
      return false;
    };

    return TestClass;

  })();
  return $(function() {
    var test;
    test = new Alcarin.TestClass();
    return test.init();
  });
});
