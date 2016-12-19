import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import './kentikAPI';

function getUTCTimestamp() {
  let ts = new Date();
  return ts.getTime() + ts.getTimezoneOffset() * 60 * 1000;
}

function getHash(queryObj) {
  let query = _.cloneDeep(queryObj);
  query.starting_time = null;
  query.ending_time = null;
  return JSON.stringify(query);
}

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
    this.requestCachingIntervals = {
      '1d': 0
    };

    this.getDevices = this.kentikAPI.getDevices.bind(this.kentikAPI);
    this.formatQuery = this.kentikAPI.formatQuery.bind(this.kentikAPI);
    this.getFieldValues = this.kentikAPI.getFieldValues.bind(this.kentikAPI);
  }

  invokeQuery(query) {
    let cached_query = _.cloneDeep(query.queries[0].query);
    let hash = getHash(cached_query);

    if (this.shouldInvoke(query)) {
      // Invoke query
      return this.kentikAPI.invokeQuery(query)
      .then(result => {
        let timestamp = getUTCTimestamp();

        this.cache[hash] = {
          timestamp: timestamp,
          query: cached_query,
          result: result
        };
        console.log('Invoke query', cached_query, result);
        return result;
      });
    } else {
      // Get from cache
      console.log('Get from cache');
      return Promise.resolve(this.cache[hash].result);
    }
  }

  shouldInvoke(query) {
    let kentik_query = query.queries[0].query;

    let timestamp = getUTCTimestamp();
    let ending_time = Date.parse(kentik_query.ending_time);
    let max_refresh_interval = getMaxRefreshInterval(kentik_query);

    let hash = getHash(kentik_query);

    return (
      !this.cache[hash] ||
      timestamp - ending_time > max_refresh_interval ||
      (this.cache[hash] && timestamp - Date.parse(this.cache[hash].query.ending_time) > max_refresh_interval) ||
      (this.cache[hash] && Date.parse(kentik_query.starting_time) < Date.parse(this.cache[hash].query.starting_time))
    );
  }
}

angular
  .module('grafana.services')
  .service('kentikProxySrv', KentikProxy);
