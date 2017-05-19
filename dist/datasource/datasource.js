'use strict';

System.register(['./metric_def', 'lodash', 'app/core/table_model', './kentikProxy', './query_builder'], function (_export, _context) {
  "use strict";

  var metricList, unitList, filterFieldList, _, TableModel, queryBuilder, _createClass, KentikDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_metric_def) {
      metricList = _metric_def.metricList;
      unitList = _metric_def.unitList;
      filterFieldList = _metric_def.filterFieldList;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreTable_model) {
      TableModel = _appCoreTable_model.default;
    }, function (_kentikProxy) {}, function (_query_builder) {
      queryBuilder = _query_builder.default;
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
        function KentikDatasource(instanceSettings, templateSrv, kentikProxySrv) {
          _classCallCheck(this, KentikDatasource);

          this.instanceSettings = instanceSettings;
          this.name = instanceSettings.name;
          this.templateSrv = templateSrv;
          this.kentik = kentikProxySrv;
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

            var kentikFilters = this.templateSrv.getAdhocFilters(this.name);
            kentikFilters = queryBuilder.convertToKentikFilterGroup(kentikFilters);

            var query_options = {
              deviceNames: deviceNames,
              range: {
                from: options.range.from,
                to: options.range.to
              },
              metric: this.templateSrv.replace(target.metric),
              unit: this.templateSrv.replace(target.unit),
              kentikFilterGroups: kentikFilters
            };
            var query = queryBuilder.buildTopXdataQuery(query_options);

            return this.kentik.invokeTopXDataQuery(query).then(this.processResponse.bind(this, query, target.mode, options)).then(function (result) {
              return {
                data: result
              };
            });
          }
        }, {
          key: 'processResponse',
          value: function processResponse(query, mode, options, data) {
            if (!data.results) {
              return Promise.reject({ message: 'no kentik data' });
            }

            var bucketData = data.results[0].data;
            if (bucketData.length === 0) {
              return [];
            }

            var metricDef = _.find(metricList, { value: query.dimension[0] });
            var unitDef = _.find(unitList, { value: query.metric });

            if (mode === 'table') {
              return this.processTableData(bucketData, metricDef, unitDef);
            } else {
              return this.processTimeSeries(bucketData, query, options);
            }
          }
        }, {
          key: 'processTimeSeries',
          value: function processTimeSeries(bucketData, query) {
            var seriesList = [];
            var endIndex = query.topx;
            if (bucketData.length < endIndex) {
              endIndex = bucketData.length;
            }

            for (var i = 0; i < endIndex; i++) {
              var series = bucketData[i];
              var timeseries = _.find(series.timeSeries, function (series) {
                return series.flow && series.flow.length;
              });
              var seriesName = series.key;

              if (timeseries) {
                var grafana_series = {
                  target: seriesName,
                  datapoints: _.map(timeseries.flow, function (point) {
                    return [point[1], point[0]];
                  })
                };
                seriesList.push(grafana_series);
              }
            }

            return seriesList;
          }
        }, {
          key: 'processTableData',
          value: function processTableData(bucketData, metricDef, unitDef) {
            var table = new TableModel();

            table.columns.push({ text: metricDef.text });

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = unitDef.tableFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var col = _step.value;

                table.columns.push({ text: col.text, unit: col.unit });
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            _.forEach(bucketData, function (row) {
              var seriesName = row.key;

              var values = [seriesName];
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = unitDef.tableFields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var col = _step2.value;

                  var val = row[col.field];

                  if (_.isString(val)) {
                    val = parseFloat(val);
                  }

                  values.push(val);
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }

              table.rows.push(values);
            });

            return [table];
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(query) {
            if (query === 'metrics()') {
              return Promise.resolve(metricList);
            }
            if (query === 'units()') {
              return Promise.resolve(unitList);
            }

            return this.kentik.getDevices().then(function (devices) {
              return devices.map(function (device) {
                return { text: device.device_name, value: device.device_name };
              });
            });
          }
        }, {
          key: 'getTagKeys',
          value: function getTagKeys() {
            return Promise.resolve(filterFieldList);
          }
        }, {
          key: 'getTagValues',
          value: function getTagValues(options) {
            if (options) {
              var field = _.find(filterFieldList, { text: options.key }).field;
              return this.kentik.getFieldValues(field).then(function (result) {
                return result.rows.map(function (row) {
                  return { text: row[field].toString() };
                });
              });
            } else {
              return Promise.resolve([]);
            }
          }
        }]);

        return KentikDatasource;
      }());

      _export('KentikDatasource', KentikDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
