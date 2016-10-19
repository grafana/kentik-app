import _ from 'lodash';
import {PanelCtrl} from 'app/plugins/sdk';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/kentik-app/css/kentik.dark.css',
  light: 'plugins/kentik-app/css/kentik.light.css'
});

var panelDefaults = {
  fullscreen: true
};

class CallToActiontCtrl extends PanelCtrl {

  /** @ngInject */
  constructor($scope, $injector, backendSrv) {
    super($scope, $injector);
    this.backendSrv = backendSrv;
    this.deviceStatus = '';
    this.AllDone = false;
    this.getTaskStatus();
    _.defaults(this.panel, panelDefaults);
  }

  getTaskStatus() {
    this.getDevices().then(() => {
      if (this.deviceStatus === 'hasDevices') {
        this.AllDone = true;
      } else {
        this.AllDone = false;
      }
    });
  }

  getDevices() {
    return this.backendSrv.get("/api/plugin-proxy/kentik-app/api/v5/devices")
      .then(resp => {
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
export {CallToActiontCtrl as PanelCtrl};
