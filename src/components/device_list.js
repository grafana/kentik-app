class DeviceListCtrl {
  /** @ngInject */
  constructor($scope, $injector, $location, backendSrv) {
    this.backendSrv = backendSrv;
    this.$location = $location;
    this.devices = [];
    this.pageReady = false;
    this.getDevices();
  }
  getDevices() {
    var self = this;
    this.backendSrv.get("/api/plugin-proxy/kentik-app/api/v1/device/list").then(function(resp) {
      self.devices = resp.device;
      self.pageReady = true;
    });
  }

  refresh() {
    this.getDevices()
  }

  gotoDeviceDetail(device) {
    this.$location.url("/plugins/kentik-app/page/device-details?device="+device.id);
  }
}

DeviceListCtrl.templateUrl = 'components/device_list.html'

export {DeviceListCtrl}
