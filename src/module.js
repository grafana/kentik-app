
import {ConfigCtrl} from './config/config.js';
import {HomeCtrl} from './components/home';
import {AddDeviceCtrl} from './components/add_device';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/kentik-app/css/dark.css',
  light: 'plugins/kentik-app/css/light.css'
});

export {
	HomeCtrl,
	AddDeviceCtrl,
	ConfigCtrl
};

