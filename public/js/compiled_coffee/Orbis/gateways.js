var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  var Gateway, GatewayGroup, root;
  root = null;
  GatewayGroup = (function(_super) {

    __extends(GatewayGroup, _super);

    GatewayGroup.prototype.group_name = GatewayGroup.dependencyProperty('group_name', '', function(old_name, new_name) {
      var gateway, gateways, _i, _len;
      if (root.groups.list[old_name] != null) {
        delete root.groups.list[old_name];
        root.groups.list[new_name] = this;
      }
      if (this.initialized) {
        gateways = this.gateways().iterator().slice(0);
        this.gateways().clear();
        for (_i = 0, _len = gateways.length; _i < _len; _i++) {
          gateway = gateways[_i];
          gateway.group(new_name);
        }
      }
      return this.debug = new_name;
    });

    GatewayGroup.prototype.edit_class = GatewayGroup.dependencyProperty('edit_btn_class', '');

    GatewayGroup.prototype.group_class = GatewayGroup.dependencyProperty('group_class', '');

    GatewayGroup.prototype.css_id = GatewayGroup.dependencyProperty('css_id');

    GatewayGroup.prototype.gateways = GatewayGroup.dependencyList('.items');

    function GatewayGroup(group_name) {
      this.delete_group = __bind(this.delete_group, this);

      this.create_gateway = __bind(this.create_gateway, this);

      this.edit_group = __bind(this.edit_group, this);
      this.debug = '';
      this.editable = true;
      GatewayGroup.__super__.constructor.call(this);
      this.css_id(Alcarin.Randoms.id());
      if (group_name != null) {
        this.group_name(group_name);
      }
      root.groups.list[group_name] = this;
      root.groups.push(this);
      this.gateways().setAnims('slideDown', 'slideUp');
    }

    GatewayGroup.prototype.onbind = function($target) {
      var edit_btn,
        _this = this;
      GatewayGroup.__super__.onbind.call(this);
      edit_btn = $target.find('.group-name.editable');
      if (edit_btn.length > 0) {
        this.edit_btn = edit_btn;
        this.edit_btn.editable({
          success: this.edit_group
        }).on('shown', function(e) {
          var $input;
          $input = $(e.currentTarget).data('editable').input.$input;
          return $input != null ? $input.val(_this.group_name()) : void 0;
        });
        $target.on('click', '.edit-group', function() {
          _this.edit_btn.editable('option', {
            url: urls.orbis.gateways + '/' + _this.group_name()
          });
          _this.edit_btn.editable('show');
          return false;
        });
      }
      $target.on('click', '.create-gateway', this.create_gateway);
      return $target.on('click', 'button.close.delete-group', this.delete_group);
    };

    GatewayGroup.prototype.edit_group = function(response, value) {
      if (response.success) {
        this.group_name(value);
        return {
          newValue: void 0
        };
      }
      if (response.error != null) {
        return response.error;
      } else {
        return 'Error occured.';
      }
    };

    GatewayGroup.prototype.disable_edition = function() {
      this.edit_class('hide');
      return this.editable = false;
    };

    GatewayGroup.prototype.toggle = function(val) {
      return this.group_class(val ? 'in' : '');
    };

    GatewayGroup.prototype.create_gateway = function(e) {
      var $form, edition_gateway,
        _this = this;
      edition_gateway = new Gateway(false);
      edition_gateway.name('Empty gateway');
      edition_gateway.group(this.group_name());
      edition_gateway.description('Please, add description to this gateway!', edition_gateway.bind(root.$edit_pane));
      $form = root.$edit_pane_form;
      $form._method('post');
      $form.find('[name="group"]').val(this.group_name());
      $form.one('ajax-submit', function(e, response) {
        var gateway;
        if (response.success) {
          gateway = new Gateway;
          gateway.copy(response.data);
          return root.cancel_gateway_edit();
        }
      });
      root.$edit_pane.fadeIn();
      root.$groups_pane.fadeOut();
      return false;
    };

    GatewayGroup.prototype.delete_group = function() {
      var _this = this;
      Alcarin.Dialogs.Confirms.admin('Really deleting? Gateways will be moved to "ungrouped" group.', function() {
        var group_name, uri;
        uri = urls.orbis.gateways;
        group_name = _this.group_name();
        return Rest().$delete("" + uri + "/" + group_name, {
          mode: 'group'
        }, function(response) {
          var gateway, _i, _len, _ref;
          if (response.success) {
            _ref = _this.gateways().iterator().slice(0);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              gateway = _ref[_i];
              gateway.group(0);
            }
            return _this.gateways().clear();
          }
        });
      });
      return false;
    };

    return GatewayGroup;

  })(Alcarin.ActiveView);
  Gateway = (function(_super) {

    __extends(Gateway, _super);

    Gateway.prototype.id = Gateway.dependencyProperty('id');

    Gateway.prototype.name = Gateway.dependencyProperty('name');

    Gateway.prototype.description = Gateway.dependencyProperty('description', ' ');

    Gateway.prototype.x = Gateway.dependencyProperty('x', '0');

    Gateway.prototype.y = Gateway.dependencyProperty('y', '0');

    Gateway.prototype.group = Gateway.dependencyProperty('group', '', function(old_name, new_name) {
      var old_group, target_group;
      this.debug = this.name();
      if (this.auto_bind) {
        if (root.groups.list[old_name] != null) {
          old_group = root.groups.list[old_name];
          old_group.gateways().remove(this);
          if (old_group.gateways().length() === 0 && old_group.editable) {
            root.groups.remove(old_group);
          }
        }
        target_group = root.groups.list[new_name];
        return target_group.gateways().push(this);
      }
    });

    Gateway.prototype.gateway_group = function() {
      return root.groups.list[this.group()];
    };

    Gateway.prototype.edit = function() {
      var $form, edit_copy,
        _this = this;
      $form = root.$edit_pane_form;
      $form._method('put');
      $form.find('[name="group"]').val(this.group());
      edit_copy = this.clone();
      edit_copy.bind(root.$edit_pane);
      $form.one('ajax-submit', function(e, response) {
        if (response.success) {
          _this.copy(response.data);
          return root.cancel_gateway_edit();
        }
      });
      root.$edit_pane.fadeIn();
      root.$groups_pane.fadeOut();
      return false;
    };

    Gateway.prototype["delete"] = function() {
      var _this = this;
      return Alcarin.Dialogs.Confirms.admin('Really deleting this gateway?', function() {
        var id, uri;
        uri = urls.orbis.gateways;
        id = _this.id();
        return Rest().$delete("" + uri + "/" + id, {
          mode: 'gateway'
        }, function(response) {
          var gg;
          if (response.success) {
            gg = _this.gateway_group();
            gg.gateways().remove(_this);
            if (gg.gateways().length() === 0 && gg.editable) {
              return root.groups.remove(gg);
            }
          }
        });
      });
    };

    Gateway.prototype.onbind = function($target) {
      $target.on('click', 'a', this.edit);
      return $target.on('click', '.delete-gateway', this["delete"]);
    };

    function Gateway(auto_bind) {
      this.auto_bind = auto_bind != null ? auto_bind : true;
      this["delete"] = __bind(this["delete"], this);

      this.edit = __bind(this.edit, this);

      this.debug = '';
      Gateway.__super__.constructor.call(this);
    }

    return Gateway;

  })(Alcarin.ActiveView);
  return exports.Gateways = (function() {

    function Gateways($gateways) {
      this.create_group = __bind(this.create_group, this);

      this.cancel_gateway_edit = __bind(this.cancel_gateway_edit, this);
      this.groups = {};
      this.$gateways = $gateways;
      this.$groups_pane = $gateways.find('.gateways-groups');
      this.$edit_pane = $gateways.find('.gateway-edit');
      this.$edit_pane_form = this.$edit_pane.find('form');
    }

    Gateways.prototype.cancel_gateway_edit = function() {
      this.$groups_pane.fadeIn();
      this.$edit_pane.fadeOut();
      return this.$edit_pane_form.unbind('ajax-submit');
    };

    Gateways.prototype.create_group = function() {
      var data, gateway_name, group_name, index, name,
        _this = this;
      name = 'new_group_';
      index = 0;
      while (this.groups.list["" + name + index] != null) {
        index++;
      }
      group_name = "" + name + index;
      gateway_name = 'Empty Gateway';
      data = {
        creating_group: true,
        name: gateway_name,
        group: group_name,
        description: 'Please, add description to this gateway!',
        x: 0,
        y: 0
      };
      return Rest().$create(urls.orbis.gateways, data, function(response) {
        var new_gateway, new_group;
        if (response.success) {
          new_group = new GatewayGroup(group_name);
          new_gateway = new Gateway;
          new_gateway.copy(response.data);
          _this.$groups_pane.find('.collapse').collapse('hide');
          return new_group.rel.find("#" + group_name).collapse('toggle');
        } else {
          return console.log(response.errors);
        }
      });
    };

    Gateways.prototype.init_groups = function() {
      var $list, groups, ungrouped,
        _this = this;
      this.groups = groups = new Alcarin.ActiveList();
      groups.list = {};
      groups.setAnims('show', 'slideUp');
      $list = this.$groups_pane.parent().find('.active-group');
      groups.bind($list);
      ungrouped = new GatewayGroup('Ungrouped');
      groups.list[0] = ungrouped;
      ungrouped.toggle(true);
      ungrouped.disable_edition();
      return Rest().$get(urls.orbis.gateways, function(response) {
        var gateway, gateways, group, group_name, new_gateway, _ref, _results;
        _ref = response.gateways;
        _results = [];
        for (group_name in _ref) {
          gateways = _ref[group_name];
          if (!(groups.list[group_name] != null)) {
            group = new GatewayGroup(group_name);
            groups.list[group_name] = group;
          }
          _results.push((function() {
            var _i, _len, _results1;
            _results1 = [];
            for (_i = 0, _len = gateways.length; _i < _len; _i++) {
              gateway = gateways[_i];
              new_gateway = new Gateway;
              _results1.push(new_gateway.copy(gateway));
            }
            return _results1;
          })());
        }
        return _results;
      });
    };

    Gateways.prototype.init = function() {
      root = this;
      this.$groups_pane.on('click', '.add-group', this.create_group);
      this.$edit_pane.on('click', '.close', this.cancel_gateway_edit);
      $('[name="description"]').attr('value', '{item.description}');
      return this.init_groups();
    };

    return Gateways;

  })();
});
