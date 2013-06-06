'use-strict';

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace('Alcarin.Orbis.Gateways', function(exports, Alcarin) {
  var Gateway, GatewayEditor, GatewayGroup, root;
  exports.List = ngcontroller([
    'GatewaysGroup', '@EventsBus', function(GatewaysGroup, EventsBus) {
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
          return group.$save();
        };
      };
      this.hoverGateway = function(gateway) {
        return EventsBus.emit('mouse-enter-gateway', gateway.x, gateway.y);
      };
      this.leaveGateway = function(gateway) {
        return EventsBus.emit('mouse-leave-gateway');
      };
      return this.leaveGateway();
    }
  ]);
  exports.Item = ngcontroller([
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
            return EventsBus.emit('mouse-enter-gateway', _gateway.x, _gateway.y);
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
            x: 0,
            y: 0
          });
          this.save = function() {
            return this.rel.$create({}, this.cancel);
          };
      }
      return EventsBus.on('flag.updated', function(x, y) {
        var _ref, _ref1;
        if ((_ref = _this.rel) != null) {
          _ref.x = x;
        }
        return (_ref1 = _this.rel) != null ? _ref1.y = y : void 0;
      });
    }
  ]);
  return;
  root = null;
  exports.Gateways = (function() {

    function Gateways($gateways) {
      this.on_gateway_deleted = __bind(this.on_gateway_deleted, this);

      this.on_group_deleted = __bind(this.on_group_deleted, this);

      this.on_reload_gateways = __bind(this.on_reload_gateways, this);

      this.on_group_created = __bind(this.on_group_created, this);

      this.create_group = __bind(this.create_group, this);
      this.groups = {};
      this.$gateways = $gateways;
      this.$groups_pane = $gateways.find('.gateways-groups');
      this.$edit_pane = $gateways.find('.gateway-edit');
      this.$edit_pane_form = this.$edit_pane.find('form');
      this.proxy = new Alcarin.EventProxy(urls.orbis.gateways);
    }

    Gateways.prototype.minimap = function() {
      if (!this._minimap) {
        this._minimap = $('.minimap > canvas').data('minimap');
      }
      return this._minimap;
    };

    Gateways.prototype.gateway_editor = function() {
      if (!(this.editor != null)) {
        this.editor = new GatewayEditor(this.$edit_pane, this.$groups_pane);
      }
      return this.editor;
    };

    Gateways.prototype.create_group = function() {
      var data, gateway_name, group_name, index, name;
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
      return this.proxy.emit('group.create', data);
    };

    Gateways.prototype.on_group_created = function(response) {
      var new_gateway, new_group;
      if (response.success) {
        new_group = new GatewayGroup(response.gateway.group);
        new_gateway = new Gateway;
        new_gateway.copy(response.gateway);
        return new_group.rel.find("#" + response.name).collapse('toggle');
      }
    };

    Gateways.prototype.on_reload_gateways = function(response) {
      var gateway, gateways, group, group_name, new_gateway, _ref, _results;
      if ($.isArray(response.gateways)) {
        response.gateways = {
          0: response.gateways[0]
        };
      }
      _ref = response.gateways;
      _results = [];
      for (group_name in _ref) {
        gateways = _ref[group_name];
        if (!(this.groups.list[group_name] != null)) {
          group = new GatewayGroup(group_name);
          this.groups.list[group_name] = group;
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
    };

    Gateways.prototype.on_group_deleted = function(response) {
      var gateway, group, name, _i, _len, _ref, _results;
      if (response.success) {
        name = response.id;
        if (this.groups.list[name] != null) {
          group = this.groups.list[name];
          _ref = group.gateways().iterator();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            gateway = _ref[_i];
            _results.push(gateway.group(0));
          }
          return _results;
        }
      }
    };

    Gateways.prototype.on_gateway_deleted = function(response) {
      var gg;
      if (response.success) {
        gg = this.groups.list[response.group];
        gg.remove_by_id(response.id);
        if (gg.gateways().length() === 0 && gg.editable) {
          return this.groups.remove(gg);
        }
      }
    };

    Gateways.prototype.init_groups = function() {
      var $list, groups, ungrouped;
      this.groups = groups = new Alcarin.ActiveList();
      groups.list = {};
      groups.setAnims('slideDown', 'slideUp');
      $list = this.$groups_pane.parent().find('.active-group');
      groups.bind($list);
      ungrouped = new GatewayGroup('Ungrouped');
      groups.list[0] = ungrouped;
      ungrouped.toggle(true);
      ungrouped.disable_edition();
      return this.proxy.emit('gateways.fetch');
    };

    Gateways.prototype.init = function() {
      root = this;
      this.$groups_pane.on('click', '.add-group', this.create_group);
      $('[name="description"]').attr('value', '{item.description}');
      this.proxy.on('gateways.all', this.on_reload_gateways);
      this.proxy.on('group.created', this.on_group_created);
      this.proxy.on('group.deleted', this.on_group_deleted);
      this.proxy.on('gateway.deleted', this.on_gateway_deleted);
      return this.init_groups();
    };

    return Gateways;

  })();
  GatewayGroup = (function(_super) {

    __extends(GatewayGroup, _super);

    GatewayGroup.prototype.group_name = function(name) {
      if (name === 0) {
        name = 'Ungrouped';
      }
      return this.group_name_dep(name);
    };

    GatewayGroup.prototype.group_name_dep = GatewayGroup.dependencyProperty('group_name', '', function(old_name, new_name) {
      var gateway, _i, _len, _ref;
      root.groups.list[new_name] = this;
      if (this.initialized) {
        _ref = this.gateways().iterator();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          gateway = _ref[_i];
          gateway.group(new_name);
        }
      }
      if (root.groups.list[old_name] != null) {
        delete root.groups.list[old_name];
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

      this.remove_by_id = __bind(this.remove_by_id, this);
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

    GatewayGroup.prototype.remove_by_id = function(id) {
      var gateway, _i, _len, _ref, _results;
      _ref = this.gateways().iterator();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        gateway = _ref[_i];
        if (gateway.id() === id) {
          this.gateways().remove(gateway);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    GatewayGroup.prototype.onbind = function($target) {
      var edit_btn,
        _this = this;
      GatewayGroup.__super__.onbind.call(this);
      edit_btn = $target.find('.group-name.editable');
      if (edit_btn.length > 0) {
        this.edit_btn = edit_btn;
        this.edit_btn.editable({
          success: this.edit_group,
          validate: function(val) {
            if (val === 'Ungrouped') {
              return 'Forbidden group name.';
            }
          }
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
      var edition_gateway, editor,
        _this = this;
      edition_gateway = new Gateway(false);
      edition_gateway.name('Empty gateway').group(this.group_name()).description('Please, add description to this gateway!', editor = root.gateway_editor());
      return editor.show(edition_gateway, 'gateway.create', 'gateway.created', function(response) {
        var gateway;
        gateway = new Gateway;
        return gateway.copy(response.gateway);
      });
    };

    GatewayGroup.prototype.delete_group = function() {
      var _this = this;
      Alcarin.Dialogs.Confirms.admin('Really deleting? Gateways will be moved to "ungrouped" group.', function() {
        var group_name;
        group_name = _this.group_name();
        return root.proxy.emit('group.delete', {
          id: group_name
        });
      });
      return false;
    };

    return GatewayGroup;

  })(Alcarin.ActiveView);
  Gateway = (function(_super) {
    var _this = this;

    __extends(Gateway, _super);

    Gateway.prototype.id = Gateway.dependencyProperty('id');

    Gateway.prototype.name = Gateway.dependencyProperty('name', '', function(o, val) {
      return Gateway.debug = val;
    });

    Gateway.prototype.description = Gateway.dependencyProperty('description', ' ');

    Gateway.prototype.x = Gateway.dependencyProperty('x', '0');

    Gateway.prototype.y = Gateway.dependencyProperty('y', '0');

    Gateway.prototype.group = function(group_name) {
      if (group_name === 0) {
        group_name = 'Ungrouped';
      }
      return this.group_dep(group_name);
    };

    Gateway.prototype.group_dep = Gateway.dependencyProperty('group', '', function(old_name, new_name) {
      var old_group, target_group;
      if (this.auto_bind) {
        target_group = root.groups.list[new_name];
        old_group = root.groups.list[old_name];
        if (old_group !== target_group) {
          if (old_group != null) {
            old_group.gateways().remove(this);
          }
          if ((old_group != null ? old_group.gateways().length() : void 0) === 0 && (old_group != null ? old_group.editable : void 0)) {
            root.groups.remove(old_group);
          }
          return target_group != null ? target_group.gateways().push(this) : void 0;
        }
      }
    });

    Gateway.prototype.gateway_group = function() {
      return root.groups.list[this.group()];
    };

    Gateway.prototype.edit = function() {
      var edit_copy, editor,
        _this = this;
      edit_copy = this.clone();
      editor = root.gateway_editor();
      editor.show(edit_copy, 'gateway.update', 'gateway.updated', function(response) {
        return _this.copy(response.gateway);
      });
      return false;
    };

    Gateway.prototype["delete"] = function() {
      var _this = this;
      return Alcarin.Dialogs.Confirms.admin('Really deleting this gateway?', function() {
        return root.proxy.emit('gateway.delete', {
          id: _this.id(),
          group: _this.group()
        });
      });
    };

    Gateway.prototype.mouse_enter = function() {
      if (!(this.tmp_flag != null)) {
        this.tmp_flag = root.minimap().create_flag(this.x(), this.y());
        return this.tmp_flag.show();
      }
    };

    Gateway.prototype.mouse_leave = function() {
      var _ref;
      if ((_ref = this.tmp_flag) != null) {
        _ref.destroy();
      }
      return delete this.tmp_flag;
    };

    Gateway.prototype.onbind = function($target) {
      $target.on('click', 'a.edit', this.edit).on('click', '.delete-gateway', this["delete"]);
      return $target.filter('li').on('mouseenter', this.mouse_enter).on('mouseleave', this.mouse_leave);
    };

    Gateway.prototype.onunbind = function($target) {
      var _ref;
      $target.off('click', 'a', this.edit).off('click', '.delete-gateway', this["delete"]).off('mouseenter', this.mouse_enter).off('mouseleave', this.mouse_leave);
      return (_ref = this.tmp_flag) != null ? _ref.destroy() : void 0;
    };

    function Gateway(auto_bind) {
      this.auto_bind = auto_bind != null ? auto_bind : true;
      this.mouse_leave = __bind(this.mouse_leave, this);

      this.mouse_enter = __bind(this.mouse_enter, this);

      this["delete"] = __bind(this["delete"], this);

      this.edit = __bind(this.edit, this);

      this.debug = '';
      Gateway.__super__.constructor.call(this);
    }

    return Gateway;

  }).call(this, Alcarin.ActiveView);
  return GatewayEditor = (function() {

    function GatewayEditor(edit_pane, groups_pane) {
      this.edit_pane = edit_pane;
      this.groups_pane = groups_pane;
      this.cancel = __bind(this.cancel, this);

      this.on_success = __bind(this.on_success, this);

      this.flag_drop = __bind(this.flag_drop, this);

      this.form = this.edit_pane.find('form').alcForm();
      this.form.enable_proxy(root.proxy);
      this.form.on_success(this.on_success);
      this.edit_pane.on('click', '.close', this.cancel);
      this.minimap = root.minimap();
      this.flag_mode = false;
    }

    GatewayEditor.prototype.flag_drop = function(drop_event) {
      var coords, p;
      p = drop_event.position;
      coords = this.minimap.to_coords(p.left, p.top);
      this.gateway.x(coords.x);
      return this.gateway.y(coords.y);
    };

    GatewayEditor.prototype.on_success = function(response) {
      if (typeof this.callback === "function") {
        this.callback(response);
      }
      return this.cancel();
    };

    GatewayEditor.prototype.edit_flag_mode = function(val) {
      var _ref;
      if (!this.flag_mode && val) {
        this.flag = this.minimap.create_flag(this.gateway.x(), this.gateway.y());
        this.flag.drop(this.flag_drop);
        this.flag.show();
        return this.flag_mode = true;
      } else if (this.flag_mode && !val) {
        if ((_ref = this.flag) != null) {
          _ref.release_drop();
        }
        this.flag.destroy();
        delete this.flag;
        return this.flag_mode = false;
      }
    };

    GatewayEditor.prototype.show = function(gateway, _emit_order, _response_event, callback) {
      this.gateway = gateway;
      this.callback = callback;
      gateway.bind(this.edit_pane);
      this.edit_flag_mode(true);
      this.form.base.find('[name="group"]').val(gateway.group());
      this.form.set_emit_order(_emit_order);
      this.form.set_response_event(_response_event);
      this.groups_pane.fadeOut();
      return this.edit_pane.fadeIn();
    };

    GatewayEditor.prototype.cancel = function() {
      var _this = this;
      this.edit_flag_mode(false);
      this.groups_pane.fadeIn();
      return this.edit_pane.fadeOut(function() {
        _this.gateway.unbind(_this.edit_pane);
        _this.gateway = null;
        return _this.form.reset();
      });
    };

    return GatewayEditor;

  })();
});
