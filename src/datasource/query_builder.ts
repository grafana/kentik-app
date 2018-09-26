import _ from 'lodash';
import { unitList, filterFieldList } from './metric_def';

const KENTIK_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

function formatMetricAggs(unitDef) {
  let aggs = [
    {
      "name": "avg_both",
      "column": unitDef.field,
      "fn": "average",
      "raw": true, // Set to get timeseries data
      "sample_rate": 1
    },
    {
      "name": "p95th_both",
      "column": unitDef.field,
      "fn": "percentile",
      "rank": 95,
      "sample_rate": 1
    },
    {
      "name": "max_both",
      "column": unitDef.field,
      "fn": "max",
      "sample_rate": 1
    }
  ];

  return aggs;
}

function formatUniqueIpAggs(unitDef) {
  let aggs = [
    {
      "name": "avg_ips",
      "column": unitDef.field,
      "fn": "average",
      "raw": true,
      "sample_rate": 1
    },
    {
      "name": "p95th_ips",
      "column": unitDef.field,
      "fn": "percentile",
      "rank": 95,
      "sample_rate": 1
    },
    {
      "name": "max_ips",
      "column": unitDef.field,
      "fn": "max",
      "sample_rate": 1,
      "raw": true
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
    }
  ];

  return aggs;
}

function formatAggs(unitDef) {
  let aggs = [];
  if (unitDef.value === "unique_src_ip" ||
      unitDef.value === "unique_dst_ip") {
    aggs = formatUniqueIpAggs(unitDef);
  } else {
    aggs = formatMetricAggs(unitDef);
  }

  return aggs;
}

function formatFilters(kentikFilterGroups) {
  let filters_obj = {
    "connector": "All",
    "filterGroups": []
  };

  if (kentikFilterGroups.length) {
    filters_obj.filterGroups = kentikFilterGroups;
  }

  return filters_obj;
}

function buildTopXdataQuery(options) {
  let unitDef = _.find(unitList, { value: options.unit });
  let starting_time = options.range.from.utc().format(KENTIK_TIME_FORMAT);
  let ending_time = options.range.to.utc().format(KENTIK_TIME_FORMAT);

  let query = {
    "dimension": [options.metric],
    "metric": options.unit,
    "matrixBy": [],
    "cidr": 32,
    "cidr6": 128,
    "topx": "8", // Visualization depth (8 by default)
    "depth": 100,
    "fastData": "Auto",
    "lookback_seconds": 0,
    "time_format": "UTC",
    "starting_time": starting_time,
    "ending_time": ending_time,
    "device_name": options.deviceNames,
    "outsort": unitDef.outsort,
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
  let filterField;
  let filterFieldDef = _.find(filterFieldList, { text: filterObj.key });
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
    let kentikFilters = _.map(filters, convertToKentikFilter);
    let connector = 'All';
    if (filters[0].condition && (
      filters[0].condition.toLowerCase() === 'or' ||
      filters[0].condition.toLowerCase() === 'any')) {
      connector = 'Any';
    }
    return [{
      "connector": connector,
      "filters": kentikFilters,
      "not": false,
    }];
  } else {
    return [];
  }
}

export default {
  buildTopXdataQuery: buildTopXdataQuery,
  formatAggs: formatAggs,
  convertToKentikFilterGroup: convertToKentikFilterGroup
};
