'use strict';

System.register(['./config/config.js', './components/device_list', './components/device_details', './components/add_device', 'app/plugins/sdk'], function (_export, _context) {
	"use strict";

	var ConfigCtrl, DeviceListCtrl, DeviceDetailsCtrl, AddDeviceCtrl, loadPluginCss;
	return {
		setters: [function (_configConfigJs) {
			ConfigCtrl = _configConfigJs.ConfigCtrl;
		}, function (_componentsDevice_list) {
			DeviceListCtrl = _componentsDevice_list.DeviceListCtrl;
		}, function (_componentsDevice_details) {
			DeviceDetailsCtrl = _componentsDevice_details.DeviceDetailsCtrl;
		}, function (_componentsAdd_device) {
			AddDeviceCtrl = _componentsAdd_device.AddDeviceCtrl;
		}, function (_appPluginsSdk) {
			loadPluginCss = _appPluginsSdk.loadPluginCss;
		}],
		execute: function () {

			loadPluginCss({
				dark: 'plugins/kentik-app/css/kentik.dark.css',
				light: 'plugins/kentik-app/css/kentik.light.css'
			});

			_export('DeviceListCtrl', DeviceListCtrl);

			_export('DeviceDetailsCtrl', DeviceDetailsCtrl);

			_export('AddDeviceCtrl', AddDeviceCtrl);

			_export('ConfigCtrl', ConfigCtrl);
		}
	};
});
//# sourceMappingURL=module.js.map
