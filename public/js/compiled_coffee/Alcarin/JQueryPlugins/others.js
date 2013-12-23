namespace('Alcarin.JQueryPlugins', function(exports, Alcarin) {
  var def_spin, _old_position;
  $.fn.enableSmoothing = function() {
    var context;
    context = this[0];
    return context.webkitImageSmoothingEnabled = context.mozImageSmoothingEnabled = true;
  };
  $.fn.disable = function(recursive) {
    if (recursive == null) {
      recursive = false;
    }
    return this.each(function() {
      $(this).attr('disabled', 'disabled');
      if (recursive) {
        return $(this).find('*').attr('disabled', 'disabled');
      }
    });
  };
  $.fn.enable = function(value, recursive) {
    if (recursive == null) {
      recursive = false;
    }
    return this.each(function() {
      if (value === false) {
        $(this).attr('disabled', 'disabled');
        if (recursive) {
          return $(this).find('*').attr('disabled', 'disabled');
        }
      } else {
        $(this).removeAttr('disabled');
        if (recursive) {
          return $(this).find('*').removeAttr('disabled');
        }
      }
    });
  };
  $.fn.enabled = function() {
    return this.first().attr('disabled') === void 0;
  };
  $.fn.disabled = function() {
    return this.first().attr('disabled') !== void 0;
  };
  $.fn.reset = function() {
    return this.each(function() {
      return this.reset();
    });
  };
  $.fn.center = function() {
    var _;
    _ = $(this);
    return {
      left: _.width() / 2,
      top: _.height() / 2
    };
  };
  $.fn.disableSelection = function() {
    return this.attr('unselectable', 'on').css('user-select', 'none');
  };
  _old_position = $.fn.position;
  $.fn.position = function(arg) {
    if ($.isPlainObject(arg)) {
      if (arg.top != null) {
        this.css('top', "" + arg.top + "px");
      }
      if (arg.left != null) {
        this.css('left', "" + arg.left + "px");
      }
      return this;
    }
    return _old_position.call(this);
  };
  def_spin = {
    lines: 10,
    length: 5,
    width: 2,
    radius: 2,
    corners: 1,
    rotate: 0,
    color: '#000',
    speed: 1,
    trail: 60,
    shadow: false,
    hwaccel: false,
    className: 'spinner',
    zIndex: 2e9,
    top: 'auto',
    left: 'auto'
  };
  $.fn.spin = function(opts) {
    this.each(function() {
      var $el, options, spinner;
      $el = $(this);
      spinner = $el.data('spinner');
      if (spinner != null) {
        if (opts !== true) {
          spinner.stop();
          return $el.removeData('spinner');
        }
      } else {
        if (opts !== false) {
          options = jQuery.extend(def_spin, {
            color: $el.css('color')
          });
          if (opts === !false) {
            options = jQuery.extend(options, opts);
          }
          spinner = new Spinner(options);
          spinner.spin(this);
          return $el.data('spinner', spinner);
        }
      }
    });
    return this;
  };
  return $.fn.update_chosen = function() {
    return $(this).each(function() {
      return $(this).trigger("liszt:updated");
    });
  };
});

/*
//@ sourceMappingURL=others.js.map
*/
