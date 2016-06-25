'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var _createClass, EnterStatsCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('EnterStatsCtrl', EnterStatsCtrl = function () {
        function EnterStatsCtrl(backendSrv) {
          _classCallCheck(this, EnterStatsCtrl);

          this.backendSrv = backendSrv;
        }

        _createClass(EnterStatsCtrl, [{
          key: 'record',
          value: function record(metric, value) {
            var data = { metrics: {} };
            data.metrics['pool.' + metric + '.count'] = value;

            return this.backendSrv.post("/api/plugin-proxy/grafana-pool-app/api/", data);
          }
        }]);

        return EnterStatsCtrl;
      }());

      _export('EnterStatsCtrl', EnterStatsCtrl);

      EnterStatsCtrl.templateUrl = 'components/enter_stats.html';
    }
  };
});
//# sourceMappingURL=enter_stats.js.map
