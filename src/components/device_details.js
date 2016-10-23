export class DeviceDetailsCtrl {

	/** @ngInject */
  constructor($scope, $injector, $location, backendSrv, alertSrv) {
    this.backendSrv = backendSrv;
    this.alertSrv = alertSrv;
    this.$location = $location;
    this.device = {};
    this.deviceDTO = {};
    this.pageReady = false;
    this.getDevice($location.search().device);
  }

  addIP() {
    this.other_ips.push({ip: ''});
  }

  removeIP(index) {
    this.other_ips.splice(index, 1);
  }

  getDevice(deviceId) {
    this.backendSrv.get("/api/plugin-proxy/kentik-app/api/v5/device/" + deviceId)
      .then(resp => {
        this.device = resp.device;
        this.updateDeviceDTO();
        this.pageReady = true;
      });
  }

  gotoDashboard(device_name) {
    this.$location.url("/dashboard/db/kentik-top-talkers?var-device=" + device_name);
  }

  updateDeviceDTO() {
    this.deviceDTO = {
      device_id: this.device.id,
      device_name: this.device.device_name,
      device_type: this.device.device_type,
      device_description: this.device.device_description,
      device_flow_type: this.device.device_flow_type,
      device_sample_rate: parseInt(this.device.device_sample_rate),
      minimize_snmp: this.device.minimize_snmp,
      device_snmp_ip:        this.device.device_snmp_ip,
      device_snmp_community: this.device.device_snmp_community,
      device_bgp_type:         this.device.device_bgp_type,
      device_bgp_password:     this.device.device_bgp_password,
      device_bgp_neighbor_ip:  this.device.device_bgp_neighbor_ip,
      device_bgp_neighbor_asn: parseInt(this.device.device_bgp_neighbor_asn)
    };
  }

  update() {
    if (!this.deviceDTO.device_snmp_ip) {
      delete this.deviceDTO.device_snmp_ip;
    }
    if (!this.deviceDTO.device_snmp_community) {
      delete this.deviceDTO.device_snmp_community;
    }
    let data = {device: this.deviceDTO};

    this.backendSrv.put("/api/plugin-proxy/kentik-app/api/v5/device/" + this.deviceDTO.device_id, data)
      .then(resp => {
        if ('err' in resp) {
          this.alertSrv.set("Device Update failed.", resp.err, 'error');
        } else {
          this.alertSrv.set("Device Updated.", this.deviceDTO.device_name, 'success', 3000);
          return this.getDevice(this.deviceDTO.device_id);
        }
      }, error => {
        if ('error' in error.data) {
          this.alertSrv.set("Device Update failed.", error.data.error, 'error');
        } else {
          this.alertSrv.set("Device Update failed.", error, 'error');
        }
      });
  }
}

DeviceDetailsCtrl.templateUrl = 'components/device_details.html';
