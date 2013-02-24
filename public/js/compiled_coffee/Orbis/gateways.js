var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

namespace('Alcarin.Orbis', function(exports, Alcarin) {
  var Gateway, GatewayGroup;
  GatewayGroup = (function(_super) {

    __extends(GatewayGroup, _super);

    GatewayGroup.prototype.group_name = GatewayGroup.dependencyProperty('group_name', '', function(new_name) {
      return this.group_href(new_name.replace(/\s+/g, '-').toLowerCase());
    });

    GatewayGroup.prototype.group_class = GatewayGroup.dependencyProperty('group_class', '');

    GatewayGroup.prototype.group_href = GatewayGroup.dependencyProperty('group_href', '');

    GatewayGroup.prototype.gateways = GatewayGroup.dependencyList('.items');

    GatewayGroup.prototype.toggle = function(val) {
      return this.group_class(val ? 'in' : '');
    };

    function GatewayGroup(_group_name) {
      GatewayGroup.__super__.constructor.call(this);
      if (_group_name != null) {
        this.group_name(_group_name);
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
      this.add_group = __bind(this.add_group, this);

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

    Gateways.prototype.add_group = function() {
      var new_group;
      new_group = new GatewayGroup('New_group');
      new_group.gateways();
      return this.groups.push(new_group);
    };

    Gateways.prototype.init = function() {
      var ungrouped;
      this.$groups_pane.on('click', '.create-gateway', this.create_gateway);
      this.$edit_pane.on('click', '.close', this.cancel_gateway_edit);
      this.$groups_pane.on('click', '.add-group', this.add_group);
      this.groups = new Alcarin.ActiveList();
      this.groups.setAnim('slideDown');
      this.groups.bind(this.$groups_pane.find('.active-group'));
      ungrouped = new GatewayGroup('Ungrouped');
      this.groups.ungrouped = ungrouped.gateways();
      this.groups.push(ungrouped);
      return ungrouped.toggle(true);
    };

    return Gateways;

  })();
});
