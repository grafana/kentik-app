import './sass/kentik.dark.scss';
import './sass/kentik.light.scss';

import {ConfigCtrl} from './config/config';
import {DeviceListCtrl} from './components/device_list';
import {DeviceDetailsCtrl} from './components/device_details';
import {AddDeviceCtrl} from './components/add_device';
import {loadPluginCss} from 'grafana/app/plugins/sdk';

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
