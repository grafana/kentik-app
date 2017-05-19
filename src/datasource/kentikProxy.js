import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import './kentikAPI';

function getUTCTimestamp() {
  let ts = new Date();
  return ts.getTime() + ts.getTimezoneOffset() * 60 * 1000;
}

// Get hash of Kentik query
function getHash(queryObj) {
  let query = _.cloneDeep(queryObj);
  query.starting_time = null;
  query.ending_time = null;
  return JSON.stringify(query);
}

// Prevent too frequent queries
function getMaxRefreshInterval(query) {
  let interval = Date.parse(query.ending_time) - Date.parse(query.starting_time);
  if (interval > moment.duration(1, 'months')) {
    return 60 * 60 * 1000; // 1 hour
  } else if (interval > moment.duration(1, 'day')) {
    return 15 * 60 * 1000; // 15 min
  } else {
    return 5 * 60 * 1000; // 5 min
  }
}

class KentikProxy {
  constructor(backendSrv, kentikAPISrv) {
    this.kentikAPI = kentikAPISrv;
    this.cache = {};
    this.cacheUpdateInterval = 5 * 60 * 1000; // 5 min by default
    this.requestCachingIntervals = {
      '1d': 0
    };

    this.getDevices = this.kentikAPI.getDevices.bind(this.kentikAPI);
  }

  invokeTopXDataQuery(query) {
    let cached_query = _.cloneDeep(query);
    let hash = getHash(cached_query);

    if (this.shouldInvoke(query)) {
      // Invoke query
      return this.kentikAPI.invokeTopXDataQuery(query)
      .then(result => {
        let timestamp = getUTCTimestamp();

        this.cache[hash] = {
          timestamp: timestamp,
          query: cached_query,
          result: result
        };
        console.log('Invoke Kentik query');
        return result;
      });
    } else {
      // Get from cache
      console.log('Get result from cache');
      return Promise.resolve(this.cache[hash].result);
    }
  }

  // Decide, is query shold be invoked or get data from cahce?
  shouldInvoke(query) {
    let kentik_query = query;
    let hash = getHash(kentik_query);
    let timestamp = getUTCTimestamp();

    let starting_time = Date.parse(kentik_query.starting_time);
    let ending_time = Date.parse(kentik_query.ending_time);
    let query_range = ending_time - starting_time;

    let cache_starting_time = this.cache[hash] ? Date.parse(this.cache[hash].query.starting_time) : null;
    let cache_ending_time = this.cache[hash] ? Date.parse(this.cache[hash].query.ending_time) : null;
    let cached_query_range = cache_ending_time - cache_starting_time;

    let max_refresh_interval = getMaxRefreshInterval(kentik_query);

    return (
      !this.cache[hash] ||
      timestamp - ending_time > max_refresh_interval ||
      (this.cache[hash] && (
        timestamp - cache_ending_time > max_refresh_interval ||
        starting_time < cache_starting_time ||
        Math.abs(query_range - cached_query_range) > 60 * 1000 // is time range changed?
      ))
    );
  }

  getFieldValues(field) {
    let ts = getUTCTimestamp();
    if (this.cache[field] && ts - this.cache[field].ts < this.cacheUpdateInterval) {
      return Promise.resolve(this.cache[field].value);
    } else {
      return this.kentikAPI.getFieldValues(field)
      .then(result => {
        ts = getUTCTimestamp();
        this.cache[field] = {
          ts: ts,
          value: result
        };

        return result;
      });
    }
  }
}

angular
  .module('grafana.services')
  .service('kentikProxySrv', KentikProxy);
