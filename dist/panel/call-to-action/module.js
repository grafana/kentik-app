'use strict';

System.register(['lodash', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var _, PanelCtrl, loadPluginCss, _createClass, panelDefaults, CallToActiontCtrl;

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

      _export('PanelCtrl', CallToActiontCtrl = function (_PanelCtrl) {
        _inherits(CallToActiontCtrl, _PanelCtrl);

        /** @ngInject */
        function CallToActiontCtrl($scope, $injector, backendSrv) {
          _classCallCheck(this, CallToActiontCtrl);

          var _this = _possibleConstructorReturn(this, (CallToActiontCtrl.__proto__ || Object.getPrototypeOf(CallToActiontCtrl)).call(this, $scope, $injector));

          _this.backendSrv = backendSrv;
          _this.deviceStatus = '';
          _this.AllDone = false;
          _this.getTaskStatus();
          _.defaults(_this.panel, panelDefaults);
          return _this;
        }

        _createClass(CallToActiontCtrl, [{
          key: 'getTaskStatus',
          value: function getTaskStatus() {
            var _this2 = this;

            this.getDevices().then(function () {
              if (_this2.deviceStatus === 'hasDevices') {
                _this2.AllDone = true;
              } else {
                _this2.AllDone = false;
              }
            });
          }
        }, {
          key: 'getDevices',
          value: function getDevices() {
            var _this3 = this;

            return this.backendSrv.get("/api/plugin-proxy/kentik-app/api/v5/devices").then(function (resp) {
              if (resp.devices.length > 0) {
                _this3.deviceStatus = 'hasDevices';
              } else {
                _this3.deviceStatus = 'noDevices';
              }
            });
          }
        }, {
          key: 'refresh',
          value: function refresh() {
            this.getTaskStatus();
          }
        }]);

        return CallToActiontCtrl;
      }(PanelCtrl));

      CallToActiontCtrl.templateUrl = 'panel/call-to-action/module.html';

      _export('PanelCtrl', CallToActiontCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
