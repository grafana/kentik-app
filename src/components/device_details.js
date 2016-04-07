class DeviceDetailsCtrl {
	/** @ngInject */
  constructor($scope, $injector, $location, backendSrv) {
    this.backendSrv = backendSrv;
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
    var self = this;
    this.backendSrv.get("/api/plugin-proxy/kentik-app/api/device/"+deviceId).then(function(resp) {
      self.device = resp.device[0];
      self.updateDeviceDTO();
      self.pageReady = true;
    });
  }

  updateDeviceDTO() {
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
      snmp_community: this.device.device_snmp_community,
    };
    this.other_ips = [];
    _.forEach(this.deviceDTO.other_ips.split(','), function(ip) {
      self.other_ips.push({ip: ip});
    });
  }

  update() {
    var ips = [];
    _.forEach(this.other_ips, function(ip) {
      ips.push(ip.ip);
    });
    this.deviceDTO.other_ips = ips.join();
    this.backendSrv.post("/api/plugin-proxy/kentik-app/api/device/"+this.deviceDTO.device_id, this.deviceDTO)
  }
}

DeviceDetailsCtrl.templateUrl = 'components/device_details.html';

export {DeviceDetailsCtrl}
