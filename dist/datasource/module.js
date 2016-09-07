'use strict';

System.register(['./datasource', './config', './query_editor'], function (_export, _context) {
  "use strict";

  var KentikDatasource, ConfigCtrl, KentikQueryCtrl;
  return {
    setters: [function (_datasource) {
      KentikDatasource = _datasource.KentikDatasource;
    }, function (_config) {
      ConfigCtrl = _config.ConfigCtrl;
    }, function (_query_editor) {
      KentikQueryCtrl = _query_editor.KentikQueryCtrl;
    }],
    execute: function () {
      _export('Datasource', KentikDatasource);

      _export('ConfigCtrl', ConfigCtrl);

      _export('QueryCtrl', KentikQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
