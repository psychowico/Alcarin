'use-strict';
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

namespace('Alcarin.Orbis.Gateways', function(exports, Alcarin) {
  exports.List = ngcontroller([
    'GatewaysGroup', 'Gateway', '@EventsBus', function(GatewaysGroup, Gateway, EventsBus) {
      var _this = this;

      this.gateways_groups = GatewaysGroup.query({
        full: true
      });
      this.rename = function(_group) {
        return function(ign, new_name) {
          var group;

          if (!new_name) {
            return "Can not be empty.";
          }
          if (__indexOf.call((function() {
            var _i, _len, _ref, _results;

            _ref = this.gateways_groups;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              group = _ref[_i];
              _results.push(group.name);
            }
            return _results;
          }).call(_this), new_name) >= 0) {
            return "Group name reserved.";
          }
          group.name = new_name;
          return group.$save(function() {
            return _this.$emit('groupChanged', new_name);
          });
        };
      };
      this.hoverGateway = function(gateway) {
        return EventsBus.emit('mouse-enter-gateway', gateway.loc.x, gateway.loc.y);
      };
      this.leaveGateway = function(gateway) {
        return EventsBus.emit('mouse-leave-gateway');
      };
      this.deleteGateway = function(group, gateway) {
        return Alcarin.Dialogs.Confirms.admin('Really deleting this gateway?', function() {
          return Gateway.get({
            id: gateway.id
          }, function($gateway) {
            return $gateway.$delete(function() {
              group.gateways.remove(gateway);
              if (group.gateways.length === 0 && group.id !== '0') {
                return _this.gateways_groups.remove(group);
              }
            });
          });
        });
      };
      this.deleteGroup = function(group) {
        return Alcarin.Dialogs.Confirms.admin('Really deleting? Gateways will be moved to "ungrouped" group.', function() {
          var c_group;

          c_group = new GatewaysGroup(group);
          return group.$delete(function() {
            var _g, _i, _len, _ref;

            _this.gateways_groups.remove(group);
            _ref = c_group.gateways;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              _g = _ref[_i];
              _this.gateways_groups[0].gateways.push(_g);
            }
            return _this.$emit('groupChanged', 0);
          });
        });
      };
      this.createGroup = function() {
        var group;

        group = new GatewaysGroup();
        group.name = 'new_group ...';
        group.id = 'new_group';
        return group.$create(function() {
          _this.gateways_groups.push(group);
          return _this.$emit('groupChanged', group.name);
        });
      };
      return this.leaveGateway();
    }
  ]);
  return exports.Item = ngcontroller([
    'GatewaysGroup', 'Gateway', '$routeParams', '$location', '@EventsBus', function(GatewaysGroup, Gateway, $params, $loc, EventsBus) {
      var mode,
        _this = this;

      this.groups = GatewaysGroup.query();
      this.title = '...';
      mode = $params.gatewayid != null ? 'edit' : 'create';
      this.cancel = function() {
        _this.$emit('groupChanged', _this.rel.group);
        return $loc.path('/groups');
      };
      switch (mode) {
        case 'edit':
          this.title = 'Edit gateway';
          Gateway.get({
            id: $params.gatewayid
          }, function(_gateway) {
            _this.rel = _gateway;
            return EventsBus.emit('mouse-enter-gateway', _gateway.loc.x, _gateway.loc.y);
          });
          this.save = function() {
            return this.rel.$save({}, this.cancel);
          };
          break;
        case 'create':
          this.title = 'New gateway';
          this.rel = $.extend(new Gateway(), {
            name: 'newGateway',
            group: $params.group,
            description: 'new gateway..',
            loc: {
              x: 0,
              y: 0
            }
          });
          this.save = function() {
            return this.rel.$create({}, this.cancel);
          };
      }
      return EventsBus.on('flag.updated', function(x, y) {
        var _ref, _ref1;

        if ((_ref = _this.rel) != null) {
          _ref.loc.x = x;
        }
        return (_ref1 = _this.rel) != null ? _ref1.loc.y = y : void 0;
      });
    }
  ]);
});

/*
//@ sourceMappingURL=gateways-list.js.map
*/
