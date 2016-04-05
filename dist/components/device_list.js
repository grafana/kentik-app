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
        function DeviceListCtrl() {
          _classCallCheck(this, DeviceListCtrl);
        }

        _createClass(DeviceListCtrl, [{
          key: "getDevices",
          value: function getDevices() {
            var self = this;
            this.backendSrv.get("/api/plugin-proxy/kentik-app/api/device/list").then(function (resp) {
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
            this.$location.url("/plugins/kentik-app/pags/device-detail?device=" + device.id);
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
