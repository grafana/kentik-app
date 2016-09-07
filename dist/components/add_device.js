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
        type: 'router',
        device_description: '',
        flow_type: 'sflow',
        flow_rate: 5,
        other_ips: '',
        minimize_snmp: false,
        device_ip: '',
        snmp_community: ''
      };

      _export('AddDeviceCtrl', AddDeviceCtrl = function () {
        /** @ngInject */
        function AddDeviceCtrl($scope, $injector, $location, backendSrv, alertSrv) {
          _classCallCheck(this, AddDeviceCtrl);

          this.backendSrv = backendSrv;
          this.alertSrv = alertSrv;
          this.$location = $location;
          this.device = angular.copy(defaults);
          this.other_ips = [{ ip: '' }];
        }

        _createClass(AddDeviceCtrl, [{
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
          key: 'addDevice',
          value: function addDevice() {
            var _this = this;

            var self = this;
            var ips = [];
            _.forEach(this.other_ips, function (ip) {
              ips.push(ip.ip);
            });
            this.device.other_ips = ips.join();
            this.backendSrv.post("/api/plugin-proxy/kentik-app/api/v1/device/create", this.device).then(function (resp) {
              if ('err' in resp) {
                _this.alertSrv.set("Device Add failed.", resp.err, 'error');
              } else {
                self.$location.url("/plugins/kentik-app/page/device-list");
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
