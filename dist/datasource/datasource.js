'use strict';

System.register(['./metric_def', 'lodash', 'app/core/table_model', './kentikAPI'], function (_export, _context) {
  "use strict";

  var metricList, unitList, filterFieldList, _, TableModel, _createClass, KentikDatasource;

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
    }, function (_kentikAPI) {}],
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
        function KentikDatasource(instanceSettings, templateSrv, kentikAPISrv) {
          _classCallCheck(this, KentikDatasource);

          this.instanceSettings = instanceSettings;
          this.name = instanceSettings.name;
          this.templateSrv = templateSrv;
          this.kentik = kentikAPISrv;
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
          key: 'convertToKentikFilter',
          value: function convertToKentikFilter(filterObj) {
            return {
              filterField: _.find(filterFieldList, { text: filterObj.key }).field,
              operator: filterObj.operator,
              filterValue: filterObj.value
            };
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
            kentikFilters = _.map(kentikFilters, this.convertToKentikFilter);

            var query_options = {
              deviceNames: deviceNames,
              range: {
                from: options.range.from,
                to: options.range.to
              },
              metric: this.templateSrv.replace(target.metric),
              unit: this.templateSrv.replace(target.unit),
              kentikFilters: kentikFilters
            };
            var query = this.kentik.formatV4Query(query_options);
            query = this.kentik.formatV5Query(query_options);

            var endpoint = 'timeSeriesData';
            endpoint = 'topXdata';
            if (target.mode === 'table') {
              endpoint = 'topXdata';
            }

            return this.kentik.invokeV5Query(query, endpoint).then(this.processV5Response.bind(this, query, target.mode, options));
          }
        }, {
          key: 'processResponse',
          value: function processResponse(query, endpoint, options, data) {
            if (!data.data) {
              return Promise.reject({ message: 'no kentik data' });
            }

            var rows = data.data;
            if (rows.length === 0) {
              return [];
            }

            var metricDef = _.find(metricList, { value: query.query.metric });
            var unitDef = _.find(unitList, { value: query.query.units });

            if (endpoint === 'topXData') {
              return this.processTopXData(rows, metricDef, unitDef, options);
            } else {
              return this.processTimeSeries(rows, metricDef, unitDef, options);
            }
          }
        }, {
          key: 'processV5Response',
          value: function processV5Response(query, mode, options, data) {
            if (!data.data.results) {
              return Promise.reject({ message: 'no kentik data' });
            }

            var bucketData = data.data.results[0].data;
            if (bucketData.length === 0) {
              return [];
            }

            var metricDef = _.find(metricList, { value: query.queries[0].query.dimension[0] });
            var unitDef = _.find(unitList, { value: query.queries[0].query.metric });

            if (mode === 'table') {
              return this.processTableData(bucketData, metricDef, unitDef);
            } else {
              return this.processV5TimeSeries(bucketData, query, options);
            }
          }
        }, {
          key: 'processV5TimeSeries',
          value: function processV5TimeSeries(bucketData, query) {
            var seriesList = [];
            var endIndex = query.queries[0].query.topx;
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
                  datapoints: timeseries.flow.map(function (point) {
                    return [point[1], point[0]];
                  })
                };
                seriesList.push(grafana_series);
              }
            }

            return { data: seriesList };
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

            bucketData.forEach(function (row) {
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

            return { data: [table] };
          }
        }, {
          key: 'processTimeSeries',
          value: function processTimeSeries(rows, metricDef, unitDef, options) {
            var seriesList = {};
            var endIndex = rows.length;

            // if time range is to now ignore last data point
            if (options.rangeRaw.to === 'now') {
              endIndex = endIndex - 1;
            }

            for (var i = 0; i < endIndex; i++) {
              var row = rows[i];
              var value = row[unitDef.field];
              var seriesName = row[metricDef.field];
              var series = seriesList[seriesName];

              if (!series) {
                series = seriesList[seriesName] = {
                  target: seriesName,
                  datapoints: [],
                  unit: unitDef.gfUnit,
                  axisLabel: unitDef.gfAxisLabel
                };
              }

              if (unitDef.transform) {
                value = unitDef.transform(value, row);
              }

              var time = new Date(row.i_start_time).getTime();
              series.datapoints.push([value, time]);
            }

            // turn seriesList hash to array
            return { data: _.map(seriesList, function (value) {
                return value;
              }) };
          }
        }, {
          key: 'processTopXData',
          value: function processTopXData(rows, metricDef, unitDef, options) {
            var table = new TableModel();
            var rangeSeconds = (options.range.to.valueOf() - options.range.from.valueOf()) / 1000;

            table.columns.push({ text: metricDef.text });

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = unitDef.tableFields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var col = _step3.value;

                table.columns.push({ text: col.text, unit: col.unit });
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = rows[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var row = _step4.value;

                var seriesName = row[metricDef.field];

                var values = [seriesName];
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                  for (var _iterator5 = unitDef.tableFields[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _col = _step5.value;

                    var val = row[_col.field];
                    var transform = _col.transform || unitDef.transform;

                    if (_.isString(val)) {
                      val = parseFloat(val);
                    }

                    if (transform) {
                      val = transform(val, row, rangeSeconds);
                    }

                    values.push(val);
                  }
                } catch (err) {
                  _didIteratorError5 = true;
                  _iteratorError5 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                      _iterator5.return();
                    }
                  } finally {
                    if (_didIteratorError5) {
                      throw _iteratorError5;
                    }
                  }
                }

                table.rows.push(values);
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            return { data: [table] };
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
              return Promise.resolve([]);
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
