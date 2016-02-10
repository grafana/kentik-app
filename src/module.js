
import {ConfigCtrl} from './config/config.js';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/kentik-app/css/dark.css',
  light: 'plugins/kentik-app/css/light.css'
});

export {ConfigCtrl};
