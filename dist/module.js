'use strict';

System.register(['./config/config.js', './components/home', './components/add_device', 'app/plugins/sdk'], function (_export, _context) {
	var ConfigCtrl, HomeCtrl, AddDeviceCtrl, loadPluginCss;
	return {
		setters: [function (_configConfigJs) {
			ConfigCtrl = _configConfigJs.ConfigCtrl;
		}, function (_componentsHome) {
			HomeCtrl = _componentsHome.HomeCtrl;
		}, function (_componentsAdd_device) {
			AddDeviceCtrl = _componentsAdd_device.AddDeviceCtrl;
		}, function (_appPluginsSdk) {
			loadPluginCss = _appPluginsSdk.loadPluginCss;
		}],
		execute: function () {

			loadPluginCss({
				dark: 'plugins/kentik-app/css/dark.css',
				light: 'plugins/kentik-app/css/light.css'
			});

			_export('HomeCtrl', HomeCtrl);

			_export('AddDeviceCtrl', AddDeviceCtrl);

			_export('ConfigCtrl', ConfigCtrl);
		}
	};
});
//# sourceMappingURL=module.js.map
