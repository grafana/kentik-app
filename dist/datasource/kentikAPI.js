'use strict';

System.register(['angular', 'lodash', './metric_def'], function (_export, _context) {
  "use strict";

  var angular, _, unitList, _createClass, KentikAPI;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

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
            var _query$queries$0$quer;

            var unitDef = _.find(unitList, { value: options.unit });
            var query = {
              "queries": [{
                "query": {
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
                  starting_time: options.range.from.utc().format("YYYY-MM-DD HH:mm:ss"),
                  ending_time: options.range.to.utc().format("YYYY-MM-DD HH:mm:ss"),
                  "device_name": options.deviceNames,
                  "bucket": "",
                  "bucketIndex": -1,
                  "outsort": unitDef.field,
                  "aggregates": [],
                  "filter_string": "",
                  "filters_obj": {}
                },
                "bucketIndex": 0,
                "isOverlay": false
              }]
            };

            // Add aggregates
            var aggs = [];
            if (unitDef.field === "f_countdistinct_ipv4_src_addr" || unitDef.field === "f_countdistinct_ipv4_dst_addr") {
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
            (_query$queries$0$quer = query.queries[0].query.aggregates).push.apply(_query$queries$0$quer, _toConsumableArray(aggs));

            // Add filters
            if (options.kentikFilterGroups.length) {
              query.queries[0].query.filters_obj = {
                "connector": "All",
                "custom": false,
                "filterGroups": options.kentikFilterGroups,
                "filterString": ""
              };
            }

            return query;
          }
        }, {
          key: 'invokeQuery',
          value: function invokeQuery(query) {
            return this._post('/api/v5/query/topXdata', query);
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
