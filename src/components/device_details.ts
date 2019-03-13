import { KentikAPI } from '../datasource/kentikAPI';
import { showCustomAlert } from "../datasource/alertHelper";
import { getRegion } from "../datasource/regionHelper";

export class DeviceDetailsCtrl {
  static templateUrl: string;
  device: any;
  deviceDTO: any;
  pageReady: boolean;
  otherIps: any;
  kentik: KentikAPI;
  region: string;

  /** @ngInject */
  constructor($scope, $injector, public $location: any, public backendSrv: any, public alertSrv: any) {
    this.device = {};
    this.deviceDTO = {};
    this.pageReady = false;
    // get region from datasource
    //this.region = "default";
    backendSrv.get('/api/datasources').then( (allDS: any) => {
      this.region = getRegion(allDS);
      this.kentik = new KentikAPI(this.backendSrv);
      this.kentik.setRegion(this.region);
      this.getDevice($location.search().device);
    });
  }

  addIP() {
    this.otherIps.push({ ip: '' });
  }

  removeIP(index) {
    this.otherIps.splice(index, 1);
  }

  getDevice(deviceId) {
    this.backendSrv.get(`/api/plugin-proxy/kentik-app/${this.region}/api/v5/device/` + deviceId).then(resp => {
      this.device = resp.device;
      this.updateDeviceDTO();
      this.pageReady = true;
    });
  }

  gotoDashboard(device_name) {
    this.$location.url('/dashboard/db/kentik-top-talkers?var-device=' + device_name);
  }

  updateDeviceDTO() {
    this.deviceDTO = {
      device_id: this.device.id,
      device_name: this.device.device_name,
      device_type: this.device.device_type,
      device_description: this.device.device_description,
      device_flow_type: this.device.device_flow_type,
      device_sample_rate: parseInt(this.device.device_sample_rate, 10),
      minimize_snmp: this.device.minimize_snmp,
      device_snmp_ip: this.device.device_snmp_ip,
      device_snmp_community: this.device.device_snmp_community,
      device_bgp_type: this.device.device_bgp_type,
      device_bgp_password: this.device.device_bgp_password,
      device_bgp_neighbor_ip: this.device.device_bgp_neighbor_ip,
      device_bgp_neighbor_asn: parseInt(this.device.device_bgp_neighbor_asn, 10),
    };
  }

  update() {
    if (!this.deviceDTO.device_snmp_ip) {
      delete this.deviceDTO.device_snmp_ip;
    }
    if (!this.deviceDTO.device_snmp_community) {
      delete this.deviceDTO.device_snmp_community;
    }
    const data = { device: this.deviceDTO };

    this.backendSrv.put(`/api/plugin-proxy/kentik-app/${this.region}/api/v5/device/` + this.deviceDTO.device_id, data).then(
      resp => {
        if ('err' in resp) {
          showCustomAlert('Device Update failed.', resp.err, 'error');
        } else {
          showCustomAlert('Device Updated.', this.deviceDTO.device_name, 'success');
          return this.getDevice(this.deviceDTO.device_id);
        }
      },
      error => {
        if ('error' in error.data) {
          showCustomAlert('Device Update failed.', error.data.error, 'error');
          return;
        } else {
          showCustomAlert('Device Update failed.', error, 'error');
          return;
        }
      }
    );
  }
}

DeviceDetailsCtrl.templateUrl = 'components/device_details.html';
