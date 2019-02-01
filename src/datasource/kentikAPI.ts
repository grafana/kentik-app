import { appEvents } from 'grafana/app/core/core';

import * as _ from 'lodash';
import angular from 'angular';
import { getRegion } from "./regionHelper";

export class KentikAPI {
  baseUrl: string;
  region: string;
  apiReady: boolean;
  /** @ngInject */
  constructor(public backendSrv: any) {
    this.apiReady = false;
    this.baseUrl = "/api/plugin-proxy/kentik-app";
    // get region from datasource
    backendSrv.get('/api/datasources').then( (allDS: any) => {
      this.region = getRegion(allDS);
      this.setRegion(this.region);
      this.apiReady = true;
    });
  }

  setRegion(region: string) {
    this.region = region;
  }

  async getDevices() {
    this.backendSrv.get('/api/datasources').then( (allDS: any) => {
      this.region = getRegion(allDS);
      this.setRegion(this.region);
      this.apiReady = true;
    });

    const resp = await this._get('/api/v5/devices');

    if (resp.data && resp.data.devices) {
      return resp.data.devices;
    } else {
      return [];
    }
  }

  getUsers() {
    return this._get('/api/v5/users');
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

  async _get(url: string) {
    // if the region is not set, get it from the datasource
    if (typeof this.region === 'undefined') {
      //console.log("_get: this.region UNDEFINED, fetching");
      await this.backendSrv.get('/api/datasources').then( (allDS: any) => {
        this.setRegion(getRegion(allDS));
        //console.log("kentikAPI: _get: FETCHED region " + this.region);
      });
    }
    return this.backendSrv
      .datasourceRequest({
        method: 'GET',
        url: this.baseUrl + "/" + this.region + url,
      })
      .catch(error => {
        console.error(error);
        if (error.err) {
          return Promise.reject(error.err);
        } else {
          return Promise.reject(error);
        }
      });
  }

  async _post(url: string, data: any) {
    // if the region is not set, get it from the datasource
    if (typeof this.region === 'undefined') {
      //console.log("kentikAPI._post: this.region UNDEFINED, fetching");
      await this.backendSrv.get('/api/datasources').then( (allDS: any) => {
        this.setRegion(getRegion(allDS));
        //console.log("kentikAPI._post: FETCHED region " + this.region);
      });
    }
    return this.backendSrv
      .datasourceRequest({
        method: 'POST',
        url: this.baseUrl + "/" + this.region + url,
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
        console.error(error);
        if (error.err) {
          return Promise.reject(error.err);
        } else {
          return Promise.reject(error);
        }
      });
  }
}

export function showAlert(error) {
  let message = '';
  message += error.status ? `(${error.status}) ` : '';
  message += error.statusText ? error.statusText + ': ' : '';
  if (error.data && error.data.error) {
    message += error.data.error;
  } else if (error.err) {
    message += error.err;
  } else if (_.isString(error)) {
    message += error;
  }

  appEvents.emit('alert-error', ["Can't connect to Kentik API", message]);
}

angular.module('grafana.services').service('kentikAPISrv', KentikAPI);
