'use strict';

System.register(['lodash', './metric_def'], function (_export, _context) {
  "use strict";

  var _, unitList, filterFieldList;

  function formatMetricAggs(unitDef) {
    var aggs = [{
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

    return aggs;
  }

  function formatUniqueIpAggs(unitDef) {
    var aggs = [{
      "name": "avg_ips",
      "column": unitDef.field,
      "fn": "average",
      "raw": true,
      "sample_rate": 1
    }, {
      "name": "p95th_ips",
      "column": unitDef.field,
      "fn": "percentile",
      "rank": 95,
      "sample_rate": 1
    }, {
      "name": unitDef.field,
      "column": unitDef.field,
      "fn": "max",
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

    return aggs;
  }

  function formatAggs(unitDef) {
    var aggs = [];
    if (unitDef.value === "unique_src_ip" || unitDef.value === "unique_dst_ip") {
      aggs = formatUniqueIpAggs(unitDef);
    } else {
      aggs = formatMetricAggs(unitDef);
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
    var filterFieldDef = _.find(filterFieldList, { text: filterObj.key });
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
      var kentikFilters = _.map(filters, convertToKentikFilter);
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

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_metric_def) {
      unitList = _metric_def.unitList;
      filterFieldList = _metric_def.filterFieldList;
    }],
    execute: function () {
      _export('default', {
        buildTopXdataQuery: buildTopXdataQuery,
        formatAggs: formatAggs,
        convertToKentikFilterGroup: convertToKentikFilterGroup
      });
    }
  };
});
//# sourceMappingURL=query_builder.js.map