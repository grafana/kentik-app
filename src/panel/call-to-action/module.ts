import { KentikAPI } from '../../datasource/kentikAPI';
import { showAlert } from "../../datasource/alertHelper";
import { PanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';
import { getRegion } from "../../datasource/regionHelper";

import * as _ from 'lodash';

loadPluginCss({
  dark: 'plugins/kentik-app/css/kentik.dark.css',
  light: 'plugins/kentik-app/css/kentik.light.css',
});

const panelDefaults = {
  fullscreen: true,
};

class CallToActiontCtrl extends PanelCtrl {
  static templateUrl: string;
  deviceStatus: string;
  allDone: boolean;
  kentik: KentikAPI;
  region: string;

  /** @ngInject */
  constructor($scope, $injector, public backendSrv: any, private datasourceSrv) {
    super($scope, $injector);
    _.defaults(this.panel, panelDefaults);
    this.deviceStatus = '';
    this.allDone = false;
    // get region from datasource
    //this.region = "default";
    backendSrv.get('/api/datasources').then( (allDS: any) => {
      this.region = getRegion(allDS);
      this.kentik = new KentikAPI(this.backendSrv);
      this.kentik.setRegion(this.region);
    }).then (async () => {
      await this.getTaskStatus();
    });
  }

  async getTaskStatus() {
    await this.getDevices();

    if (this.deviceStatus === 'hasDevices') {
      this.allDone = true;
    } else {
      this.allDone = false;
    }
  }

  async getDevices() {
    try {
      const devices = await this.kentik.getDevices();

      if (devices.length > 0) {
        this.deviceStatus = 'hasDevices';
      } else {
        this.deviceStatus = 'noDevices';
      }
    } catch (e) {
      showAlert(e);
    }
  }

  refresh() {
    this.getTaskStatus();
  }
}

CallToActiontCtrl.templateUrl = 'panel/call-to-action/module.html';
export { CallToActiontCtrl as PanelCtrl };
