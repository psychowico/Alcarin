var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Admin', function(exports, Alcarin) {
  var TranslateArgumentView, TranslateFormView;
  exports.TranslationsDefCenter = (function() {

    function TranslationsDefCenter(source) {
      this.source = source;
      this.on_sentence_changed = __bind(this.on_sentence_changed, this);

      this.on_sentences_reload = __bind(this.on_sentences_reload, this);

      this.remove_argument = __bind(this.remove_argument, this);

      this.add_argument = __bind(this.add_argument, this);

      this.arg_desc_change = __bind(this.arg_desc_change, this);

      this.arg_changed = __bind(this.arg_changed, this);

      this.proxy = new Alcarin.EventProxy(urls.translations);
    }

    TranslationsDefCenter.prototype.arg_changed = function(e) {
      var ref, sel;
      this.form_view.arg_descr('');
      sel = $(e.currentTarget).find(':selected');
      if (sel.size() > 0) {
        ref = sel.data('active-view');
        return this.form_view.arg_descr(ref.descr);
      }
    };

    TranslationsDefCenter.prototype.arg_desc_change = function(e) {
      var arg, sel;
      sel = this.form_view.args().parents.val();
      if (sel !== null) {
        arg = this.form_view.args().iterator()[sel];
        return arg.descr = $(e.currentTarget).val();
      }
    };

    TranslationsDefCenter.prototype.add_argument = function(e) {
      var index, _arg;
      index = this.form_view.args().length();
      _arg = new TranslateArgumentView;
      _arg.update_index(index);
      _arg.descr = "argument " + index + " description";
      this.form_view.args().push(_arg);
      this.form_view.args().parents.val(index);
      this.form_view.args().parents.trigger('change');
      return false;
    };

    TranslationsDefCenter.prototype.remove_argument = function(e) {
      var arg, i, max, sel, _i;
      sel = this.form_view.args().parents.val();
      if (sel !== null) {
        this.form_view.args().removeAt(sel);
        max = this.form_view.args().length() - 1;
        for (i = _i = sel; sel <= max ? _i <= max : _i >= max; i = sel <= max ? ++_i : --_i) {
          console.log(i);
          arg = this.form_view.args().iterator()[i];
          arg.update_index(i);
        }
      }
      return false;
    };

    TranslationsDefCenter.prototype.on_sentences_reload = function(response) {
      var option, sentence, _i, _len, _ref;
      if (response.success) {
        this.phrases_list.empty();
        _ref = response.def;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sentence = _ref[_i];
          option = $('<option>', {
            text: sentence.key
          });
          option.data('ref', sentence);
          this.phrases_list.append(option);
        }
        this.phrases_list.update_chosen();
        this.phrases_list.parent().spin(false);
        return this.phrases_list.trigger('change');
      }
    };

    TranslationsDefCenter.prototype.on_sentence_changed = function(response) {
      var arg, args, def, index, _arg, _i, _len;
      this.form.spin(false);
      if (response.success) {
        def = response.def;
        this.form_view.descr(def.descr);
        args = def.args || [];
        this.form_view.args().clear();
        for (index = _i = 0, _len = args.length; _i < _len; index = ++_i) {
          arg = args[index];
          _arg = new TranslateArgumentView;
          _arg.update_index(index);
          _arg.descr = arg.descr || '';
          this.form_view.args().push(_arg);
        }
        return this.form.find('select.args').val(0).trigger('change');
      }
    };

    TranslationsDefCenter.prototype.init = function() {
      var form_view,
        _this = this;
      this.proxy.on('sentences.def.reload', this.on_sentences_reload);
      this.proxy.on('sentence.def.changed', this.on_sentence_changed);
      this.group_choose = this.source.find('.choose-group');
      this.phrases_list = this.source.find('.phrases-list');
      this.source.find('.arguments .plus').on('click', this.add_argument);
      this.source.find('.arguments .minus').on('click', this.remove_argument);
      this.source.find('.arguments .arg-descr').on('keyup', this.arg_desc_change);
      this.form_view = form_view = new TranslateFormView();
      form_view.bind('.translation-panel form');
      form_view.args();
      this.form = form_view.rel;
      this.form.find('select.args').on('change', this.arg_changed);
      this.phrases_list.on('change', function() {
        var option;
        if (_this.phrases_list.val() != null) {
          _this.form.spin(true);
          option = _this.phrases_list.children(':selected');
          return _this.proxy.emit('sentence.def.change', {
            id: option.data('ref').id
          });
        }
      });
      this.group_choose.on('change', function() {
        _this.phrases_list.parent().spin(true);
        return _this.proxy.emit('group.def.change', {
          group: _this.group_choose.val()
        });
      });
      return this.group_choose.trigger('change');
    };

    return TranslationsDefCenter;

  })();
  TranslateArgumentView = (function(_super) {

    __extends(TranslateArgumentView, _super);

    function TranslateArgumentView() {
      this.update_index = __bind(this.update_index, this);
      return TranslateArgumentView.__super__.constructor.apply(this, arguments);
    }

    TranslateArgumentView.prototype.val = TranslateArgumentView.dependencyProperty('val');

    TranslateArgumentView.prototype.name = TranslateArgumentView.dependencyProperty('name');

    TranslateArgumentView.prototype.descr = '';

    TranslateArgumentView.prototype.update_index = function(index) {
      this.val(index);
      return this.name("arg-" + index);
    };

    return TranslateArgumentView;

  })(Alcarin.ActiveView);
  return TranslateFormView = (function(_super) {

    __extends(TranslateFormView, _super);

    function TranslateFormView() {
      return TranslateFormView.__super__.constructor.apply(this, arguments);
    }

    TranslateFormView.prototype.descr = TranslateFormView.dependencyProperty('description');

    TranslateFormView.prototype.arg_descr = TranslateFormView.dependencyProperty('descr_arg', '');

    TranslateFormView.prototype.args = TranslateFormView.dependencyList('.arguments select');

    return TranslateFormView;

  })(Alcarin.ActiveView);
});
