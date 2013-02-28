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

    GatewayGroup.prototype.edit_group = function() {
      this.edit_btn.editable('show');
      return false;
    };

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
      return this.rel.on('click', '.edit-group', this.edit_group);
    };

    GatewayGroup.prototype.disableEdition = function() {
      return this.edit_class('hide');
    };

    GatewayGroup.prototype.toggle = function(val) {
      return this.group_class(val ? 'in' : '');
    };

    function GatewayGroup(group_name) {
      this.edit_group = __bind(this.edit_group, this);
      GatewayGroup.__super__.constructor.call(this);
      if (group_name != null) {
        this.group_name(group_name);
      }
    }

    return GatewayGroup;

  })(Alcarin.ActiveView);
  Gateway = (function(_super) {

    __extends(Gateway, _super);

    Gateway.prototype.id = Gateway.dependencyProperty('id');

    Gateway.prototype.name = Gateway.dependencyProperty('name');

    Gateway.prototype.description = Gateway.dependencyProperty('description', '');

    Gateway.prototype.x = Gateway.dependencyProperty('x', '0');

    Gateway.prototype.y = Gateway.dependencyProperty('y', '0');

    function Gateway(_name) {
      Gateway.__super__.constructor.call(this);
      if (_name != null) {
        this.name(_name);
      }
    }

    return Gateway;

  })(Alcarin.ActiveView);
  return exports.Gateways = (function() {

    function Gateways($gateways) {
      this.form_submited = __bind(this.form_submited, this);

      this.gateway_click = __bind(this.gateway_click, this);

      this.delete_group = __bind(this.delete_group, this);

      this.create_group = __bind(this.create_group, this);

      this.cancel_gateway_edit = __bind(this.cancel_gateway_edit, this);

      this.create_gateway = __bind(this.create_gateway, this);
      this.groups = {};
      this.$gateways = $gateways;
      this.$groups_pane = $gateways.find('.gateways-groups');
      this.$edit_pane = $gateways.find('.gateway-edit');
      this.$edit_pane_form = this.$edit_pane.find('form');
    }

    Gateways.prototype.create_gateway = function(e) {
      var $form, $sender, gateway, gateways_group;
      $sender = $(e.currentTarget);
      gateway = new Gateway('new_gateway');
      $form = this.$edit_pane_form._method('post');
      gateway.bind(this.$edit_pane);
      gateways_group = $sender.closest('.accordion-inner').find('.items').data('active-list');
      this.$edit_pane.data('target-group', gateways_group);
      this.$edit_pane.fadeIn();
      this.$groups_pane.fadeOut();
      return false;
    };

    Gateways.prototype.cancel_gateway_edit = function() {
      this.$groups_pane.fadeIn();
      return this.$edit_pane.fadeOut();
    };

    Gateways.prototype.create_group = function() {
      var gateway_name, get_group_name, group_name,
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
      return Rest().$create(urls.orbis.gateways, {
        name: gateway_name,
        group: group_name
      }, function(response) {
        var new_group;
        new_group = new GatewayGroup(group_name);
        new_group.gateways().push(new Gateway(gateway_name));
        _this.groups.push(new_group);
        _this.$groups_pane.find('.collapse').collapse('hide');
        return new_group.rel.find("#" + group_name).collapse('toggle');
      });
    };

    Gateways.prototype.delete_group = function(e) {
      var _this = this;
      Alcarin.Dialogs.Confirms.admin('Really deleting? Gateways will be moved to "ungrouped" group.', function() {
        var $sender, group, group_name, uri;
        uri = urls.orbis.gateways;
        $sender = $(e.currentTarget);
        group = $sender.closest('.accordion-group').data('active-view');
        group_name = group.group_name();
        return Rest().$delete("" + uri + "/" + group_name, {
          mode: 'group'
        }, function(response) {
          var gateway, ungrouped, _i, _len, _ref;
          if (response.success) {
            ungrouped = _this.groups.list[0];
            _ref = group.gateways().iterator();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              gateway = _ref[_i];
              group.gateways().remove(gateway);
              ungrouped.gateways().push(gateway.clone());
            }
            return _this.groups.remove(group);
          }
        });
      });
      return false;
    };

    Gateways.prototype.init_groups = function() {
      var ungrouped,
        _this = this;
      this.groups = new Alcarin.ActiveList();
      this.groups.bind(this.$groups_pane.find('.active-group'));
      ungrouped = new GatewayGroup('Ungrouped');
      this.groups.push(ungrouped);
      this.groups.list = {
        0: ungrouped
      };
      ungrouped.toggle(true);
      ungrouped.disableEdition();
      return Rest().$get(urls.orbis.gateways, function(response) {
        var gateway, gateways, group, group_name, new_gateway, _ref, _results;
        _ref = response.gateways;
        _results = [];
        for (group_name in _ref) {
          gateways = _ref[group_name];
          if (!(_this.groups.list[group_name] != null)) {
            group = new GatewayGroup(group_name);
            _this.groups.push(group);
            _this.groups.list[group_name] = group;
          }
          group = _this.groups.list[group_name];
          _results.push((function() {
            var _i, _len, _results1;
            _results1 = [];
            for (_i = 0, _len = gateways.length; _i < _len; _i++) {
              gateway = gateways[_i];
              new_gateway = new Gateway(gateway.name);
              new_gateway.id(gateway._id.$id);
              new_gateway.description(gateway.description);
              new_gateway.x(gateway.x);
              new_gateway.y(gateway.y);
              _results1.push(group.gateways().push(new_gateway));
            }
            return _results1;
          })());
        }
        return _results;
      });
    };

    Gateways.prototype.gateway_click = function(e) {
      var $form, $sender, edit_copy, gateway;
      $sender = $(e.currentTarget);
      gateway = $sender.data('active-view');
      $form = this.$edit_pane_form._method('put');
      $form.data('original-gateway', gateway);
      edit_copy = gateway.clone();
      edit_copy.bind(this.$edit_pane);
      this.$edit_pane.fadeIn();
      this.$groups_pane.fadeOut();
      this.last_edited_gateway = gateway;
      return false;
    };

    Gateways.prototype.form_submited = function(response) {
      var gateway, group, new_entry, _method;
      _method = this.$edit_pane_form._method();
      if (_method === 'post') {
        gateway = this.$edit_pane.data('active-view');
        group = this.$edit_pane.data('target-group');
        new_entry = gateway.clone();
        gateway.unbind();
        return group.push(new_entry);
      } else if (_method === 'put') {
        if (response.success) {
          this.last_edited_gateway.copy(response.data);
          return this.cancel_gateway_edit();
        }
      }
    };

    Gateways.prototype.init = function() {
      this.$groups_pane.on('click', '.create-gateway', this.create_gateway);
      this.$groups_pane.on('click', '.add-group', this.create_group);
      this.$groups_pane.on('click', 'button.close', this.delete_group);
      this.$groups_pane.on('click', '.items li.gateway', this.gateway_click);
      this.$edit_pane.on('click', '.close', this.cancel_gateway_edit);
      this.$edit_pane.find('form').ajaxForm(this.form_submited);
      return this.init_groups();
    };

    return Gateways;

  })();
});
