import { showKentikError } from '../datasource/kentikAPI';

class DeviceListCtrl {
  static templateUrl: string;
  devices: any[];
  pageReady: boolean;

  /** @ngInject */
  constructor($scope, $injector, public $location: any, public backendSrv: any) {
    this.devices = [];
    this.pageReady = false;
    this.getDevices();
  }
  getDevices() {
    this.backendSrv.get('/api/plugin-proxy/kentik-app/api/v5/devices')
      .then(resp => {
        this.devices = resp.devices;
        this.pageReady = true;
      })
      .catch(error => {
        showKentikError(error);
      });
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
