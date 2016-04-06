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
            // var query = options.targets[0].target;
            // query = query.replace('$timeFilter', this.getTimeFilter(options.range));
            var query = {
              version: "2.01",
              query: {
                device_name: 'nntp2a',
                time_type: 'relative', // or fixed
                lookback_seconds: 3600,
                starting_time: null,
                ending_time: null,
                metric: "Traffic",
                fast_data: "Auto", // or Fast or Full
                device_type: 'router' },
              // or host,
              filterSettings: {
                connector: 'All',
                filterString: '',
                filterGroups: []
              }
            };
            console.log('Kentik query: ', query);

            return this.backendSrv.datasourceRequest({
              method: 'POST',
              url: 'api/plugin-proxy/kentik-app/api/v4/dataExplorer/timeSeriesData',
              data: query
            }).then(this.processResponse.bind(this));
          }
        }, {
          key: 'processResponse',
          value: function processResponse(data) {
            if (!data.data) {
              return this.$q.reject({ message: 'no kentik data' });
            }

            var rows = data.data;
            if (rows.length === 0) {
              return [];
            }

            var seriesList = [];
            var series = { target: 'traffic', datapoints: [] };

            for (var i = 0; i < rows.length; i++) {
              var row = rows[i];
              var value = row.f_sum_both_bytes;
              var time = new Date(row.i_start_time).getTime();
              series.datapoints.push([value, time]);
            }

            seriesList.push(series);
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
