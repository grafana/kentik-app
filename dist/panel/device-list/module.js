'use strict';

System.register(['lodash', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var _, PanelCtrl, loadPluginCss, _createClass, panelDefaults, DeviceListCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_appPluginsSdk) {
      PanelCtrl = _appPluginsSdk.PanelCtrl;
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      loadPluginCss({
        dark: 'plugins/kentik-app/css/kentik.dark.css',
        light: 'plugins/kentik-app/css/kentik.light.css'
      });

      panelDefaults = {
        fullscreen: true
      };

      _export('PanelCtrl', DeviceListCtrl = function (_PanelCtrl) {
        _inherits(DeviceListCtrl, _PanelCtrl);

        /** @ngInject */
        function DeviceListCtrl($scope, $injector, $location, backendSrv) {
          _classCallCheck(this, DeviceListCtrl);

          var _this = _possibleConstructorReturn(this, (DeviceListCtrl.__proto__ || Object.getPrototypeOf(DeviceListCtrl)).call(this, $scope, $injector));

          _this.$location = $location;
          _this.backendSrv = backendSrv;
          _this.devices = [];
          _this.pageReady = false;
          _this.getDevices();
          _.defaults(_this.panel, panelDefaults);
          return _this;
        }

        _createClass(DeviceListCtrl, [{
          key: 'getDevices',
          value: function getDevices() {
            var _this2 = this;

            this.backendSrv.get("/api/plugin-proxy/kentik-app/api/v5/devices").then(function (resp) {
              _this2.devices = resp.devices;
              _this2.pageReady = true;
            });
          }
        }, {
          key: 'refresh',
          value: function refresh() {
            this.getDevices();
          }
        }, {
          key: 'gotoDashboard',
          value: function gotoDashboard(device) {
            this.$location.path("/dashboard/db/kentik-top-talkers").search({ "var-device": device.device_name });
          }
        }, {
          key: 'gotoDeviceDetail',
          value: function gotoDeviceDetail(device) {
            this.$location.url("/plugins/kentik-app/page/device-details?device=" + device.id);
          }
        }]);

        return DeviceListCtrl;
      }(PanelCtrl));

      DeviceListCtrl.templateUrl = 'public/plugins/kentik-app/components/device_list.html';

      _export('PanelCtrl', DeviceListCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
