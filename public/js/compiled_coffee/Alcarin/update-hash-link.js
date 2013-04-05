var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin', function(exports, Alcarin) {
  var _this = this;
  exports.UpdateHashLink = (function() {

    UpdateHashLink.maxid = 0;

    UpdateHashLink.prototype.id = 0;

    UpdateHashLink.prototype._el = null;

    UpdateHashLink.default_options = {
      event: 'click',
      target_state: null
    };

    UpdateHashLink.prototype._activate = function() {
      if (this._options.target_state instanceof Function) {
        this._options.target_state = this._options.target_state.call(this._el);
      }
      $.bbq.pushState(this._options.target_state);
      return false;
    };

    function UpdateHashLink(el, options) {
      this._activate = __bind(this._activate, this);
      this.id = UpdateHashLink.maxid++;
      this._options = $.extend({}, exports.UpdateHashLink.default_options, options);
      this._el = $(el);
      this._el.on(this._options.event, this._activate);
    }

    return UpdateHashLink;

  })();
  exports.TestClass = (function() {
    var hashchange;

    function TestClass() {
      this.init = __bind(this.init, this);

    }

    hashchange = function(e) {
      var state;
      state = $.bbq.getState() || {};
      $('.pages-container > .current').removeClass('current').fadeOut();
      $('.pages-container > .page-' + state.href).addClass('current').fadeIn();
      $('#main-nav > nav > ul > .current').removeClass('current');
      $('#main-nav a[data-hash-href="' + state.href + '"]').closest('li').addClass('current');
      return false;
    };

    TestClass.prototype.init = function() {
      $(window).bind('hashchange', hashchange);
      /*$('#main-nav a').on 'click', ->
          href = $(@).attr('href').replace /^#/, ''
          state = { 'href': href }
          $.bbq.pushState( state )
          false
      */

      return false;
    };

    return TestClass;

  })();
  return $(function() {
    var test;
    $.fn.hashLink = function(_target_state, _options) {
      return this.each(function() {
        var data, key, link, new_key, obj, options, target_state;
        target_state = _target_state;
        options = _options;
        if (!(target_state != null)) {
          target_state = {};
          data = $(this).data();
          for (key in data) {
            obj = data[key];
            if (/^hash[A-Z]/.test(key)) {
              new_key = key.replace(/^hash/, '');
              target_state[new_key.toLowerCase()] = obj;
            }
          }
        }
        options = options || {};
        options.target_state = target_state;
        link = new Alcarin.UpdateHashLink(this, options);
        return $(this).data('hashLink', link);
      });
    };
    $('.active-link').hashLink();
    $('#active-select').data('hash-test', 313).hashLink();
    test = new Alcarin.TestClass();
    test.init();
    jQuery.fx.off = true;
    $(window).trigger('hashchange');
    return jQuery.fx.off = false;
  });
});
