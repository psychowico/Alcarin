var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.JQueryPlugins', function(exports, Alcarin) {
  exports.AlcarinForm = (function() {

    function AlcarinForm(base) {
      this.base = base;
      this._on_response = __bind(this._on_response, this);

      this._on_submit = __bind(this._on_submit, this);

      this.enable = __bind(this.enable, this);

      this.disable = __bind(this.disable, this);

      this.base.on('submit', this._on_submit);
    }

    AlcarinForm.prototype.enable_proxy = function(proxy, emit_order, response_event) {
      if (this.proxy != null) {
        if (this.response_event != null) {
          this.proxy.off(this.response_event, this._on_response);
        }
        this.proxy.off('response.empty', this.enable);
      }
      this.proxy = proxy;
      if (emit_order != null) {
        this.set_emit_order(emit_order);
      }
      if (response_event != null) {
        this.set_response_event(response_event);
      }
      return this.proxy.on('response.empty', this.enable);
    };

    AlcarinForm.prototype.on_success = function(callback) {
      return this.on_success_callback = callback;
    };

    AlcarinForm.prototype.on_fail = function(callback) {
      return this.on_fail_callback = callback;
    };

    AlcarinForm.prototype.set_emit_order = function(emit_order) {
      if (!(this.proxy != null)) {
        throw Error('Enable form proxy first.');
      }
      return this.emit_order = emit_order;
    };

    AlcarinForm.prototype.set_response_event = function(response_event) {
      if (!(this.proxy != null)) {
        throw Error('Enable form proxy first.');
      }
      this.proxy.off(this.response_event, this._on_response);
      this.proxy.on(response_event, this._on_response);
      return this.response_event = response_event;
    };

    AlcarinForm.prototype.disable = function() {
      return this.base.find(':submit').disable();
    };

    AlcarinForm.prototype.enable = function() {
      return this.base.find(':submit').enable();
    };

    AlcarinForm.prototype._on_submit = function() {
      if (this.base.find(':submit').disabled()) {
        return false;
      }
      if (this.proxy != null) {
        this.disable();
        this.proxy.emit(this.emit_order, this.base.serializeForm());
        return false;
      }
    };

    AlcarinForm.prototype._on_response = function(response) {
      if (response.success) {
        if (typeof this.on_success_callback === "function") {
          this.on_success_callback(response);
        }
      } else {
        this._sign_error_fields(response.errors);
        if (typeof this.on_fail_callback === "function") {
          this.on_fail_callback(response);
        }
      }
      this._clear_error_fields();
      return this.enable();
    };

    AlcarinForm.prototype._clear_error_fields = function() {
      this.base.find('.control-group').removeClass('error');
      return this.base.find('.tmp-line').remove();
    };

    AlcarinForm.prototype._sign_error_fields = function(wrong_fields) {
      var control, error, error_line, field, id, value, _results;
      this._clear_error_fields();
      _results = [];
      for (field in wrong_fields) {
        value = wrong_fields[field];
        control = this.base.find("[name='" + field + "']");
        control.closest('.control-group').addClass('error');
        for (id in value) {
          error = value[id];
          break;
        }
        error_line = $('<span>', {
          "class": 'help-inline tmp-line',
          text: error
        });
        _results.push(control.after(error_line));
      }
      return _results;
    };

    AlcarinForm.prototype.reset = function() {
      this._clear_error_fields();
      return this.base.reset();
    };

    return AlcarinForm;

  })();
  $.fn.alcForm = function() {
    var $form, alc_form;
    $form = this.filter('form').first();
    alc_form = $form.data('alcarin-form');
    if (!(alc_form != null)) {
      alc_form = new Alcarin.JQueryPlugins.AlcarinForm($form);
      $form.data('alcarin-form', alc_form);
    }
    return alc_form;
  };
  $.fn._method = function(method) {
    if (!(method != null)) {
      return this.filter('form').first().find('input[name="_method"]').val().toLowerCase();
    }
    method = method.toUpperCase();
    return this.filter('form').each(function() {
      return $(this).find('input[name="_method"]').val(method);
    });
  };
  return $.fn.serializeForm = function() {
    var o, result, _i, _len, _ref;
    result = {};
    _ref = this.serializeArray();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      o = _ref[_i];
      result[o.name] = o.value;
    }
    return result;
  };
});
