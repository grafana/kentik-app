import angular from 'angular';

class KentikAPI {

  /** @ngInject */
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

  getFieldValues(field) {
    let query = `SELECT DISTINCT ${field} FROM all_devices ORDER BY ${field} ASC`;
    return this.invokeSQLQuery(query);
  }

  invokeTopXDataQuery(query) {
    let kentik_v5_query = {
      "queries": [
        { "query": query, "bucketIndex": 0 }
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
    }).catch(error => {
      console.log(error);
      if (error.err) {
        return Promise.reject(error.err);
      } else {
        return Promise.reject(error);
      }
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
    }).catch(error => {
      console.log(error);
      if (error.err) {
        return Promise.reject(error.err);
      } else {
        return Promise.reject(error);
      }
    });
  }
}

angular
  .module('grafana.services')
  .service('kentikAPISrv', KentikAPI);
