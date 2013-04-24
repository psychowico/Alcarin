var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Admin', function(exports, Alcarin) {
  var TranslateArgumentView, TranslateFormView;
  exports.TranslationsDefCenter = (function() {

    TranslationsDefCenter.prototype.last_selected_arg = null;

    TranslationsDefCenter.prototype.empty_arg = null;

    function TranslationsDefCenter(source) {
      this.source = source;
      this.on_sentence_changed = __bind(this.on_sentence_changed, this);

      this.on_sentences_reload = __bind(this.on_sentences_reload, this);

      this.remove_argument = __bind(this.remove_argument, this);

      this.add_argument = __bind(this.add_argument, this);

      this.arg_change = __bind(this.arg_change, this);

      this.arg_selected = __bind(this.arg_selected, this);

      this.on_sentence_def_created = __bind(this.on_sentence_def_created, this);

      this.new_tag_confirm = __bind(this.new_tag_confirm, this);

      this.on_sentence_saved = __bind(this.on_sentence_saved, this);

      this.new_tag_changed = __bind(this.new_tag_changed, this);

      this.submit_changes = __bind(this.submit_changes, this);

      this.proxy = new Alcarin.EventProxy(urls.translations);
    }

    TranslationsDefCenter.prototype.submit_changes = function() {
      var arg, option, result, _i, _len, _ref;
      option = this.phrases_list.children(':selected');
      result = {
        id: option.data('ref').id,
        descr: this.form.find('.description textarea').val(),
        content: this.form.find('.content textarea').val(),
        args: []
      };
      _ref = this.form_view.args().iterator();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        arg = _ref[_i];
        result.args.push({
          descr: arg.descr(),
          type: arg.type()
        });
      }
      this.form.spin(true);
      this.proxy.emit('sentence.def.save', result);
      return false;
    };

    TranslationsDefCenter.prototype.new_tag_changed = function(e) {
      var err, res, sender, val;
      sender = $(e.currentTarget);
      val = sender.val();
      res = this.phrases_list.find("option[value=\"" + val + "\"]");
      err = res.length > 0 || val === '';
      sender.parent().toggleClass('error', err);
      return $('#add-tag-modal .btn-primary').enable(!err);
    };

    TranslationsDefCenter.prototype.on_sentence_saved = function(response) {
      if (response.success) {
        return this.form.spin(false);
      }
    };

    TranslationsDefCenter.prototype.new_tag_confirm = function() {
      return this.proxy.emit('sentence.def.create', {
        group: this.group_choose.val(),
        name: $('#new-tag-name').val()
      });
    };

    TranslationsDefCenter.prototype.on_sentence_def_created = function(response) {
      if (response.success) {
        return this.group_choose.trigger('change');
      }
    };

    TranslationsDefCenter.prototype.arg_selected = function(e) {
      var ref, sel;
      if (this.last_selected_arg !== null) {
        this.last_selected_arg.unbind('.selected-arg');
        this.last_selected_arg = null;
      } else {
        this.empty_arg.unbind('.selected-arg');
      }
      sel = $(e.currentTarget).find(':selected');
      if (sel.size() > 0) {
        ref = sel.data('active-view');
        ref.bind('.selected-arg');
        return this.last_selected_arg = ref;
      } else {
        return this.empty_arg.bind('.selected-arg');
      }
    };

    TranslationsDefCenter.prototype.arg_change = function(e) {
      var $sel, arg, sel;
      $sel = this.form_view.args().parents;
      sel = $sel.val();
      if (sel !== null) {
        arg = this.form_view.args().iterator()[sel];
        arg.descr(this.form.find('.arg-descr').val());
        return arg.type(this.form.find('.arg-type').val());
      }
    };

    TranslationsDefCenter.prototype.add_argument = function(e) {
      var index, _arg;
      index = this.form_view.args().length();
      _arg = new TranslateArgumentView;
      _arg.update_index(index);
      _arg.descr("argument " + index + " description");
      this.form_view.args().push(_arg);
      this.form_view.args().parents.val(index);
      this.form_view.args().parents.trigger('change');
      return false;
    };

    TranslationsDefCenter.prototype.remove_argument = function(e) {
      var $sel, arg, i, max, sel, _i;
      $sel = this.form_view.args().parents;
      sel = $sel.val();
      if (sel !== null) {
        this.form_view.args().removeAt(sel);
        max = this.form_view.args().length() - 1;
        if (sel <= max) {
          for (i = _i = sel; sel <= max ? _i <= max : _i >= max; i = sel <= max ? ++_i : --_i) {
            arg = this.form_view.args().iterator()[i];
            arg.update_index(i);
          }
        }
        $sel.trigger('change');
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
            text: sentence.key,
            value: sentence.key
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
        this.form_view.content(def.content);
        args = def.args || [];
        this.form_view.args().clear();
        for (index = _i = 0, _len = args.length; _i < _len; index = ++_i) {
          arg = args[index];
          _arg = new TranslateArgumentView;
          _arg.update_index(index);
          _arg.type(arg.type || 0);
          _arg.descr(arg.descr || '');
          this.form_view.args().push(_arg);
        }
        return this.form.find('select.args').val(0).trigger('change');
      }
    };

    TranslationsDefCenter.prototype.init = function() {
      var $new_tag_modal, form_view,
        _this = this;
      this.proxy.on('sentences.def.reload', this.on_sentences_reload);
      this.proxy.on('sentence.def.changed', this.on_sentence_changed);
      this.proxy.on('sentence.def.saved', this.on_sentence_saved);
      this.proxy.on('sentence.def.created', this.on_sentence_def_created);
      this.group_choose = this.source.find('.choose-group');
      this.phrases_list = this.source.find('.phrases-list');
      $new_tag_modal = $('#add-tag-modal');
      $new_tag_modal.on('success', this.new_tag_confirm).on('show', function() {
        return $new_tag_modal.find('form').reset();
      });
      $('#new-tag-name').on('keyup', this.new_tag_changed);
      this.source.find('.arguments .plus').on('click', this.add_argument);
      this.source.find('.arguments .minus').on('click', this.remove_argument);
      this.source.find('.arguments .arg-descr').on('keyup', this.arg_change);
      this.source.find('.arguments .arg-type').on('change', this.arg_change);
      this.source.find('.confirm').on('click', this.submit_changes);
      this.form_view = form_view = new TranslateFormView();
      form_view.bind('.translation-panel form');
      form_view.args();
      this.form = form_view.rel;
      this.form.find('select.args').on('change', this.arg_selected);
      this.empty_arg = new TranslateArgumentView();
      this.empty_arg.bind('.selected-arg');
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
        var group;
        group = _this.group_choose.val();
        $new_tag_modal.find('.current-group').text(group);
        _this.phrases_list.parent().spin(true);
        return _this.proxy.emit('group.def.change', {
          group: group
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

    TranslateArgumentView.prototype.descr = TranslateArgumentView.dependencyProperty('arg-description', '');

    TranslateArgumentView.prototype.type = TranslateArgumentView.dependencyProperty('type', 0);

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

    TranslateFormView.prototype.descr = TranslateFormView.dependencyProperty('description', '');

    TranslateFormView.prototype.content = TranslateFormView.dependencyProperty('content', '');

    TranslateFormView.prototype.args = TranslateFormView.dependencyList('.arguments select.args');

    return TranslateFormView;

  })(Alcarin.ActiveView);
});
