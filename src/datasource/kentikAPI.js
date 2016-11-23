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

  formatV4Query(options) {
    let query = {
      version: "2.01",
      query: {
        device_name: options.deviceNames,
        time_type: 'fixed', // or fixed
        lookback_seconds: 3600,
        starting_time: options.range.from.utc().format("YYYY-MM-DD HH:mm:ss"),
        ending_time: options.range.to.utc().format("YYYY-MM-DD HH:mm:ss"),
        metric: options.metric,
        fast_data: "Auto", // or Fast or Full
        units: options.unit
      },
      filterSettings: {
        connector: 'All',
        filterString: '',
        filterGroups: [
          {
            connector: 'All',
            filterString: "",
            filters: options.kentikFilters
          }
        ]
      }
    };
    return query;
  }

  invokeQuery(query, endpoint = 'timeSeriesData') {
    return this._post('/api/v4/dataExplorer/' + endpoint, query);
  }

  formatV5Query(options) {
    let query = {
      queries: [
        {
          query: {
            device_name: options.deviceNames,
            time_type: 'fixed', // or fixed
            lookback_seconds: 3600,
            starting_time: options.range.from.utc().format("YYYY-MM-DD HH:mm:ss"),
            ending_time: options.range.to.utc().format("YYYY-MM-DD HH:mm:ss"),
            metric: options.metric,
            fast_data: "Auto", // or Fast or Full
            units: options.unit,
            // v5
            outsort: 'avg',
            time_format: 'UTC',
            topx: 10,
            depth: 250,
          },
          filters_obj: {
            connector: 'All',
            filterGroups: [
              {
                connector: 'All',
                filters: options.kentikFilters
              }
            ]
          }
        }
      ]
    };
    return query;
  }

  invokeV5Query(query, endpoint = 'topXchart') {
    return this._post('/api/v5/query/' + endpoint, query);
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
