'use strict';

System.register(['./metric_list', 'lodash'], function (_export, _context) {
  var metricList, _, _createClass, KentikDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_metric_list) {
      metricList = _metric_list.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }],
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
        function KentikDatasource(instanceSettings, backendSrv, templateSrv) {
          _classCallCheck(this, KentikDatasource);

          this.instanceSettings = instanceSettings;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
        }

        _createClass(KentikDatasource, [{
          key: 'interpolateDeviceField',
          value: function interpolateDeviceField(value, variable) {
            // if no multi or include all do not regexEscape
            if (!variable.multi && !variable.includeAll) {
              return value;
            }

            if (typeof value === 'string') {
              return value;
            }

            return value.join(',');
          }
        }, {
          key: 'query',
          value: function query(options) {
            if (!options.targets || options.targets.length === 0) {
              return Promise.resolve({ data: [] });
            }

            var target = options.targets[0];
            var deviceNames = this.templateSrv.replace(target.device, options.scopedVars, this.interpolateDeviceField.bind(this));

            var query = {
              version: "2.01",
              query: {
                device_name: deviceNames,
                time_type: 'fixed', // or fixed
                lookback_seconds: 3600,
                starting_time: options.range.from.utc().format("YYYY-MM-DD HH:mm:ss"),
                ending_time: options.range.to.utc().format("YYYY-MM-DD HH:mm:ss"),
                metric: this.templateSrv.replace(target.metric),
                fast_data: "Auto" },
              // or Fast or Full
              // device_type: 'router', // or host,
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
            }).then(this.processResponse.bind(this, query));
          }
        }, {
          key: 'processResponse',
          value: function processResponse(query, data) {
            if (!data.data) {
              return Promise.reject({ message: 'no kentik data' });
            }

            var rows = data.data;
            if (rows.length === 0) {
              return [];
            }

            var seriesList = {};
            var metricDef = _.findWhere(metricList, { value: query.query.metric });

            for (var i = 0; i < rows.length; i++) {
              var row = rows[i];
              var value = row.f_sum_both_bytes;
              var seriesName = row[metricDef.field];
              var series = seriesList[seriesName];
              if (!series) {
                series = seriesList[seriesName] = {
                  target: seriesName,
                  datapoints: []
                };
              }

              var time = new Date(row.i_start_time).getTime();
              series.datapoints.push([value, time]);
            }

            return {
              data: _.map(seriesList, function (value) {
                return value;
              })
            };
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(query) {
            if (query === 'metrics()') {
              return Promise.resolve(metricList);
            }

            return this.backendSrv.datasourceRequest({
              method: 'GET',
              url: 'api/plugin-proxy/kentik-app/api/v1/device/list'
            }).then(function (res) {
              if (!res.data || !res.data.device) {
                return [];
              }

              return res.data.device.map(function (device) {
                return { text: device.device_name, value: device.device_name };
              });
            });
          }
        }]);

        return KentikDatasource;
      }());

      _export('KentikDatasource', KentikDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
