'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KentikDatasource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _metric_def = require('./metric_def');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _table_model = require('app/core/table_model');

var _table_model2 = _interopRequireDefault(_table_model);

require('./kentikProxy');

var _query_builder = require('./query_builder');

var _query_builder2 = _interopRequireDefault(_query_builder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KentikDatasource = function () {
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
      kentikFilters = _query_builder2.default.convertToKentikFilterGroup(kentikFilters);

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
      var query = _query_builder2.default.buildTopXdataQuery(query_options);

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

      var metricDef = _lodash2.default.find(_metric_def.metricList, { value: query.dimension[0] });
      var unitDef = _lodash2.default.find(_metric_def.unitList, { value: query.metric });

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
        var timeseries = _lodash2.default.find(series.timeSeries, function (series) {
          return series.flow && series.flow.length;
        });
        var seriesName = series.key;

        if (timeseries) {
          var grafana_series = {
            target: seriesName,
            datapoints: _lodash2.default.map(timeseries.flow, function (point) {
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
      var table = new _table_model2.default();

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

      _lodash2.default.forEach(bucketData, function (row) {
        var seriesName = row.key;

        var values = [seriesName];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = unitDef.tableFields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var col = _step2.value;

            var val = row[col.field];

            if (_lodash2.default.isString(val)) {
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
        return Promise.resolve(_metric_def.metricList);
      }
      if (query === 'units()') {
        return Promise.resolve(_metric_def.unitList);
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
      return Promise.resolve(_metric_def.filterFieldList);
    }
  }, {
    key: 'getTagValues',
    value: function getTagValues(options) {
      if (options) {
        var field = _lodash2.default.find(_metric_def.filterFieldList, { text: options.key }).field;
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
}();

exports.KentikDatasource = KentikDatasource;
