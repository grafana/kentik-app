import configTemplate from './config.html';
import { KentikAPI } from '../datasource/kentikAPI';
import { showAlert } from "../datasource/alertHelper";

import * as _ from 'lodash';

class KentikConfigCtrl {
  appEditCtrl: any;
  appModel: any;
  apiValidated: boolean;
  apiError: boolean;
  kentik: KentikAPI;
  static template: any;
  regionTypes = [
    { value: "default", text: "US (default)" },
    { value: "eu", text: "EU" }
  ];

  /** @ngInject */
  constructor($scope, $injector, public backendSrv: any) {
    this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));

    if (!this.appModel.jsonData) {
      this.appModel.jsonData = {};
    }
    if (!this.appModel.secureJsonData) {
      this.appModel.secureJsonData = {};
    }
    if (typeof this.appModel.jsonData.region === 'undefined') {
      this.appModel.jsonData.region = "default";
    }
    this.apiValidated = false;
    this.apiError = false;
    this.kentik = new KentikAPI(this.backendSrv);
    this.kentik.setRegion(this.appModel.jsonData.region);
    if (this.appModel.enabled && this.appModel.jsonData.tokenSet) {
      this.validateApiConnection();
    }
  }

  preUpdate() {
    if (this.appModel.secureJsonData.token) {
      this.appModel.jsonData.tokenSet = true;
    }

    return this.initDatasource();
  }

  async postUpdate() {
    if (!this.appModel.enabled) {
      return Promise.resolve();
    }

    await this.validateApiConnection();    
    await this.appEditCtrl.importDashboards();

    return {
      url: 'dashboard/db/kentik-home',
      message: 'Kentik Connect Pro app installed!',
    };
  }

  // make sure that we can hit the Kentik API.
  async validateApiConnection() {
    try {
      await this.kentik.getUsers();
      this.apiValidated = true;
    } catch (e) {
      showAlert(e);
      this.apiValidated = false;
      this.apiError = true;
    }
  }

  reset() {
    this.appModel.jsonData.email = '';
    this.appModel.jsonData.tokenSet = false;
    this.appModel.jsonData.region = "default";
    this.appModel.secureJsonData = {};
    this.apiValidated = false;
  }

  initDatasource() {
    const self = this;
    //check for existing datasource.
    return self.backendSrv.get('/api/datasources').then(results => {
      let foundKentikDS = false;
      let updateKentikDS = false;
      let dsID = NaN;
      _.forEach(results, ds => {
        // use the type
        if (ds.type === 'kentik-ds') {
          foundKentikDS = true;
          dsID = ds.id;
          // console.log("config.initDatasource: found existing datasource with region: " + ds.jsonData.region);
          if (ds.jsonData.region !== this.appModel.jsonData.region) {
            //console.log("config.initDatasource: need to update existing datasource with region: " + this.appModel.jsonData.region);
            updateKentikDS = true;
          }
          return;
        }
      });
      const promises = [];
      if (!foundKentikDS || updateKentikDS) {
        // create datasource.
        const kentik = {
          name: 'kentik',
          type: 'kentik-ds',
          access: 'proxy',
          jsonData: self.appModel.jsonData,
        };
        if (updateKentikDS) {
          //console.log("onfig.initDatasource: updating datasource");
          promises.push(self.backendSrv.put(`/api/datasources/${dsID}`, kentik));
        } else {
          //console.log("config.initDatasource: reating datasource");
          promises.push(self.backendSrv.post('/api/datasources', kentik));
        }
      }
      // update requires a PUT with the id
      return Promise.all(promises);
    });
  }
}

KentikConfigCtrl.template = configTemplate;

export { KentikConfigCtrl as ConfigCtrl };
