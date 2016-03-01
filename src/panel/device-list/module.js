import _ from 'lodash';
import {PanelCtrl} from 'app/plugins/sdk';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/kentik-app/css/dark.css',
  light: 'plugins/kentik-app/css/light.css'
});

var panelDefaults = {
    fullscreen: true
};

class DeviceListCtrl extends PanelCtrl {
  /** @ngInject */
  constructor($scope, $injector, $location, backendSrv) {
    super($scope, $injector);
    this.$location = $location;
    this.backendSrv = backendSrv;
    this.devices = [];
    this.pageReady = false;
    this.getDevices();
    _.defaults(this.panel, panelDefaults);
  }

  getDevices() {
    var self = this;
    this.backendSrv.get("/api/plugin-proxy/kentik-app/api/device/list").then(function(resp) {
      self.devices = resp.device;
      self.pageReady = true;
    });
  }

  refresh() {
    this.getDevices()
  }

  gotoDeviceDetail(device) {
    this.$location.url("/plugins/kentik-app/page/device?device="+device.id);
  }
}

DeviceListCtrl.templateUrl = 'panel/device-list/module.html';

export {DeviceListCtrl as PanelCtrl}

