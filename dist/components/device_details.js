"use strict";

System.register([], function (_export, _context) {
  var _createClass, DeviceDetailsCtrl;

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

      _export("DeviceDetailsCtrl", DeviceDetailsCtrl = function () {
        /** @ngInject */

        function DeviceDetailsCtrl($scope, $injector, $location, backendSrv) {
          _classCallCheck(this, DeviceDetailsCtrl);

          this.backendSrv = backendSrv;
          this.$location = $location;
          this.device = {};
          this.pageReady = false;
          this.getDevice($location.search().device);
        }

        _createClass(DeviceDetailsCtrl, [{
          key: "getDevice",
          value: function getDevice(deviceId) {
            var self = this;
            this.backendSrv.get("/api/plugin-proxy/kentik-app/api/device/" + deviceId).then(function (resp) {
              self.device = resp.device[0];
              self.pageReady = true;
            });
          }
        }]);

        return DeviceDetailsCtrl;
      }());

      DeviceDetailsCtrl.templateUrl = 'components/device_details.html';

      _export("DeviceDetailsCtrl", DeviceDetailsCtrl);
    }
  };
});
//# sourceMappingURL=device_details.js.map
