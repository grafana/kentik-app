'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _metric_def = require('./metric_def');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatAggs(unitDef) {
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

function formatFilters(kentikFilterGroups) {
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

function buildTopXdataQuery(options) {
  var unitDef = _lodash2.default.find(_metric_def.unitList, { value: options.unit });
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
    "aggregates": formatAggs(unitDef),
    "filters_obj": formatFilters(options.kentikFilterGroups)
  };

  return query;
}

function convertToKentikFilter(filterObj) {
  // Use Kentik 'not equal' style
  if (filterObj.operator === '!=') {
    filterObj.operator = '<>';
  }

  // If no field definition found assume that custom field is used.
  var filterField = void 0;
  var filterFieldDef = _lodash2.default.find(_metric_def.filterFieldList, { text: filterObj.key });
  if (filterFieldDef) {
    filterField = filterFieldDef.field;
  } else {
    filterField = filterObj.key;
  }

  return {
    filterField: filterField,
    operator: filterObj.operator,
    filterValue: filterObj.value
  };
}

function convertToKentikFilterGroup(filters) {
  if (filters.length) {
    var kentikFilters = _lodash2.default.map(filters, convertToKentikFilter);
    var connector = 'All';
    if (filters[0].condition && (filters[0].condition.toLowerCase() === 'or' || filters[0].condition.toLowerCase() === 'any')) {
      connector = 'Any';
    }
    return [{
      "connector": connector,
      "filters": kentikFilters,
      "not": false
    }];
  } else {
    return [];
  }
}

exports.default = {
  buildTopXdataQuery: buildTopXdataQuery,
  formatAggs: formatAggs,
  convertToKentikFilterGroup: convertToKentikFilterGroup
};
