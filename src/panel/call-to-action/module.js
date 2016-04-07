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
  constructor($scope, $injector, $q, backendSrv) {
    super($scope, $injector);
    this.$q = $q;
    this.backendSrv = backendSrv;
    this.deviceStatus = '';
    this.AllDone = false;
    this.getTaskStatus();
    _.defaults(this.panel, panelDefaults);
  }

  getTaskStatus() {
    var self = this;
    this.$q.all([
      self.getDevices()
    ]).then(function() {
      if (self.deviceStatus === 'hasDevices') {
        self.AllDone = true;
      } else {
        self.AllDone = false;
      }
    });
  }

  getDevices() {
    var self = this;
    return this.backendSrv.get("/api/plugin-proxy/kentik-app/api/v1/device/list").then(function(resp) {
      if (resp.device.length > 0) {
        self.deviceStatus = 'hasDevices';
      } else {
        self.deviceStatus = 'noDevices';
      }
    });
  }

  refresh() {
    this.getTaskStatus();
  }
}

CallToActiontCtrl.templateUrl = 'panel/call-to-action/module.html';

export {CallToActiontCtrl as PanelCtrl};
