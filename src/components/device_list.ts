import { KentikAPI } from '../datasource/kentikAPI';
import { showAlert } from '../datasource/alertHelper';

import { getRegion } from '../datasource/regionHelper';
class DeviceListCtrl {
  static templateUrl: string;
  devices: any[];
  pageReady: boolean;
  kentik: KentikAPI;

  /** @ngInject */
  constructor(private $scope, $injector, public $location: any, public backendSrv: any) {
    this.devices = [];
    this.pageReady = false;
    this.kentik = new KentikAPI(this.backendSrv);
    this.getDevices();
  }

  getDevices() {
    try {
      this.kentik.getDevices().then(devices => {
        this.devices = devices;
        this.pageReady = true;
        this.$scope.$apply();
      });
    } catch (e) {
      showAlert(e);
    }
  }

  refresh() {
    this.getDevices();
  }

  gotoDashboard(device) {
    this.$location.path('/dashboard/db/kentik-top-talkers').search({ 'var-device': device.device_name });
  }

  gotoDeviceDetail(device) {
    this.$location.url('/plugins/kentik-app/page/device-details?device=' + device.id);
  }
}

DeviceListCtrl.templateUrl = 'components/device_list.html';

export { DeviceListCtrl };
