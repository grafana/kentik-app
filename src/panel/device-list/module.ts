import { showKentikError } from '../../datasource/kentikAPI';
import { PanelCtrl } from 'grafana/app/plugins/sdk';
import { loadPluginCss } from 'grafana/app/plugins/sdk';

import * as _ from 'lodash';

loadPluginCss({
  dark: 'plugins/kentik-app/css/kentik.dark.css',
  light: 'plugins/kentik-app/css/kentik.light.css',
});

const panelDefaults = {
  fullscreen: true,
};

class DeviceListCtrl extends PanelCtrl {
  static templateUrl: any;
  devices: any[];
  pageReady: boolean;

  /** @ngInject */
  constructor($scope, $injector, public $location: any, public backendSrv: any) {
    super($scope, $injector);
    this.devices = [];
    this.pageReady = false;
    this.getDevices();
    _.defaults(this.panel, panelDefaults);
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

DeviceListCtrl.templateUrl = 'public/plugins/kentik-app/components/device_list.html';

export { DeviceListCtrl as PanelCtrl };
