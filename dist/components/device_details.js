"use strict";

System.register([], function (_export, _context) {
  "use strict";

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
        function DeviceDetailsCtrl($scope, $injector, $location, backendSrv, alertSrv) {
          _classCallCheck(this, DeviceDetailsCtrl);

          this.backendSrv = backendSrv;
          this.alertSrv = alertSrv;
          this.$location = $location;
          this.device = {};
          this.deviceDTO = {};
          this.pageReady = false;
          this.getDevice($location.search().device);
        }

        _createClass(DeviceDetailsCtrl, [{
          key: "addIP",
          value: function addIP() {
            this.other_ips.push({ ip: '' });
          }
        }, {
          key: "removeIP",
          value: function removeIP(index) {
            this.other_ips.splice(index, 1);
          }
        }, {
          key: "getDevice",
          value: function getDevice(deviceId) {
            var _this = this;

            this.backendSrv.get("/api/plugin-proxy/kentik-app/api/v5/device/" + deviceId).then(function (resp) {
              _this.device = resp.device;
              _this.updateDeviceDTO();
              _this.pageReady = true;
            });
          }
        }, {
          key: "gotoDashboard",
          value: function gotoDashboard(device_name) {
            this.$location.url("/dashboard/db/kentik-top-talkers?var-device=" + device_name);
          }
        }, {
          key: "updateDeviceDTO",
          value: function updateDeviceDTO() {
            this.deviceDTO = {
              device_id: this.device.id,
              device_name: this.device.device_name,
              device_type: this.device.device_type,
              device_description: this.device.device_description,
              device_flow_type: this.device.device_flow_type,
              device_sample_rate: parseInt(this.device.device_sample_rate),
              minimize_snmp: this.device.minimize_snmp,
              device_snmp_ip: this.device.device_snmp_ip,
              device_snmp_community: this.device.device_snmp_community,
              device_bgp_type: this.device.device_bgp_type,
              device_bgp_password: this.device.device_bgp_password,
              device_bgp_neighbor_ip: this.device.device_bgp_neighbor_ip,
              device_bgp_neighbor_asn: parseInt(this.device.device_bgp_neighbor_asn)
            };
          }
        }, {
          key: "update",
          value: function update() {
            var _this2 = this;

            if (!this.deviceDTO.device_snmp_ip) {
              delete this.deviceDTO.device_snmp_ip;
            }
            if (!this.deviceDTO.device_snmp_community) {
              delete this.deviceDTO.device_snmp_community;
            }
            var data = { device: this.deviceDTO };

            this.backendSrv.put("/api/plugin-proxy/kentik-app/api/v5/device/" + this.deviceDTO.device_id, data).then(function (resp) {
              if ('err' in resp) {
                _this2.alertSrv.set("Device Update failed.", resp.err, 'error');
              } else {
                _this2.alertSrv.set("Device Updated.", _this2.deviceDTO.device_name, 'success', 3000);
                return _this2.getDevice(_this2.deviceDTO.device_id);
              }
            }, function (error) {
              if ('error' in error.data) {
                _this2.alertSrv.set("Device Update failed.", error.data.error, 'error');
              } else {
                _this2.alertSrv.set("Device Update failed.", error, 'error');
              }
            });
          }
        }]);

        return DeviceDetailsCtrl;
      }());

      _export("DeviceDetailsCtrl", DeviceDetailsCtrl);

      DeviceDetailsCtrl.templateUrl = 'components/device_details.html';
    }
  };
});
//# sourceMappingURL=device_details.js.map
