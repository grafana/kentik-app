'use strict';

System.register(['angular', 'lodash', 'moment', './kentikAPI'], function (_export, _context) {
  "use strict";

  var angular, _, moment, _createClass, KentikProxy;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function getUTCTimestamp() {
    var ts = new Date();
    return ts.getTime() + ts.getTimezoneOffset() * 60 * 1000;
  }

  // Get hash of Kentik query
  function getHash(queryObj) {
    var query = _.cloneDeep(queryObj);
    query.starting_time = null;
    query.ending_time = null;
    return JSON.stringify(query);
  }

  // Prevent too frequent queries
  function getMaxRefreshInterval(query) {
    var interval = Date.parse(query.ending_time) - Date.parse(query.starting_time);
    if (interval > moment.duration(1, 'months')) {
      return 60 * 60 * 1000; // 1 hour
    } else if (interval > moment.duration(1, 'day')) {
      return 15 * 60 * 1000; // 15 min
    } else {
      return 5 * 60 * 1000; // 5 min
    }
  }

  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_kentikAPI) {}],
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

      KentikProxy = function () {
        function KentikProxy(backendSrv, kentikAPISrv) {
          _classCallCheck(this, KentikProxy);

          this.kentikAPI = kentikAPISrv;
          this.cache = {};
          this.cacheUpdateInterval = 5 * 60 * 1000; // 5 min by default
          this.requestCachingIntervals = {
            '1d': 0
          };

          this.getDevices = this.kentikAPI.getDevices.bind(this.kentikAPI);
        }

        _createClass(KentikProxy, [{
          key: 'invokeTopXDataQuery',
          value: function invokeTopXDataQuery(query) {
            var _this = this;

            var cached_query = _.cloneDeep(query);
            var hash = getHash(cached_query);

            if (this.shouldInvoke(query)) {
              // Invoke query
              return this.kentikAPI.invokeTopXDataQuery(query).then(function (result) {
                var timestamp = getUTCTimestamp();

                _this.cache[hash] = {
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
        }, {
          key: 'shouldInvoke',
          value: function shouldInvoke(query) {
            var kentik_query = query;
            var hash = getHash(kentik_query);
            var timestamp = getUTCTimestamp();

            var starting_time = Date.parse(kentik_query.starting_time);
            var ending_time = Date.parse(kentik_query.ending_time);
            var query_range = ending_time - starting_time;

            var cache_starting_time = this.cache[hash] ? Date.parse(this.cache[hash].query.starting_time) : null;
            var cache_ending_time = this.cache[hash] ? Date.parse(this.cache[hash].query.ending_time) : null;
            var cached_query_range = cache_ending_time - cache_starting_time;

            var max_refresh_interval = getMaxRefreshInterval(kentik_query);

            return !this.cache[hash] || timestamp - ending_time > max_refresh_interval || this.cache[hash] && (timestamp - cache_ending_time > max_refresh_interval || starting_time < cache_starting_time || Math.abs(query_range - cached_query_range) > 60 * 1000 // is time range changed?
            );
          }
        }, {
          key: 'getFieldValues',
          value: function getFieldValues(field) {
            var _this2 = this;

            var ts = getUTCTimestamp();
            if (this.cache[field] && ts - this.cache[field].ts < this.cacheUpdateInterval) {
              return Promise.resolve(this.cache[field].value);
            } else {
              return this.kentikAPI.getFieldValues(field).then(function (result) {
                ts = getUTCTimestamp();
                _this2.cache[field] = {
                  ts: ts,
                  value: result
                };

                return result;
              });
            }
          }
        }]);

        return KentikProxy;
      }();

      angular.module('grafana.services').service('kentikProxySrv', KentikProxy);
    }
  };
});
//# sourceMappingURL=kentikProxy.js.map
