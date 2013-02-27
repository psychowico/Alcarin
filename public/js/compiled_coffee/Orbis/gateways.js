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

    GatewayGroup.prototype.id = GatewayGroup.dependencyProperty('id', 1);

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

    Gateway.prototype.name = Gateway.dependencyProperty('name');

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
      this.create_group = __bind(this.create_group, this);

      this.cancel_gateway_edit = __bind(this.cancel_gateway_edit, this);

      this.create_gateway = __bind(this.create_gateway, this);
      this.groups = {};
      this.$gateways = $gateways;
      this.$groups_pane = $gateways.find('.gateways-groups');
      this.$edit_pane = $gateways.find('.gateway-edit');
    }

    Gateways.prototype.create_gateway = function() {
      this.$groups_pane.fadeOut();
      return this.$edit_pane.fadeIn();
    };

    Gateways.prototype.cancel_gateway_edit = function() {
      this.$groups_pane.fadeIn();
      return this.$edit_pane.fadeOut();
    };

    Gateways.prototype.create_group = function() {
      var new_group;
      new_group = new GatewayGroup('New_group');
      return this.groups.push(new_group);
    };

    Gateways.prototype.init = function() {
      var ungrouped;
      this.$groups_pane.on('click', '.create-gateway', this.create_gateway);
      this.$groups_pane.on('click', '.add-group', this.create_group);
      this.$edit_pane.on('click', '.close', this.cancel_gateway_edit);
      this.groups = new Alcarin.ActiveList();
      this.groups.setAnim('slideDown');
      this.groups.bind(this.$groups_pane.find('.active-group'));
      ungrouped = new GatewayGroup('Ungrouped');
      this.groups.ungrouped;
      this.groups.push(ungrouped);
      ungrouped.toggle(true);
      ungrouped.disableEdition();
      return Alcarin.get('/admin/orbis').done(function(response) {
        var obj, un_result;
        if (response.gateways[0]) {
          un_result = (function() {
            var _i, _len, _ref, _results;
            _ref = response.gateways[0];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              obj = _ref[_i];
              _results.push(new Gateway(obj.name));
            }
            return _results;
          })();
        }
        return ungrouped.gateways().concat(un_result);
      });
    };

    return Gateways;

  })();
});
