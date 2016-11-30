import angular from 'angular';
import _ from 'lodash';
import {unitList} from './metric_def';

class KentikAPI {
  constructor(backendSrv) {
    this.backendSrv = backendSrv;
    this.baseUrl = 'api/plugin-proxy/kentik-app';
  }

  getDevices() {
    return this._get('/api/v5/devices')
    .then(response => {
      if (response.data && response.data.devices) {
        return response.data.devices;
      } else {
        return [];
      }
    });
  }

  formatQuery(options) {
    var unitDef = _.find(unitList, {value: options.unit});
    let query = {
      "queries": [
        {
          "query": {
            "dimension": [
              options.metric
            ],
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
        }
      ]
    };

    // Add aggregates
    let aggs = [];
    if (unitDef.field === "f_countdistinct_ipv4_src_addr" ||
        unitDef.field === "f_countdistinct_ipv4_dst_addr") {
      aggs = [
      {
        "name": unitDef.field,
        "column": unitDef.field,
        "fn": "max",
        "properName": "Max",
        "sortable": true,
        "raw": true,
        "sample_rate": 1
      },
      {
        "name": "p95th_bits_per_sec",
        "column": "f_sum_both_bytes",
        "fn": "percentile",
        "rank": 95,
        "sample_rate": 1
      },
      {
        "name": "p95th_pkts_per_sec",
        "column": "f_sum_both_pkts",
        "fn": "percentile",
        "rank": 95,
        "sample_rate": 1
      }];
    } else {
      aggs = [
      {
        "name": unitDef.field, // avg_bits_per_sec
        "column": unitDef.field,
        "fn": "average",
        "properName": "Average",
        "raw": true, // Set to get timeseries data
        "sortable": true,
        "sample_rate": 1
      },
      {
        "name": "p95th_both",
        "column": unitDef.field,
        "fn": "percentile",
        "rank": 95,
        "properName": "95th Percentile",
        "sortable": true,
        "sample_rate": 1
      },
      {
        "name": "max_both",
        "column": unitDef.field,
        "fn": "max",
        "properName": "Max",
        "sortable": true,
        "raw": true,
        "sample_rate": 1
      }];
    }
    query.queries[0].query.aggregates.push(...aggs);

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

  invokeQuery(query) {
    return this._post('/api/v5/query/topXdata', query);
  }

  _get(url) {
    return this.backendSrv.datasourceRequest({
      method: 'GET',
      url: this.baseUrl + url,
    });
  }

  _post(url, data) {
    return this.backendSrv.datasourceRequest({
      method: 'POST',
      url: this.baseUrl + url,
      data: data
    });
  }
}

angular
  .module('grafana.services')
  .service('kentikAPISrv', KentikAPI);
