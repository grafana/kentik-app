
import {ConfigCtrl} from './config/config.js';
import {HomeCtrl} from './components/home';
//import {KentikDeviceAddCtrl} from './components/device';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/kentik-app/css/dark.css',
  light: 'plugins/kentik-app/css/light.css'
});

export {
	HomeCtrl,
	//KentikDeviceAddCtrl,
	ConfigCtrl
};

