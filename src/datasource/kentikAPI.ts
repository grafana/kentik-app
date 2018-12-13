import { appEvents } from 'grafana/app/core/core';

import * as _ from 'lodash';
import angular from 'angular';

export class KentikAPI {
  baseUrl: string;

  /** @ngInject */
  constructor(public backendSrv: any) {
    this.baseUrl = 'api/plugin-proxy/kentik-app';
  }

  getDevices() {
    return this._get('/api/v5/devices').then(response => {
      if (response.data && response.data.devices) {
        return response.data.devices;
      } else {
        return [];
      }
    });
  }

  getFieldValues(field: string) {
    const query = `SELECT DISTINCT ${field} FROM all_devices ORDER BY ${field} ASC`;
    return this.invokeSQLQuery(query);
  }

  async getCustomDimensions() {
    const data = await this._get('/api/v5/customdimensions');
    return data.data.customDimensions;
  }

  async getSavedFilters() {
    const data = await this._get('/api/v5/saved-filters');
    return data.data;
  }

  invokeTopXDataQuery(query: any) {
    const kentikV5Query = {
      queries: [{ query: query, bucketIndex: 0 }],
    };

    return this._post('/api/v5/query/topXdata', kentikV5Query);
  }

  invokeSQLQuery(query: any) {
    const data = {
      query: query,
    };

    return this._post('/api/v5/query/sql', data);
  }

  _get(url: string) {
    return this.backendSrv
      .datasourceRequest({
        method: 'GET',
        url: this.baseUrl + url,
      })
      .catch(error => {
        showKentikError(error)
        if (error.err) {
          return Promise.reject(error.err);
        } else {
          return Promise.reject(error);
        }
      });
  }

  _post(url: string, data: any) {
    return this.backendSrv
      .datasourceRequest({
        method: 'POST',
        url: this.baseUrl + url,
        data: data,
      })
      .then(response => {
        if (response.data) {
          return response.data;
        } else {
          return [];
        }
      })
      .catch(error => {
        showKentikError(error)
        if (error.err) {
          return Promise.reject(error.err);
        } else {
          return Promise.reject(error);
        }
      });
  }
}

export function showKentikError(error) {
  let message = '';
  message += error.statusText ? error.statusText + ': ' : '';
  if (error.data && error.data.error) {
    message += error.data.error;
  } else if (error.err) {
    message += error.err;
  } else if (_.isString(error)) {
    message += error;
  } else {
    message += 'Cannot connect to Kentik API';
  }
  
  appEvents.emit('alert-error', [`Can't connect to Kentik API`, message]);
}

angular.module('grafana.services').service('kentikAPISrv', KentikAPI);
