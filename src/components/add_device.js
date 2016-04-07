import _ from 'lodash';
import angular from 'angular';

var defaults = {
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

export class AddDeviceCtrl {
  /** @ngInject */
  constructor($scope, $injector, $location, backendSrv, alertSrv) {
    this.backendSrv = backendSrv;
    this.alertSrv = alertSrv;
    this.$location = $location;
    this.device = angular.copy(defaults);
    this.other_ips = [{ip: ''}];
  }

  addIP() {
    this.other_ips.push({ip: ''});
  }

  removeIP(index) {
    this.other_ips.splice(index, 1);
  }

  addDevice() {
    var self = this;
    var ips = [];
    _.forEach(this.other_ips, function(ip) {
      ips.push(ip.ip);
    });
    this.device.other_ips = ips.join();
    this.backendSrv.post("/api/plugin-proxy/kentik-app/api/v1/device/create", this.device).then((resp) => {
      if ('err' in resp) {
        this.alertSrv.set("Device Add failed.", resp.err, 'error');
      } else {
        self.$location.url("/plugins/kentik-app/page/device-list");
      }
    });
  }
}

AddDeviceCtrl.templateUrl = 'components/add_device.html';
