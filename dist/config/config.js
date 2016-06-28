'use strict';

System.register(['./config.html!text'], function (_export, _context) {
  "use strict";

  var configTemplate, PoolConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_configHtmlText) {
      configTemplate = _configHtmlText.default;
    }],
    execute: function () {
      _export('ConfigCtrl', PoolConfigCtrl = function PoolConfigCtrl() {
        _classCallCheck(this, PoolConfigCtrl);
      });

      PoolConfigCtrl.template = configTemplate;

      _export('ConfigCtrl', PoolConfigCtrl);
    }
  };
});
//# sourceMappingURL=config.js.map
