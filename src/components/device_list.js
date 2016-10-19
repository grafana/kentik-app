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
    this.backendSrv.get("/api/plugin-proxy/kentik-app/api/v5/devices").then(resp => {
      this.devices = resp.devices;
      this.pageReady = true;
    });
  }

  refresh() {
    this.getDevices();
  }

  gotoDashboard(device) {
    this.$location.path("/dashboard/db/kentik-top-talkers").search({"var-device": device.device_name});
  }

  gotoDeviceDetail(device) {
    this.$location.url("/plugins/kentik-app/page/device-details?device="+device.id);
  }
}

DeviceListCtrl.templateUrl = 'components/device_list.html';

export {DeviceListCtrl};
