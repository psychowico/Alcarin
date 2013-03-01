var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  var Gateway, GatewayGroup;
  GatewayGroup = (function(_super) {

    __extends(GatewayGroup, _super);

    GatewayGroup.prototype.group_name = GatewayGroup.dependencyProperty('group_name', '', function(new_name) {
      return this.group_href(new_name.replace(/\s+/g, '-').toLowerCase());
    });

    GatewayGroup.prototype.group_class = GatewayGroup.dependencyProperty('group_class', '');

    GatewayGroup.prototype.group_href = GatewayGroup.dependencyProperty('group_href', '');

    GatewayGroup.prototype.edit_class = GatewayGroup.dependencyProperty('edit_btn_class', '');

    GatewayGroup.prototype.gateways = GatewayGroup.dependencyList('.items');

    function GatewayGroup(parent, group_name) {
      this.parent = parent;
      this.delete_group = __bind(this.delete_group, this);

      this.create_gateway = __bind(this.create_gateway, this);

      this.edit_group = __bind(this.edit_group, this);

      GatewayGroup.__super__.constructor.call(this);
      if (group_name != null) {
        this.group_name(group_name);
      }
    }

    GatewayGroup.prototype.init = function() {
      var _this = this;
      GatewayGroup.__super__.init.call(this);
      this.gateways();
      this.edit_btn = this.rel.find('.group-name.editable');
      this.edit_btn.editable({
        success: function(response, value) {
          if (response.success) {
            _this.group_name(value);
            return {
              newValue: void 0
            };
          }
          if (response.error != null) {
            return response.error;
          } else {
            return 'Error occured.';
          }
        }
      }).on('shown', function(e) {
        var $input;
        $input = $(e.currentTarget).data('editable').input.$input;
        return $input != null ? $input.val(_this.group_name()) : void 0;
      });
      this.rel.on('click', '.create-gateway', this.create_gateway);
      this.rel.on('click', '.edit-group', this.edit_group);
      return this.rel.on('click', 'button.close', this.delete_group);
    };

    GatewayGroup.prototype.edit_group = function() {
      this.edit_btn.editable('show');
      return false;
    };

    GatewayGroup.prototype.disable_edition = function() {
      return this.edit_class('hide');
    };

    GatewayGroup.prototype.toggle = function(val) {
      return this.group_class(val ? 'in' : '');
    };

    GatewayGroup.prototype.create_gateway = function(e) {
      var $form, edition_gateway,
        _this = this;
      edition_gateway = new Gateway(void 0, 'new_gateway');
      edition_gateway.bind(this.parent.$edit_pane);
      edition_gateway.group(this.group_name());
      $form = this.parent.$edit_pane_form;
      $form._method('post');
      $form.one('ajax-submit', function(e, response) {
        var gateway;
        if (response.success) {
          gateway = new Gateway(_this);
          gateway.copy(response.data);
          return _this.parent.cancel_gateway_edit();
        }
      });
      this.parent.$edit_pane.fadeIn();
      this.parent.$groups_pane.fadeOut();
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
          var gateway, ungrouped, _i, _len, _ref;
          if (response.success) {
            ungrouped = _this.parent.groups.list[0].gateways();
            _ref = _this.gateways().iterator();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              gateway = _ref[_i];
              ungrouped.push(gateway.clone());
            }
            _this.gateways().clear();
            return _this.parent.groups.remove(_this);
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

    Gateway.prototype.group = Gateway.dependencyProperty('group', '0');

    Gateway.prototype.edit = function() {
      var $form, edit_copy,
        _this = this;
      $form = this.parent.parent.$edit_pane_form;
      $form._method('put');
      edit_copy = this.clone();
      edit_copy.bind(this.parent.parent.$edit_pane);
      $form.one('ajax-submit', function(e, response) {
        if (response.success) {
          _this.copy(response.data);
          return _this.parent.parent.cancel_gateway_edit();
        }
      });
      this.parent.parent.$edit_pane.fadeIn();
      this.parent.parent.$groups_pane.fadeOut();
      return false;
    };

    Gateway.prototype.init = function() {
      var group;
      Gateway.__super__.init.call(this);
      if (this.parent != null) {
        group = this.parent.group_name();
        if (group === 'Ungrouped') {
          group = 0;
        }
        this.group(group);
        return this.rel.on('click', this.edit);
      }
    };

    function Gateway(parent, _name) {
      var _ref;
      this.parent = parent;
      this.edit = __bind(this.edit, this);

      Gateway.__super__.constructor.call(this);
      if (_name != null) {
        this.name(_name);
      }
      if ((_ref = this.parent) != null) {
        _ref.gateways().push(this);
      }
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
      var data, gateway_name, get_group_name, group_name,
        _this = this;
      get_group_name = function() {
        var exists, index, name;
        name = 'new_group_';
        index = 0;
        exists = function(_name) {
          var group, _i, _len, _ref;
          _ref = _this.groups.iterator();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            group = _ref[_i];
            if (group.group_name() === _name) {
              return true;
            }
          }
          return false;
        };
        while (exists("" + name + index)) {
          index++;
        }
        return "" + name + index;
      };
      group_name = get_group_name();
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
          new_group = new GatewayGroup(_this, group_name);
          new_gateway = new Gateway(new_group);
          new_gateway.copy(response.data);
          _this.groups.push(new_group);
          _this.$groups_pane.find('.collapse').collapse('hide');
          return new_group.rel.find("#" + group_name).collapse('toggle');
        }
      });
    };

    Gateways.prototype.init_groups = function() {
      var ungrouped,
        _this = this;
      this.groups = new Alcarin.ActiveList();
      this.groups.bind(this.$groups_pane.find('.active-group'));
      ungrouped = new GatewayGroup(this, 'Ungrouped');
      this.groups.push(ungrouped);
      this.groups.list = {
        0: ungrouped
      };
      ungrouped.toggle(true);
      ungrouped.disable_edition();
      return Rest().$get(urls.orbis.gateways, function(response) {
        var gateway, gateways, group, group_name, new_gateway, _ref, _results;
        _ref = response.gateways;
        _results = [];
        for (group_name in _ref) {
          gateways = _ref[group_name];
          if (!(_this.groups.list[group_name] != null)) {
            group = new GatewayGroup(_this, group_name);
            _this.groups.push(group);
            _this.groups.list[group_name] = group;
          }
          group = _this.groups.list[group_name];
          _results.push((function() {
            var _i, _len, _results1;
            _results1 = [];
            for (_i = 0, _len = gateways.length; _i < _len; _i++) {
              gateway = gateways[_i];
              new_gateway = new Gateway(group);
              _results1.push(new_gateway.copy(gateway));
            }
            return _results1;
          })());
        }
        return _results;
      });
    };

    Gateways.prototype.init = function() {
      this.$groups_pane.on('click', '.add-group', this.create_group);
      this.$edit_pane.on('click', '.close', this.cancel_gateway_edit);
      $('[name="description"]').attr('value', '{item.description}');
      return this.init_groups();
    };

    return Gateways;

  })();
});
