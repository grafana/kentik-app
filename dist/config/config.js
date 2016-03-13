'use strict';

System.register(['./config.html!text'], function (_export, _context) {
  var configTemplate, KentikConfigCtrl;

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
      _export('ConfigCtrl', KentikConfigCtrl = function KentikConfigCtrl() {
        _classCallCheck(this, KentikConfigCtrl);

        this.appModel.secureJsonData = {
          token: '**********'
        };
      });

      KentikConfigCtrl.template = configTemplate;

      _export('ConfigCtrl', KentikConfigCtrl);
    }
  };
});
//# sourceMappingURL=config.js.map
