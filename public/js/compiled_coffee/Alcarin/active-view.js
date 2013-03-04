
namespace('Alcarin', function(exports, Alcarin) {
  exports.ActiveView = (function() {

    ActiveView.TYPE_CONTENT = 0;

    ActiveView.TYPE_ATTR = 1;

    ActiveView.regex = /{item\.(.*?)}/g;

    ActiveView.global_list = [];

    ActiveView.auto_init = false;

    ActiveView.prototype.bindings = {};

    ActiveView.prototype.initialized = false;

    ActiveView.prototype.properties_container = {};

    function ActiveView() {
      var defaults;
      $.merge(exports.ActiveView.global_list, [this]);
      defaults = this.constructor.default_properties || {};
      this.properties_container = jQuery.extend({}, defaults);
      this.active_list_container = {};
      this.initialized = false;
      this.bindings = {};
      this.rel = $();
    }

    ActiveView.prototype.clone = function() {
      var copy;
      copy = new this.constructor;
      copy.properties_container = $.extend({}, this.properties_container);
      return copy;
    };

    ActiveView.prototype.copy = function(source) {
      var key, val, _results;
      if ($.isPlainObject(source)) {
        _results = [];
        for (key in source) {
          val = source[key];
          if ($.isFunction(this[key])) {
            _results.push(this[key](val));
          } else {
            this.properties_container[key] = val;
            if (this.initalized) {
              _results.push(this.propertyChanged(key));
            } else {
              _results.push(void 0);
            }
          }
        }
        return _results;
      } else {
        if (this.constructor === source.constructor) {
          $.extend(this.properties_container, source.properties_container);
          return this.init();
        }
      }
    };

    ActiveView.initializeAll = function() {
      var view, _i, _len, _ref;
      _ref = exports.ActiveView.global_list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        view.update();
      }
      return this.auto_update = true;
    };

    ActiveView.dependencyProperty = function(name, default_value, onChange) {
      if (default_value != null) {
        if (!(this.default_properties != null)) {
          this.default_properties = {};
        }
        this.default_properties[name] = default_value;
      }
      return function(new_value) {
        var old_value;
        if (!(new_value != null)) {
          return this.properties_container[name];
        }
        old_value = this.properties_container[name];
        if (new_value === old_value) {
          return false;
        }
        this.properties_container[name] = new_value;
        if (this.initialized) {
          this.propertyChanged(name);
        }
        if (onChange != null) {
          onChange.call(this, old_value, new_value);
        }
        return this;
      };
    };

    ActiveView.dependencyList = function(query) {
      return function() {
        var $bind_target, activelist;
        if (!(this.active_list_container[query] != null)) {
          activelist = this.active_list_container[query] = new Alcarin.ActiveList;
          if (this.rel != null) {
            $bind_target = this.rel.find(query);
            if ($bind_target.length > 0) {
              activelist.bind($bind_target);
            }
          }
        }
        return this.active_list_container[query];
      };
    };

    ActiveView.prototype.propertyChanged = function(prop_name) {
      var $el, bindings, data, new_val, org, result, val, _i, _len, _results;
      if (!(this.bindings[prop_name] != null)) {
        return;
      }
      bindings = this.bindings[prop_name];
      _results = [];
      for (_i = 0, _len = bindings.length; _i < _len; _i++) {
        data = bindings[_i];
        $el = data.element;
        new_val = org = data.original;
        while (result = ActiveView.regex.exec(org)) {
          val = this.properties_container[result[1]];
          if (val != null) {
            new_val = new_val.replace(result[0], val);
          }
        }
        switch (data.type) {
          case exports.ActiveView.TYPE_CONTENT:
            _results.push($el.html(new_val));
            break;
          case exports.ActiveView.TYPE_ATTR:
            $el.prop(data.attr, new_val);
            _results.push($el.attr(data.attr, new_val));
            break;
          default:
            throw new Error('"#{data.type}" type not supported.');
        }
      }
      return _results;
    };

    /*private function, storing entries in @bindings table for specific property
    names used in "content". it store object with 'type' (TYPE_ATTR/TYPE_CONTENT)
    'element' (jquery ref), 'original' ("content" value) and attribute
    */


    ActiveView.prototype.prepare_bind = function($root, $child, content, attribute) {
      var checked, property_name, result, _ref;
      checked = {};
      while (result = ActiveView.regex.exec(content)) {
        property_name = result[1];
        if (property_name != null) {
          if (checked[property_name] != null) {
            continue;
          }
          checked[property_name] = true;
          this.bindings[property_name] = (_ref = this.bindings[property_name]) != null ? _ref : [];
          this.bindings[property_name].push({
            'type': attribute != null ? exports.ActiveView.TYPE_ATTR : exports.ActiveView.TYPE_CONTENT,
            'element': $child,
            'original': content,
            'attr': attribute,
            'root': $root
          });
        }
      }
      return true;
    };

    ActiveView.prototype.bind = function(e) {
      var $e,
        _this = this;
      $e = $(e);
      if ($e.is(this.rel)) {
        return false;
      }
      this.rel = this.rel.add($e);
      $e.each(function(index, val) {
        var $child, $el, all_children, attr, child, children, list, old_view, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
        $el = $(val);
        old_view = $el.data('active-view');
        if (old_view != null) {
          old_view.unbind($el);
        }
        $el.data('active-view', _this);
        all_children = $el.find('*');
        _ref = all_children.toArray().concat([$el.get(0)]);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          $child = $(child);
          _ref1 = child.attributes;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            attr = _ref1[_j];
            _this.prepare_bind($el, $child, attr.value, attr.name);
          }
        }
        children = all_children.filter(function(i, val) {
          return !$(val).children().length;
        });
        list = children.toArray();
        if (!$el.children().length) {
          list = list.concat([$el.get(0)]);
        }
        for (_k = 0, _len2 = list.length; _k < _len2; _k++) {
          child = list[_k];
          $child = $(child);
          _this.prepare_bind($el, $child, $child.html());
        }
        return true;
      });
      if (ActiveView.auto_update) {
        this.update();
      }
      this.onbind($e);
      return true;
    };

    ActiveView.prototype.onbind = function($target) {
      return true;
    };

    ActiveView.prototype.onunbind = function($target) {
      return true;
    };

    ActiveView.prototype.unbind = function(el) {
      var $el, $target, index, key, list, new_list, obj, _i, _len, _ref;
      $el = $(el);
      _ref = this.bindings;
      for (key in _ref) {
        list = _ref[key];
        new_list = [];
        for (index = _i = 0, _len = list.length; _i < _len; index = ++_i) {
          obj = list[index];
          if (obj.root.is($el)) {
            $target = obj.element;
            switch (obj.type) {
              case exports.ActiveView.TYPE_CONTENT:
                $target.html(obj.original);
                break;
              case exports.ActiveView.TYPE_ATTR:
                $target.prop(obj.attr, obj.original);
                $target.attr(obj.attr, obj.original);
            }
          } else {
            new_list.push(obj);
          }
        }
        this.bindings[key] = new_list;
      }
      $el.removeData('active-view');
      this.rel = this.rel.not($el);
      return this.onunbind($el);
    };

    ActiveView.prototype.update = function() {
      var property;
      this.initialized = true;
      for (property in this.properties_container) {
        this.propertyChanged(property);
      }
      return true;
    };

    return ActiveView;

  })();
  /*
      Usage sample.
  
      class exports.TestView extends exports.ActiveView
          me    : @dependencyProperty('me')
          teraz : @dependencyProperty('teraz', 12)
          active_list: @dependencyList('.items') #jquery style child query
  
      av = new Alcarin.TestView()
      av.me 'psychowico321'
      #av.teraz 0
      #console.log av.teraz()
      av.bind '#active-item'
  
      When you prepare class like this you can use in html:
  
      <li id="active-item">
          <span class="pepe" data-tutaj="jajajaja">tell {item.me} raz</span>
          <span>a {item.teraz} dwa powiedz</span>
          <input type="text" value="{item.teraz}">
      </li>
  
      And later, for sample in click method:
      $('#active-item').click ->
          #set "teraz" value to 13
          av.teraz 13
          #get "teraz" value, only for sample
          av.teraz()
  
      And value on template will be automatically updated.
  */

  return $(function() {
    return $(function() {
      return Alcarin.ActiveView.initializeAll();
    });
  });
});
