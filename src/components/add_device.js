import _ from 'lodash';

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

class AddDeviceCtrl {
  /** @ngInject */
  constructor($scope, $injector, $location, backendSrv) {
    this.backendSrv = backendSrv;
    this.$location = $location
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
  	this.backendSrv.post("/api/plugin-proxy/kentik-app/api/device/create", this.device).then(() => {
  		self.$location.url("/plugins/kentik-app/page/device-list");
   	});
  }
}
AddDeviceCtrl.templateUrl = 'components/add_device.html';

export {AddDeviceCtrl}
