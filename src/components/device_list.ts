import { KentikAPI } from '../datasource/kentikAPI';

class DeviceListCtrl {
  static templateUrl: string;
  devices: any[];
  pageReady: boolean;
  kentik: KentikAPI;

  /** @ngInject */
  constructor($scope, $injector, public $location: any, public backendSrv: any) {
    this.devices = [];
    this.pageReady = false;
    this.kentik = new KentikAPI(this.backendSrv);
    this.getDevices();
  }

  async getDevices() {
    this.devices = await this.kentik.getDevices();
    this.pageReady = true;
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
