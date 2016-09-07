import {PanelCtrl} from './panel_ctrl';
import {MetricsPanelCtrl} from './metrics_panel_ctrl';
import {QueryCtrl} from './query_ctrl';
import {alertTab} from './alert_tab_ctrl';

import config from 'app/core/config';

export function loadPluginCss(options) {
  if (config.bootData.user.lightTheme) {
    System.import(options.light + '!css');
  } else {
    System.import(options.dark + '!css');
  }
}

export {
  PanelCtrl,
  MetricsPanelCtrl,
  QueryCtrl,
  alertTab,
}
