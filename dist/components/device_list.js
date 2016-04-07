"use strict";

System.register([], function (_export, _context) {
  var _createClass, DeviceListCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
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

      _export("DeviceListCtrl", DeviceListCtrl = function () {
        /** @ngInject */

        function DeviceListCtrl($scope, $injector, $location, backendSrv) {
          _classCallCheck(this, DeviceListCtrl);

          this.backendSrv = backendSrv;
          this.$location = $location;
          this.devices = [];
          this.pageReady = false;
          this.getDevices();
        }

        _createClass(DeviceListCtrl, [{
          key: "getDevices",
          value: function getDevices() {
            var self = this;
            this.backendSrv.get("/api/plugin-proxy/kentik-app/api/v1/device/list").then(function (resp) {
              self.devices = resp.device;
              self.pageReady = true;
            });
          }
        }, {
          key: "refresh",
          value: function refresh() {
            this.getDevices();
          }
        }, {
          key: "gotoDeviceDetail",
          value: function gotoDeviceDetail(device) {
            this.$location.url("/plugins/kentik-app/page/device-details?device=" + device.id);
          }
        }]);

        return DeviceListCtrl;
      }());

      DeviceListCtrl.templateUrl = 'components/device_list.html';

      _export("DeviceListCtrl", DeviceListCtrl);
    }
  };
});
//# sourceMappingURL=device_list.js.map
