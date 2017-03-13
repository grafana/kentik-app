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
    let unitDef = _.find(unitList, {value: options.unit});
    let query = {
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
      "aggregates": this.formatAggs(unitDef),
      "filter_string": "",
      "filters_obj": this.formatFilters(options.kentikFilterGroups)
    };

    return query;
  }

  formatAggs(unitDef) {
    let aggs = [];
    if (unitDef.field === "f_countdistinct_inet_src_addr" ||
        unitDef.field === "f_countdistinct_inet_dst_addr") {
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
    return aggs;
  }

  formatFilters(kentikFilterGroups) {
    let filters_obj = {};
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

  getFieldValues(field) {
    let query = `SELECT DISTINCT ${field} FROM all_devices ORDER BY ${field} ASC`;
    return this.invokeSQLQuery(query);
  }

  invokeQuery(query) {
    let kentik_v5_query = {
      "queries": [
        {
          "query": query,
          "bucketIndex": 0,
          "isOverlay": false
        }
      ]
    };

    return this._post('/api/v5/query/topXdata', kentik_v5_query);
  }

  invokeSQLQuery(query) {
    let data = {
      "query": query
    };

    return this._post('/api/v5/query/sql', data);
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
    })
    .then(response => {
      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    });
  }
}

angular
  .module('grafana.services')
  .service('kentikAPISrv', KentikAPI);
