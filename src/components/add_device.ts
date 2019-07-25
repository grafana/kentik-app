import * as _ from 'lodash';
import angular from 'angular';
import { getRegion } from '../datasource/regionHelper';

const defaults = {
  device_name: '',
  device_type: 'router',
  device_description: '',
  device_flow_type: 'sflow',
  device_sample_rate: 5,
  sending_ips: '',
  minimize_snmp: false,
  device_bgp_type: 'none',
  device_snmp_ip: '',
  device_snmp_community: '',
};

export class AddDeviceCtrl {
  static templateUrl: string;
  device: any;
  sendingIps: any[];
  region = '';

  /** @ngInject */
  constructor($scope, $injector, public $location: any, public backendSrv: any, public alertSrv: any) {
    this.device = angular.copy(defaults);
    this.sendingIps = [{ ip: '' }];
    // get region from datasource
    //this.region = "default";
    backendSrv.get('/api/datasources').then((allDS: any) => {
      this.region = getRegion(allDS);
    });
  }

  addIP() {
    this.sendingIps.push({ ip: '' });
  }

  removeIP(index) {
    this.sendingIps.splice(index, 1);
  }

  addDevice() {
    const ips: string[] = [];
    _.forEach(this.sendingIps, ip => {
      ips.push(ip.ip);
    });
    this.device.sending_ips = ips.join();
    this.backendSrv.post(`/api/plugin-proxy/kentik-app/${this.region}/api/v5/device`, this.device).then(resp => {
      if ('err' in resp) {
        this.alertSrv.set('Device Add failed.', resp.err, 'error');
      } else {
        this.$location.url('/plugins/kentik-app/page/device-list');
      }
    });
  }
}

AddDeviceCtrl.templateUrl = 'components/add_device.html';
