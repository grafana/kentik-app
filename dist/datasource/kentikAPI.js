'use strict';

System.register(['angular', 'lodash', './metric_def'], function (_export, _context) {
  "use strict";

  var angular, _, unitList, _createClass, KentikAPI;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_metric_def) {
      unitList = _metric_def.unitList;
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

      KentikAPI = function () {
        function KentikAPI(backendSrv) {
          _classCallCheck(this, KentikAPI);

          this.backendSrv = backendSrv;
          this.baseUrl = 'api/plugin-proxy/kentik-app';
        }

        _createClass(KentikAPI, [{
          key: 'getDevices',
          value: function getDevices() {
            return this._get('/api/v5/devices').then(function (response) {
              if (response.data && response.data.devices) {
                return response.data.devices;
              } else {
                return [];
              }
            });
          }
        }, {
          key: 'formatQuery',
          value: function formatQuery(options) {
            var unitDef = _.find(unitList, { value: options.unit });
            var query = {
              "dimension": [options.metric],
              "metric": options.unit,
              "matrixBy": [],
              "cidr": 32,
              "cidr6": 128,
              "topx": 8, // Visualization depth (8 by default)
              "depth": 100,
              "fastData": "Auto",
              "lookback_seconds": 0,
              "time_format": "UTC",
              "starting_time": options.range.from.utc().format("YYYY-MM-DD HH:mm:ss"),
              "ending_time": options.range.to.utc().format("YYYY-MM-DD HH:mm:ss"),
              "device_name": options.deviceNames,
              "bucket": "",
              "bucketIndex": -1,
              "outsort": unitDef.field,
              "aggregates": this.formatAggs(unitDef),
              "filters_obj": this.formatFilters(options.kentikFilterGroups)
            };

            return query;
          }
        }, {
          key: 'formatAggs',
          value: function formatAggs(unitDef) {
            var aggs = [];
            if (unitDef.field === "f_countdistinct_inet_src_addr" || unitDef.field === "f_countdistinct_inet_dst_addr") {
              aggs = [{
                "name": unitDef.field,
                "column": unitDef.field,
                "fn": "max",
                "properName": "Max",
                "sortable": true,
                "raw": true,
                "sample_rate": 1
              }, {
                "name": "p95th_bits_per_sec",
                "column": "f_sum_both_bytes",
                "fn": "percentile",
                "rank": 95,
                "sample_rate": 1
              }, {
                "name": "p95th_pkts_per_sec",
                "column": "f_sum_both_pkts",
                "fn": "percentile",
                "rank": 95,
                "sample_rate": 1
              }];
            } else {
              aggs = [{
                "name": unitDef.field, // avg_bits_per_sec
                "column": unitDef.field,
                "fn": "average",
                "properName": "Average",
                "raw": true, // Set to get timeseries data
                "sortable": true,
                "sample_rate": 1
              }, {
                "name": "p95th_both",
                "column": unitDef.field,
                "fn": "percentile",
                "rank": 95,
                "properName": "95th Percentile",
                "sortable": true,
                "sample_rate": 1
              }, {
                "name": "max_both",
                "column": unitDef.field,
                "fn": "max",
                "properName": "Max",
                "sortable": true,
                "raw": true,
                "sample_rate": 1
              }];
            }
            return aggs;
          }
        }, {
          key: 'formatFilters',
          value: function formatFilters(kentikFilterGroups) {
            var filters_obj = {};
            if (kentikFilterGroups.length) {
              filters_obj = {
                "connector": "All",
                "custom": false,
                "filterGroups": kentikFilterGroups,
                "filterString": ""
              };
            }

            return filters_obj;
          }
        }, {
          key: 'getFieldValues',
          value: function getFieldValues(field) {
            var query = 'SELECT DISTINCT ' + field + ' FROM all_devices ORDER BY ' + field + ' ASC';
            return this.invokeSQLQuery(query);
          }
        }, {
          key: 'invokeQuery',
          value: function invokeQuery(query) {
            var kentik_v5_query = {
              "queries": [{
                "query": query,
                "bucketIndex": 0,
                "isOverlay": false
              }]
            };

            return this._post('/api/v5/query/topXdata', kentik_v5_query);
          }
        }, {
          key: 'invokeSQLQuery',
          value: function invokeSQLQuery(query) {
            var data = {
              "query": query
            };

            return this._post('/api/v5/query/sql', data);
          }
        }, {
          key: '_get',
          value: function _get(url) {
            return this.backendSrv.datasourceRequest({
              method: 'GET',
              url: this.baseUrl + url
            });
          }
        }, {
          key: '_post',
          value: function _post(url, data) {
            return this.backendSrv.datasourceRequest({
              method: 'POST',
              url: this.baseUrl + url,
              data: data
            }).then(function (response) {
              if (response.data) {
                return response.data;
              } else {
                return [];
              }
            });
          }
        }]);

        return KentikAPI;
      }();

      angular.module('grafana.services').service('kentikAPISrv', KentikAPI);
    }
  };
});
//# sourceMappingURL=kentikAPI.js.map
