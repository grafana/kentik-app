
import {ConfigCtrl} from './config/config.js';
import {EnterStatsCtrl} from './components/enter_stats';
import {loadPluginCss} from 'app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/grafana-pool-app/css/pool.dark.css',
  light: 'plugins/grafana-pool-app/css/pool.light.css'
});

export {
	EnterStatsCtrl,
	ConfigCtrl
};
