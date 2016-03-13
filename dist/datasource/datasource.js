'use strict';

System.register([], function (_export, _context) {
  var _createClass, KentikDatasource;

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

      _export('KentikDatasource', KentikDatasource = function () {
        function KentikDatasource(instanceSettings, backendSrv, $q) {
          _classCallCheck(this, KentikDatasource);

          this.instanceSettings = instanceSettings;
          this.backendSrv = backendSrv;
          this.$q = $q;
        }

        _createClass(KentikDatasource, [{
          key: 'getTimeFilter',
          value: function getTimeFilter(range) {
            var timeFilter = 'ctimestamp > ' + (range.from.valueOf() / 1000).toFixed(0);
            timeFilter += ' OR ctimestamp < ' + (range.to.valueOf() / 1000).toFixed(0);
            return timeFilter;
          }
        }, {
          key: 'query',
          value: function query(options) {
            var query = options.targets[0].target;
            query = query.replace('$timeFilter', this.getTimeFilter(options.range));

            console.log('Kentik query: ', query);
            return this.backendSrv.datasourceRequest({
              method: 'POST',
              url: 'api/plugin-proxy/kentik-app/api/query',
              data: { q: query }
            }).then(this.processResponse.bind(this));
          }
        }, {
          key: 'processResponse',
          value: function processResponse(data) {
            if (data.data && data.data.err) {
              return this.$q.reject({ message: data.data.err });
            }

            var rows = data.data.data;

            if (rows.length === 0) {
              return [];
            }

            var seriesList = [];
            var firstRow = rows[0];

            for (var prop in firstRow) {
              if (prop === 'ctimestamp') {
                continue;
              }

              if (firstRow.hasOwnProperty(prop)) {
                seriesList.push({ datapoints: [], target: prop });
              }
            }

            for (var i = 0; i < rows.length; i++) {
              var row = rows[i];
              for (var y = 0; y < seriesList.length; y++) {
                var serie = seriesList[y];
                var value = parseInt(row[serie.target]);
                var time = row.ctimestamp * 1000;
                serie.datapoints.push([value, time]);
                console.log('add value: ', value, time);
              }
            }

            return { data: seriesList };
          }
        }]);

        return KentikDatasource;
      }());

      _export('KentikDatasource', KentikDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
