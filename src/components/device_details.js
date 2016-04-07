class DeviceDetailsCtrl {
	/** @ngInject */
  constructor($scope, $injector, $location, backendSrv) {
    this.backendSrv = backendSrv;
    this.$location = $location;
    this.device = {};
    this.pageReady = false;
    this.getDevice($location.search().device);
  }
  getDevice(deviceId) {
    var self = this;
    this.backendSrv.get("/api/plugin-proxy/kentik-app/api/device/"+deviceId).then(function(resp) {
      self.device = resp.device[0];
      self.pageReady = true;
    });
  }
}

DeviceDetailsCtrl.templateUrl = 'components/device_details.html';

export {DeviceDetailsCtrl}
