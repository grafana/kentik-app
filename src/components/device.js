export class DeviceCtrl {
  constructor($scope, $injector, $routeParams, backendSrv) {
  	this.backendSrv = backendSrv;
    this.device = {};
    this.device_loaded = false;
    this.tab = "detail";
    if ("start_tab" in $routeParams) {
    	this.tab = $routeParams.start_tab;
    }
    if ("device" in $routeParams) {
    	this.GetDevice($routeParams.device);
    }
  }

  ChangeTab(newTab) {
  	console.log("change tab called.");
  	this.tab = newTab;
  }

  TabState(tab) {
  	if (tab === this.tab) {
  		return "active";
  	}
  	return "nonactive";
  }

  GetDevice(deviceId) {
  	self = this;
  	return this.backendSrv.get("/api/plugin-proxy/kentik-app/api/device/"+deviceId).then(function(resp) {
  		if (resp.device.length > 0) {
  			self.device = resp.device[0];
  			self.device_loaded = true;
  		}
  	});
  }
}
DeviceCtrl.templateUrl = 'components/device.html';