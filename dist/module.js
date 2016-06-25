'use strict';

System.register(['./config/config.js', './components/enter_stats', 'app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var ConfigCtrl, EnterStatsCtrl, loadPluginCss;
  return {
    setters: [function (_configConfigJs) {
      ConfigCtrl = _configConfigJs.ConfigCtrl;
    }, function (_componentsEnter_stats) {
      EnterStatsCtrl = _componentsEnter_stats.EnterStatsCtrl;
    }, function (_appPluginsSdk) {
      loadPluginCss = _appPluginsSdk.loadPluginCss;
    }],
    execute: function () {

      loadPluginCss({
        dark: 'plugins/grafana-pool-app/css/pool.dark.css',
        light: 'plugins/grafana-pool-app/css/pool.light.css'
      });

      _export('EnterStatsCtrl', EnterStatsCtrl);

      _export('ConfigCtrl', ConfigCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
