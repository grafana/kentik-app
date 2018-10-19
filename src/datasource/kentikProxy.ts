import angular from 'angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import './kentikAPI';

function getUTCTimestamp() {
  const ts = new Date();
  return ts.getTime() + ts.getTimezoneOffset() * 60 * 1000;
}

// Get hash of Kentik query
function getHash(queryObj: any) {
  const query = _.cloneDeep(queryObj);
  query.starting_time = null;
  query.ending_time = null;
  return JSON.stringify(query);
}

// Prevent too frequent queries
function getMaxRefreshInterval(query: any) {
  const interval: any = Date.parse(query.ending_time) - Date.parse(query.starting_time);
  if (interval > moment.duration(1, 'months')) {
    return 60 * 60 * 1000; // 1 hour
  } else if (interval > moment.duration(1, 'day')) {
    return 15 * 60 * 1000; // 15 min
  } else {
    return 5 * 60 * 1000; // 5 min
  }
}

export class KentikProxy {
  kentikAPI: any;
  cache: any;
  cacheUpdateInterval: number;
  requestCachingIntervals: { '1d': number };
  getDevices: () => Promise<any[]>;

  /** @ngInject */
  constructor(backendSrv, kentikAPISrv: any) {
    this.kentikAPI = kentikAPISrv;
    this.cache = {};
    this.cacheUpdateInterval = 5 * 60 * 1000; // 5 min by default
    this.requestCachingIntervals = {
      '1d': 0,
    };

    this.getDevices = this.kentikAPI.getDevices.bind(this.kentikAPI);
  }

  invokeTopXDataQuery(query: any) {
    const cachedQuery = _.cloneDeep(query);
    const hash = getHash(cachedQuery);

    if (this.shouldInvoke(query)) {
      // Invoke query
      return this.kentikAPI.invokeTopXDataQuery(query).then(result => {
        const timestamp = getUTCTimestamp();

        this.cache[hash] = {
          timestamp: timestamp,
          query: cachedQuery,
          result: result,
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
  shouldInvoke(query: any) {
    const kentikQuery = query;
    const hash = getHash(kentikQuery);
    const timestamp = getUTCTimestamp();

    const startingTime = Date.parse(kentikQuery.starting_time);
    const endingTime = Date.parse(kentikQuery.ending_time);
    const queryRange = endingTime - startingTime;

    const cacheStartingTime = this.cache[hash] ? Date.parse(this.cache[hash].query.starting_time) : null;
    const cacheEndingTime = this.cache[hash] ? Date.parse(this.cache[hash].query.ending_time) : null;
    const cachedQueryRange = cacheEndingTime - cacheStartingTime;

    const maxRefreshInterval = getMaxRefreshInterval(kentikQuery);

    return (
      !this.cache[hash] ||
      timestamp - endingTime > maxRefreshInterval ||
      (this.cache[hash] &&
        (timestamp - cacheEndingTime > maxRefreshInterval ||
          startingTime < cacheStartingTime ||
          Math.abs(queryRange - cachedQueryRange) > 60 * 1000)) // is time range changed?
    );
  }

  getFieldValues(field: string) {
    let ts = getUTCTimestamp();
    if (this.cache[field] && ts - this.cache[field].ts < this.cacheUpdateInterval) {
      return Promise.resolve(this.cache[field].value);
    } else {
      return this.kentikAPI.getFieldValues(field).then(result => {
        ts = getUTCTimestamp();
        this.cache[field] = {
          ts: ts,
          value: result,
        };

        return result;
      });
    }
  }

  async getCustomDimensions() {
    if (this.cache.customDimensions === undefined) {
      const customDimensions = await this.kentikAPI.getCustomDimensions();
      this.cache.customDimensions = customDimensions.map(dimension => ({
        values: this._getDimensionPopulatorsValues(dimension),
        text: `Custom ${dimension.display_name}`,
        value: dimension.name,
        field: dimension.name
      }));
    }
    return this.cache.customDimensions;
  }

  async getSavedFilters() {
    if (this.cache.savedFilters === undefined) {
      const savedFilters = await this.kentikAPI.getSavedFilters();
      this.cache.savedFilters = _.map(savedFilters, filter => ({
        text: `Saved ${filter.filter_name}`,
        field: filter.filter_name,
        id: filter.id
      }));
    }
    return this.cache.savedFilters;
  }

  private _getDimensionPopulatorsValues(dimension: any) {
    return dimension.populators.reduce((values, populator) => {
      values.push(populator.value);
      return values;
    }, []);
  }
}

angular.module('grafana.services').service('kentikProxySrv', KentikProxy);
