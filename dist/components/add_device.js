'use strict';

System.register(['lodash', 'angular'], function (_export, _context) {
  "use strict";

  var _, angular, _createClass, defaults, AddDeviceCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_angular) {
      angular = _angular.default;
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

      defaults = {
        device_name: '',
        device_type: 'router',
        device_description: '',
        device_flow_type: 'sflow',
        device_sample_rate: 5,
        sending_ips: '',
        minimize_snmp: false,
        device_bgp_type: 'none',
        device_snmp_ip: '',
        device_snmp_community: ''
      };

      _export('AddDeviceCtrl', AddDeviceCtrl = function () {
        /** @ngInject */
        function AddDeviceCtrl($scope, $injector, $location, backendSrv, alertSrv) {
          _classCallCheck(this, AddDeviceCtrl);

          this.backendSrv = backendSrv;
          this.alertSrv = alertSrv;
          this.$location = $location;
          this.device = angular.copy(defaults);
          this.sending_ips = [{ ip: '' }];
        }

        _createClass(AddDeviceCtrl, [{
          key: 'addIP',
          value: function addIP() {
            this.sending_ips.push({ ip: '' });
          }
        }, {
          key: 'removeIP',
          value: function removeIP(index) {
            this.sending_ips.splice(index, 1);
          }
        }, {
          key: 'addDevice',
          value: function addDevice() {
            var _this = this;

            var ips = [];
            _.forEach(this.sending_ips, function (ip) {
              ips.push(ip.ip);
            });
            this.device.sending_ips = ips.join();
            this.backendSrv.post("/api/plugin-proxy/kentik-app/api/v5/device", this.device).then(function (resp) {
              if ('err' in resp) {
                _this.alertSrv.set("Device Add failed.", resp.err, 'error');
              } else {
                _this.$location.url("/plugins/kentik-app/page/device-list");
              }
            });
          }
        }]);

        return AddDeviceCtrl;
      }());

      _export('AddDeviceCtrl', AddDeviceCtrl);

      AddDeviceCtrl.templateUrl = 'components/add_device.html';
    }
  };
});
//# sourceMappingURL=add_device.js.map
