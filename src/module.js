
import {ConfigCtrl} from './config/config.js';
import {DeviceListCtrl} from './components/device_list';
import {DeviceDetailsCtrl} from './components/device_details';
import {AddDeviceCtrl} from './components/add_device';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/kentik-app/css/kentik.dark.css',
  light: 'plugins/kentik-app/css/kentik.light.css'
});

export {
	DeviceListCtrl,
	DeviceDetailsCtrl,
	AddDeviceCtrl,
	ConfigCtrl
};
