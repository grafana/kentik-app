'use strict';

System.register(['angular'], function (_export, _context) {
  "use strict";

  var angular, _createClass, KentikAPI;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }],
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

      KentikAPI = function () {

        /** @ngInject */
        function KentikAPI(backendSrv) {
          _classCallCheck(this, KentikAPI);

          this.backendSrv = backendSrv;
          this.baseUrl = 'api/plugin-proxy/kentik-app';
        }

        _createClass(KentikAPI, [{
          key: 'getDevices',
          value: function getDevices() {
            return this._get('/api/v5/devices').then(function (response) {
              if (response.data && response.data.devices) {
                return response.data.devices;
              } else {
                return [];
              }
            });
          }
        }, {
          key: 'getFieldValues',
          value: function getFieldValues(field) {
            var query = 'SELECT DISTINCT ' + field + ' FROM all_devices ORDER BY ' + field + ' ASC';
            return this.invokeSQLQuery(query);
          }
        }, {
          key: 'invokeTopXDataQuery',
          value: function invokeTopXDataQuery(query) {
            var kentik_v5_query = {
              "queries": [{ "query": query, "bucketIndex": 0 }]
            };

            return this._post('/api/v5/query/topXdata', kentik_v5_query);
          }
        }, {
          key: 'invokeSQLQuery',
          value: function invokeSQLQuery(query) {
            var data = {
              "query": query
            };

            return this._post('/api/v5/query/sql', data);
          }
        }, {
          key: '_get',
          value: function _get(url) {
            return this.backendSrv.datasourceRequest({
              method: 'GET',
              url: this.baseUrl + url
            }).catch(function (error) {
              console.log(error);
              if (error.err) {
                return Promise.reject(error.err);
              } else {
                return Promise.reject(error);
              }
            });
          }
        }, {
          key: '_post',
          value: function _post(url, data) {
            return this.backendSrv.datasourceRequest({
              method: 'POST',
              url: this.baseUrl + url,
              data: data
            }).then(function (response) {
              if (response.data) {
                return response.data;
              } else {
                return [];
              }
            }).catch(function (error) {
              console.log(error);
              if (error.err) {
                return Promise.reject(error.err);
              } else {
                return Promise.reject(error);
              }
            });
          }
        }]);

        return KentikAPI;
      }();

      angular.module('grafana.services').service('kentikAPISrv', KentikAPI);
    }
  };
});
//# sourceMappingURL=kentikAPI.js.map
