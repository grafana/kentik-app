import angular from 'angular';

class KentikAPI {
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

  invokeQuery(query, endpoint = 'timeSeriesData') {
    return this._post('/api/v4/dataExplorer/' + endpoint, query);
  }

  _get(url) {
    return this.backendSrv.datasourceRequest({
      method: 'GET',
      url: this.baseUrl + url,
    });
  }

  _post(url, data) {
    return this.backendSrv.datasourceRequest({
      method: 'POST',
      url: this.baseUrl + url,
      data: data
    });
  }
}

angular
  .module('grafana.services')
  .service('kentikAPISrv', KentikAPI);
