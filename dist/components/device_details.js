'use strict';

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

      _export('DeviceDetailsCtrl', DeviceDetailsCtrl = function () {
        /** @ngInject */

        function DeviceDetailsCtrl($scope, $injector, $location, backendSrv) {
          _classCallCheck(this, DeviceDetailsCtrl);

          this.backendSrv = backendSrv;
          this.$location = $location;
          this.device = {};
          this.deviceDTO = {};
          this.pageReady = false;
          this.getDevice($location.search().device);
        }

        _createClass(DeviceDetailsCtrl, [{
          key: 'addIP',
          value: function addIP() {
            this.other_ips.push({ ip: '' });
          }
        }, {
          key: 'removeIP',
          value: function removeIP(index) {
            this.other_ips.splice(index, 1);
          }
        }, {
          key: 'getDevice',
          value: function getDevice(deviceId) {
            var self = this;
            this.backendSrv.get("/api/plugin-proxy/kentik-app/api/device/" + deviceId).then(function (resp) {
              self.device = resp.device[0];
              self.updateDeviceDTO();
              self.pageReady = true;
            });
          }
        }, {
          key: 'updateDeviceDTO',
          value: function updateDeviceDTO() {
            var self = this;
            this.deviceDTO = {
              device_id: this.device.device_id,
              device_name: this.device.device_name,
              type: this.device.device_type,
              device_description: this.device.device_description,
              flow_type: this.device.device_flow_type,
              flow_rate: parseInt(this.device.device_sample_rate),
              other_ips: this.device.device_chf_interface,
              minimize_snmp: this.device.minimize_snmp,
              device_ip: this.device.device_snmp_ip,
              snmp_community: this.device.device_snmp_community
            };
            this.other_ips = [];
            _.forEach(this.deviceDTO.other_ips.split(','), function (ip) {
              self.other_ips.push({ ip: ip });
            });
          }
        }, {
          key: 'update',
          value: function update() {
            var ips = [];
            _.forEach(this.other_ips, function (ip) {
              ips.push(ip.ip);
            });
            this.deviceDTO.other_ips = ips.join();
            this.backendSrv.post("/api/plugin-proxy/kentik-app/api/device/" + this.deviceDTO.device_id, this.deviceDTO);
          }
        }]);

        return DeviceDetailsCtrl;
      }());

      DeviceDetailsCtrl.templateUrl = 'components/device_details.html';

      _export('DeviceDetailsCtrl', DeviceDetailsCtrl);
    }
  };
});
//# sourceMappingURL=device_details.js.map
