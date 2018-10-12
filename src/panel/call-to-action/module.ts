import * as _ from 'lodash';
import { PanelCtrl, loadPluginCss } from 'grafana/app/plugins/sdk';

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

  /** @ngInject */
  constructor($scope, $injector, public backendSrv: any) {
    super($scope, $injector);
    this.deviceStatus = '';
    this.allDone = false;
    this.getTaskStatus();
    _.defaults(this.panel, panelDefaults);
  }

  getTaskStatus() {
    this.getDevices().then(() => {
      if (this.deviceStatus === 'hasDevices') {
        this.allDone = true;
      } else {
        this.allDone = false;
      }
    });
  }

  getDevices() {
    return this.backendSrv.get('/api/plugin-proxy/kentik-app/api/v5/devices').then(resp => {
      if (resp.devices.length > 0) {
        this.deviceStatus = 'hasDevices';
      } else {
        this.deviceStatus = 'noDevices';
      }
    });
  }

  refresh() {
    this.getTaskStatus();
  }
}

CallToActiontCtrl.templateUrl = 'panel/call-to-action/module.html';
export { CallToActiontCtrl as PanelCtrl };
