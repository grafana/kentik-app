import { KentikAPI } from '../../datasource/kentikAPI';
import { showAlert } from '../../datasource/alertHelper';

import { PanelCtrl } from 'grafana/app/plugins/sdk';
import { loadPluginCss } from 'grafana/app/plugins/sdk';
import { getRegion } from '../../datasource/regionHelper';

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
  kentik: KentikAPI = {} as KentikAPI;
  region = '';

  /** @ngInject */
  constructor($scope, $injector, public $location: any, public backendSrv: any) {
    super($scope, $injector);
    _.defaults(this.panel, panelDefaults);
    this.devices = [];
    this.pageReady = false;
    // get region from datasource
    //this.region = "default";
    backendSrv
      .get('/api/datasources')
      .then((allDS: any) => {
        this.region = getRegion(allDS);
        this.kentik = new KentikAPI(this.backendSrv);
        this.kentik.setRegion(this.region);
      })
      .then(async () => {
        await this.getDevices();
      });
  }

  async getDevices() {
    try {
      this.devices = await this.kentik.getDevices();
      this.pageReady = true;
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

DeviceListCtrl.templateUrl = 'public/plugins/kentik-app/components/device_list.html';

export { DeviceListCtrl as PanelCtrl };
