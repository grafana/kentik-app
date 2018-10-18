import * as _ from 'lodash';
import { unitList, filterFieldList } from './metric_def';

const KENTIK_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

function formatMetricAggs(unitDef) {
  const aggs = [
    {
      name: 'avg_both',
      column: unitDef.field,
      fn: 'average',
      raw: true, // Set to get timeseries data
      sample_rate: 1,
    },
    {
      name: 'p95th_both',
      column: unitDef.field,
      fn: 'percentile',
      rank: 95,
      sample_rate: 1,
    },
    {
      name: 'max_both',
      column: unitDef.field,
      fn: 'max',
      sample_rate: 1,
    },
  ];

  return aggs;
}

function formatUniqueIpAggs(unitDef) {
  const aggs = [
    {
      name: 'avg_ips',
      column: unitDef.field,
      fn: 'average',
      raw: true,
      sample_rate: 1,
    },
    {
      name: 'p95th_ips',
      column: unitDef.field,
      fn: 'percentile',
      rank: 95,
      sample_rate: 1,
    },
    {
      name: 'max_ips',
      column: unitDef.field,
      fn: 'max',
      sample_rate: 1,
      raw: true,
    },
    {
      name: 'p95th_bits_per_sec',
      column: 'f_sum_both_bytes',
      fn: 'percentile',
      rank: 95,
      sample_rate: 1,
    },
    {
      name: 'p95th_pkts_per_sec',
      column: 'f_sum_both_pkts',
      fn: 'percentile',
      rank: 95,
      sample_rate: 1,
    },
  ];

  return aggs;
}

function formatAggs(unitDef) {
  let aggs = [];
  if (unitDef.value === 'unique_src_ip' || unitDef.value === 'unique_dst_ip') {
    aggs = formatUniqueIpAggs(unitDef);
  } else {
    aggs = formatMetricAggs(unitDef);
  }

  return aggs;
}

function formatFilters(kentikFilterGroups) {
  const filtersObj = {
    connector: 'All',
    filterGroups: [],
  };

  if (kentikFilterGroups.length) {
    filtersObj.filterGroups = kentikFilterGroups;
  }

  return filtersObj;
}

function buildTopXdataQuery(options) {
  const unitDef = _.find(unitList, { value: options.unit });
  const startingTime = options.range.from.utc().format(KENTIK_TIME_FORMAT);
  const endingTime = options.range.to.utc().format(KENTIK_TIME_FORMAT);

  const query = {
    dimension: [options.metric],
    metric: options.unit,
    matrixBy: [],
    cidr: 32,
    cidr6: 128,
    topx: '8', // Visualization depth (8 by default)
    depth: 100,
    fastData: 'Auto',
    lookback_seconds: 0,
    time_format: 'UTC',
    starting_time: startingTime,
    ending_time: endingTime,
    device_name: options.deviceNames,
    outsort: unitDef.outsort,
    aggregates: formatAggs(unitDef),
    filters_obj: formatFilters(options.kentikFilterGroups),
    saved_filters: options.kentikSavedFilters
  };

  return query;
}

function convertToKentikSavedFilter(filterObj, savedFilters: Array<any>) {
  const filter = _.find(savedFilters, { text: filterObj.key });

  if (filter !== undefined) {
    return {
      filter_id: filter.id,
      is_not: filterObj.value === 'exclude'
    }
  }

  return {};
}

function convertToKentikFilter(filterObj, customDimensions: Array<any>) {
  // Use Kentik 'not equal' style
  if (filterObj.operator === '!=') {
    filterObj.operator = '<>';
  }

  const filterFieldDefExtended = _.concat(filterFieldList, customDimensions);
  const filterFieldDef = _.find(filterFieldDefExtended, { text: filterObj.key });
  if (filterFieldDef) {
    return {
      filterField: filterFieldDef.field,
      operator: filterObj.operator,
      filterValue: filterObj.value,
    };
  }

  return {}; 
}

function convertToKentikFilterGroup(filters, customDimensions = []) {
  if (filters.length) {
    let kentikFilters = _.map(filters, filter => convertToKentikFilter(filter, customDimensions));
    if (_.filter(kentikFilters, !_.isEmpty).length === 0) {
      return [];
    }

    let connector = 'All';
    if (
      filters[0].condition &&
      (filters[0].condition.toLowerCase() === 'or' || filters[0].condition.toLowerCase() === 'any')
    ) {
      connector = 'Any';
    }
    return [
      {
        connector: connector,
        filters: kentikFilters,
        not: false,
      },
    ];
  } else {
    return [];
  }
}

function convertToKentikSavedFilters(filters, savedFilters) {
  if (filters.length > 0) {
    return _.map(filters, filter => convertToKentikSavedFilter(filter, savedFilters));
  }

  return [];
}

export default {
  buildTopXdataQuery,
  formatAggs,
  convertToKentikFilterGroup,
  convertToKentikSavedFilters,
};
