import { KentikAPI, showAlert } from '../../datasource/kentikAPI';
import { PanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';

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

  /** @ngInject */
  constructor($scope, $injector, public backendSrv: any) {
    super($scope, $injector);
    this.deviceStatus = '';
    this.allDone = false;
    this.kentik = new KentikAPI(this.backendSrv);
    this.getTaskStatus();
    _.defaults(this.panel, panelDefaults);
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
