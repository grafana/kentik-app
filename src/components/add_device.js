import _ from 'lodash';
import angular from 'angular';

var defaults = {
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

export class AddDeviceCtrl {
  /** @ngInject */
  constructor($scope, $injector, $location, backendSrv, alertSrv) {
    this.backendSrv = backendSrv;
    this.alertSrv = alertSrv;
    this.$location = $location;
    this.device = angular.copy(defaults);
    this.sending_ips = [{ip: ''}];
  }

  addIP() {
    this.sending_ips.push({ip: ''});
  }

  removeIP(index) {
    this.sending_ips.splice(index, 1);
  }

  addDevice() {
    var ips = [];
    _.forEach(this.sending_ips, function(ip) {
      ips.push(ip.ip);
    });
    this.device.sending_ips = ips.join();
    this.backendSrv
      .post("/api/plugin-proxy/kentik-app/api/v5/device", this.device)
      .then(resp => {
        if ('err' in resp) {
          this.alertSrv.set("Device Add failed.", resp.err, 'error');
        } else {
          this.$location.url("/plugins/kentik-app/page/device-list");
        }
      });
  }
}

AddDeviceCtrl.templateUrl = 'components/add_device.html';
